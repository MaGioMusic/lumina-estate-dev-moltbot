import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextAuthOptions';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sanitizeFields } from '@/lib/sanitize';
import { enforceRateLimit } from '@/lib/security/rateLimiter';

const taskUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  status: z.enum(['pending', 'in_progress', 'completed']).optional(),
}).strict();

// GET /api/tasks/[id] - Get single task
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    enforceRateLimit(`tasks:get-one:${session.user.id}`, {
      limit: 100,
      windowMs: 60_000,
      feature: 'task get'
    });

    const task = await prisma.task.findFirst({
      where: {
        id: params.id,
        OR: [
          { assignedToId: session.user.id },
          { createdById: session.user.id },
        ],
      },
      include: {
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
        deal: { select: { id: true, title: true } },
        contact: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

// PATCH /api/tasks/[id] - Update task
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    enforceRateLimit(`tasks:update:${session.user.id}`, {
      limit: 30,
      windowMs: 60_000,
      feature: 'task update'
    });

    // Find task and verify ownership
    const existingTask = await prisma.task.findFirst({
      where: {
        id: params.id,
        OR: [
          { assignedToId: session.user.id },
          { createdById: session.user.id },
        ],
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = taskUpdateSchema.parse(body);
    
    const sanitizedData = sanitizeFields(validatedData, ['title', 'description']);

    const task = await prisma.task.update({
      where: { id: params.id },
      data: {
        ...sanitizedData,
        dueDate: sanitizedData.dueDate ? new Date(sanitizedData.dueDate) : undefined,
        completedAt: sanitizedData.status === 'completed' ? new Date() : undefined,
      },
      include: {
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
        deal: { select: { id: true, title: true } },
        contact: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    return NextResponse.json({ success: true, task });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] - Delete task
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    enforceRateLimit(`tasks:delete:${session.user.id}`, {
      limit: 20,
      windowMs: 60_000,
      feature: 'task deletion'
    });

    // Find task and verify ownership
    const existingTask = await prisma.task.findFirst({
      where: {
        id: params.id,
        OR: [
          { assignedToId: session.user.id },
          { createdById: session.user.id },
        ],
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    await prisma.task.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
