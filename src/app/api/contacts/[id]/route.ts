import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextAuthOptions';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sanitizeFields } from '@/lib/sanitize';
import { enforceRateLimit } from '@/lib/security/rateLimiter';

const contactUpdateSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  email: z.string().email().max(255).optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  status: z.enum(['lead', 'prospect', 'client']).optional(),
  source: z.string().max(100).optional().nullable(),
  notes: z.string().max(5000).optional().nullable(),
});

// GET /api/contacts/[id] - Get single contact
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting
    enforceRateLimit(`contacts:get-one:${session.user.id}`, {
      limit: 100,
      windowMs: 60_000,
      feature: 'contact get'
    });

    const contact = await prisma.contact.findFirst({
      where: {
        id: params.id,
        assignedAgentId: session.user.id,
      },
      include: {
        deals: {
          orderBy: { createdAt: 'desc' },
        },
        tasks: {
          orderBy: { dueDate: 'asc' },
        },
        notes: {
          include: {
            createdBy: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        assignedAgent: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, contact });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 }
    );
  }
}

// PATCH /api/contacts/[id] - Update contact
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting
    enforceRateLimit(`contacts:update:${session.user.id}`, {
      limit: 30,
      windowMs: 60_000,
      feature: 'contact update'
    });

    const existingContact = await prisma.contact.findFirst({
      where: {
        id: params.id,
        assignedAgentId: session.user.id,
      },
    });

    if (!existingContact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = contactUpdateSchema.parse(body);
    
    // SECURITY FIX: Sanitize string inputs to prevent XSS
    const sanitizedData = sanitizeFields(validatedData, [
      'firstName', 'lastName', 'email', 'phone', 'source', 'notes'
    ]);

    const contact = await prisma.contact.update({
      where: { id: params.id },
      data: sanitizedData,
      include: {
        assignedAgent: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    return NextResponse.json({ success: true, contact });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    );
  }
}

// DELETE /api/contacts/[id] - Delete contact
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting
    enforceRateLimit(`contacts:delete:${session.user.id}`, {
      limit: 20,
      windowMs: 60_000,
      feature: 'contact deletion'
    });

    const existingContact = await prisma.contact.findFirst({
      where: {
        id: params.id,
        assignedAgentId: session.user.id,
      },
    });

    if (!existingContact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    await prisma.contact.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}