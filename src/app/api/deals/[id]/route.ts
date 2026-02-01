import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextAuthOptions';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sanitizeFields } from '@/lib/sanitize';
import { enforceRateLimit } from '@/lib/security/rateLimiter';

const dealUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  stage: z.enum(['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost']).optional(),
  value: z.number().min(0).optional(),
  currency: z.enum(['GEL', 'USD', 'EUR', 'RUB']).optional(),
  probability: z.number().min(0).max(100).optional(),
  expectedCloseDate: z.string().datetime().optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
}).strict();

// GET /api/deals/[id] - Get single deal
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    enforceRateLimit(`deals:get-one:${session.user.id}`, {
      limit: 100,
      windowMs: 60_000,
      feature: 'deal get'
    });

    const deal = await prisma.deal.findFirst({
      where: {
        id: params.id,
        agentId: session.user.id,
      },
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
    });

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, deal });
  } catch (error) {
    console.error('Error fetching deal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deal' },
      { status: 500 }
    );
  }
}

// PATCH /api/deals/[id] - Update deal
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    enforceRateLimit(`deals:update:${session.user.id}`, {
      limit: 30,
      windowMs: 60_000,
      feature: 'deal update'
    });

    // Find deal and verify ownership
    const existingDeal = await prisma.deal.findFirst({
      where: {
        id: params.id,
        agentId: session.user.id,
      },
    });

    if (!existingDeal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = dealUpdateSchema.parse(body);
    
    const sanitizedData = sanitizeFields(validatedData, ['title', 'description']);

    const deal = await prisma.deal.update({
      where: { id: params.id },
      data: {
        ...sanitizedData,
        expectedCloseDate: sanitizedData.expectedCloseDate
          ? new Date(sanitizedData.expectedCloseDate)
          : undefined,
        actualCloseDate: sanitizedData.stage?.startsWith('closed')
          ? new Date()
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

    return NextResponse.json({ success: true, deal });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating deal:', error);
    return NextResponse.json(
      { error: 'Failed to update deal' },
      { status: 500 }
    );
  }
}

// DELETE /api/deals/[id] - Delete deal
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    enforceRateLimit(`deals:delete:${session.user.id}`, {
      limit: 10,
      windowMs: 60_000,
      feature: 'deal deletion'
    });

    // Find deal and verify ownership
    const existingDeal = await prisma.deal.findFirst({
      where: {
        id: params.id,
        agentId: session.user.id,
      },
    });

    if (!existingDeal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    await prisma.deal.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Deal deleted' });
  } catch (error) {
    console.error('Error deleting deal:', error);
    return NextResponse.json(
      { error: 'Failed to delete deal' },
      { status: 500 }
    );
  }
}
