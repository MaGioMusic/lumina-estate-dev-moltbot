import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextAuthOptions';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sanitizeFields } from '@/lib/sanitize';

const dealSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  contactId: z.string().uuid('Invalid contact ID'),
  stage: z.enum(['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost']).default('lead'),
  value: z.number().min(0).optional(),
  currency: z.enum(['GEL', 'USD', 'EUR', 'RUB']).default('GEL'),
  probability: z.number().min(0).max(100).optional(),
  expectedCloseDate: z.string().datetime().optional(),
  description: z.string().max(5000, 'Description too long').optional(),
});

// GET /api/deals - List all deals for the agent
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const stage = searchParams.get('stage');
    const contactId = searchParams.get('contactId');
    
    // SECURITY FIX: Add pagination to prevent DoS
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')));
    const skip = (page - 1) * limit;

    const where: any = {
      agentId: session.user.id,
    };

    if (stage) {
      where.stage = stage;
    }

    if (contactId) {
      where.contactId = contactId;
    }

    const [deals, total] = await Promise.all([
      prisma.deal.findMany({
        where,
        include: {
          contact: {
            select: { id: true, firstName: true, lastName: true, email: true, phone: true },
          },
          agent: {
            select: { id: true, firstName: true, lastName: true },
          },
          _count: {
            select: { tasks: true, notes: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.deal.count({ where }),
    ]);

    // Group by stage for pipeline view
    const pipeline = {
      lead: deals.filter(d => d.stage === 'lead'),
      qualified: deals.filter(d => d.stage === 'qualified'),
      proposal: deals.filter(d => d.stage === 'proposal'),
      negotiation: deals.filter(d => d.stage === 'negotiation'),
      closed_won: deals.filter(d => d.stage === 'closed_won'),
      closed_lost: deals.filter(d => d.stage === 'closed_lost'),
    };

    const stats = {
      total,
      totalValue: deals.reduce((sum, d) => sum + (d.value?.toNumber() || 0), 0),
      wonValue: deals
        .filter(d => d.stage === 'closed_won')
        .reduce((sum, d) => sum + (d.value?.toNumber() || 0), 0),
    };

    return NextResponse.json({ 
      success: true, 
      deals, 
      pipeline, 
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}

// POST /api/deals - Create new deal
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = dealSchema.parse(body);
    
    // SECURITY FIX: Sanitize string inputs to prevent XSS
    const sanitizedData = sanitizeFields(validatedData, ['title', 'description']);

    // Verify contact belongs to agent
    const contact = await prisma.contact.findFirst({
      where: {
        id: validatedData.contactId,
        assignedAgentId: session.user.id,
      },
    });

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found or not assigned to you' },
        { status: 404 }
      );
    }

    const deal = await prisma.deal.create({
      data: {
        ...sanitizedData,
        agentId: session.user.id,
        expectedCloseDate: sanitizedData.expectedCloseDate
          ? new Date(validatedData.expectedCloseDate)
          : undefined,
      },
      include: {
        contact: {
          select: { id: true, firstName: true, lastName: true },
        },
        agent: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    return NextResponse.json({ success: true, deal }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating deal:', error);
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    );
  }
}