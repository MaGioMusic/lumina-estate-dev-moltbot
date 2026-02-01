import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextAuthOptions';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sanitizeFields } from '@/lib/sanitize';

// Validation schema for contact
const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(100, 'Last name too long'),
  email: z.string().email('Invalid email').max(255, 'Email too long').optional(),
  phone: z.string().max(50, 'Phone too long').optional(),
  status: z.enum(['lead', 'prospect', 'client']).default('lead'),
  source: z.string().max(100, 'Source too long').optional(),
  notes: z.string().max(5000, 'Notes too long').optional(),
});

// GET /api/contacts - List all contacts for the agent
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    // SECURITY FIX: Add pagination to prevent DoS
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')));
    const skip = (page - 1) * limit;

    const where: any = {
      assignedAgentId: session.user.id,
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      // SECURITY FIX: Validate and sanitize search input
      const sanitizedSearch = search.trim().slice(0, 100);
      if (!/^[a-zA-Z0-9\s@.-]*$/.test(sanitizedSearch)) {
        return NextResponse.json({ error: 'Invalid search query' }, { status: 400 });
      }
      where.OR = [
        { firstName: { contains: sanitizedSearch, mode: 'insensitive' } },
        { lastName: { contains: sanitizedSearch, mode: 'insensitive' } },
        { email: { contains: sanitizedSearch, mode: 'insensitive' } },
      ];
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        include: {
          assignedAgent: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          deals: {
            select: { id: true, title: true, stage: true, value: true },
          },
          _count: {
            select: { tasks: true, notes: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.contact.count({ where }),
    ]);

    return NextResponse.json({ 
      success: true, 
      contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

// POST /api/contacts - Create new contact
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = contactSchema.parse(body);
    
    // SECURITY FIX: Sanitize string inputs to prevent XSS
    const sanitizedData = sanitizeFields(validatedData, [
      'firstName', 'lastName', 'email', 'phone', 'source', 'notes'
    ]);

    const contact = await prisma.contact.create({
      data: {
        ...sanitizedData,
        assignedAgentId: session.user.id,
      },
      include: {
        assignedAgent: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    return NextResponse.json({ success: true, contact }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}