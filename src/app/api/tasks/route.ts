import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { AccountRole } from '@prisma/client';
import { authOptions } from '@/lib/auth/nextAuthOptions';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sanitizeFields } from '@/lib/sanitize';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(2000, 'Description too long').optional(),
  assignedToId: z.string().uuid(),
  dealId: z.string().uuid().optional(),
  contactId: z.string().uuid().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  status: z.enum(['pending', 'in_progress', 'completed']).default('pending'),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const assignedToMe = searchParams.get('assignedToMe') === 'true';
    
    // SECURITY FIX: Add pagination to prevent DoS
    const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(searchParams.get('limit') || '50', 10) || 50),
    );
    const skip = (page - 1) * limit;

    // SECURITY FIX: Always filter by user's tasks - prevent unauthorized access
    const where: any = {
      assignedToId: session.user.id,
    };
    
    if (status) where.status = status;
    if (priority) where.priority = priority;
    // Note: assignedToMe is now redundant since we always filter by assignedToId

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          assignedTo: { select: { id: true, firstName: true, lastName: true } },
          deal: { select: { id: true, title: true } },
          contact: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { dueDate: 'asc' },
        skip,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);

    return NextResponse.json({ 
      success: true, 
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const validatedData = taskSchema.parse(body);
    const accountRole = (session.user as { accountRole?: AccountRole }).accountRole;
    const isAdmin = accountRole === 'ADMIN' || accountRole === 'DEVELOPER';

    if (validatedData.assignedToId !== session.user.id && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (validatedData.contactId) {
      const contact = await prisma.contact.findUnique({
        where: { id: validatedData.contactId },
        select: { assignedAgentId: true },
      });
      if (!contact) {
        return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
      }
      if (!isAdmin && contact.assignedAgentId !== session.user.id) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    if (validatedData.dealId) {
      const deal = await prisma.deal.findUnique({
        where: { id: validatedData.dealId },
        select: { agentId: true },
      });
      if (!deal) {
        return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
      }
      if (!isAdmin && deal.agentId !== session.user.id) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }
    
    // SECURITY FIX: Sanitize string inputs to prevent XSS
    const sanitizedData = sanitizeFields(validatedData, ['title', 'description']);

    const task = await prisma.task.create({
      data: {
        ...sanitizedData,
        dueDate: sanitizedData.dueDate ? new Date(sanitizedData.dueDate) : undefined,
      },
      include: {
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
        deal: { select: { id: true, title: true } },
        contact: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    return NextResponse.json({ success: true, task }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}