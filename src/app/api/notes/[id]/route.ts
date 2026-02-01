import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextAuthOptions';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sanitizeFields } from '@/lib/sanitize';
import { enforceRateLimit } from '@/lib/security/rateLimiter';

const noteUpdateSchema = z.object({
  content: z.string().min(1).max(10000).optional(),
}).strict();

// GET /api/notes/[id] - Get single note
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    enforceRateLimit(`notes:get-one:${session.user.id}`, {
      limit: 100,
      windowMs: 60_000,
      feature: 'note get'
    });

    const note = await prisma.note.findFirst({
      where: {
        id: params.id,
        createdById: session.user.id,
      },
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        contact: { select: { id: true, firstName: true, lastName: true } },
        deal: { select: { id: true, title: true } },
      },
    });

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, note });
  } catch (error) {
    console.error('Error fetching note:', error);
    return NextResponse.json(
      { error: 'Failed to fetch note' },
      { status: 500 }
    );
  }
}

// PATCH /api/notes/[id] - Update note
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    enforceRateLimit(`notes:update:${session.user.id}`, {
      limit: 30,
      windowMs: 60_000,
      feature: 'note update'
    });

    // Find note and verify ownership
    const existingNote = await prisma.note.findFirst({
      where: {
        id: params.id,
        createdById: session.user.id,
      },
    });

    if (!existingNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = noteUpdateSchema.parse(body);
    
    const sanitizedData = sanitizeFields(validatedData, ['content']);

    const note = await prisma.note.update({
      where: { id: params.id },
      data: sanitizedData,
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        contact: { select: { id: true, firstName: true, lastName: true } },
        deal: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json({ success: true, note });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating note:', error);
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 }
    );
  }
}

// DELETE /api/notes/[id] - Delete note
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    enforceRateLimit(`notes:delete:${session.user.id}`, {
      limit: 20,
      windowMs: 60_000,
      feature: 'note deletion'
    });

    // Find note and verify ownership
    const existingNote = await prisma.note.findFirst({
      where: {
        id: params.id,
        createdById: session.user.id,
      },
    });

    if (!existingNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    await prisma.note.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Note deleted' });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    );
  }
}
