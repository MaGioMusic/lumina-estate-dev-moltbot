import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { nextAuthOptions as authOptions } from '@/lib/auth/nextAuthOptions';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sanitizeFields } from '@/lib/sanitize';
import { enforceRateLimit } from '@/lib/security/rateLimiter';

const noteSchema = z.object({
  content: z.string().min(1, 'Content is required').max(10000, 'Content too long'),
  contactId: z.string().uuid().optional(),
  dealId: z.string().uuid().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Rate limiting
    enforceRateLimit(`notes:get:${session.user.id}`, {
      limit: 100,
      windowMs: 60_000,
      feature: 'notes list'
    });

    const { searchParams } = new URL(req.url);
    const contactId = searchParams.get('contactId');
    const dealId = searchParams.get('dealId');
    
    // SECURITY FIX: Add pagination to prevent DoS
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')));
    const skip = (page - 1) * limit;

    // SECURITY FIX: Verify user has access to the contact/deal before querying notes
    if (contactId) {
      const contact = await prisma.contact.findFirst({
        where: {
          id: contactId,
          assignedAgentId: session.user.id,
        },
      });
      if (!contact) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    if (dealId) {
      const deal = await prisma.deal.findFirst({
        where: {
          id: dealId,
          agentId: session.user.id,
        },
      });
      if (!deal) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    const where: any = { createdById: session.user.id };
    if (contactId) where.contactId = contactId;
    if (dealId) where.dealId = dealId;

    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where,
        include: {
          createdBy: { select: { id: true, firstName: true, lastName: true } },
          contact: { select: { id: true, firstName: true, lastName: true } },
          deal: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.note.count({ where }),
    ]);

    return NextResponse.json({ 
      success: true, 
      notes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Rate limiting
    enforceRateLimit(`notes:create:${session.user.id}`, {
      limit: 30,
      windowMs: 60_000,
      feature: 'note creation'
    });

    const body = await req.json();
    const validatedData = noteSchema.parse(body);
    
    // SECURITY FIX: Sanitize string inputs to prevent XSS
    const sanitizedData = sanitizeFields(validatedData, ['content']);

    // SECURITY: Verify contact ownership if specified
    if (sanitizedData.contactId) {
      const contact = await prisma.contact.findFirst({
        where: { id: sanitizedData.contactId, assignedAgentId: session.user.id }
      });
      if (!contact) {
        return NextResponse.json({ error: 'Contact not found or access denied' }, { status: 404 });
      }
    }

    // SECURITY: Verify deal ownership if specified
    if (sanitizedData.dealId) {
      const deal = await prisma.deal.findFirst({
        where: { id: sanitizedData.dealId, agentId: session.user.id }
      });
      if (!deal) {
        return NextResponse.json({ error: 'Deal not found or access denied' }, { status: 404 });
      }
    }

    const note = await prisma.note.create({
      data: {
        ...sanitizedData,
        createdById: session.user.id,
      },
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        contact: { select: { id: true, firstName: true, lastName: true } },
        deal: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json({ success: true, note }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    console.error('Error creating note:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}