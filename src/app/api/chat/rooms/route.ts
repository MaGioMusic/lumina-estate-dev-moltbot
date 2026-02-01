import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextAuthOptions';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sanitizeFields } from '@/lib/sanitize';

// SECURITY FIX: Add validation schema for chat room creation
const chatRoomSchema = z.object({
  name: z.string().min(1, 'Room name is required').max(100, 'Room name too long'),
  type: z.enum(['direct', 'group']).default('group'),
  memberIds: z.array(z.string().uuid('Invalid member ID')).max(50, 'Too many members').default([]),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    // SECURITY FIX: Add pagination to prevent DoS
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')));
    const skip = (page - 1) * limit;

    const where = {
      members: {
        some: { userId: session.user.id }
      }
    };

    const [rooms, total] = await Promise.all([
      prisma.chatRoom.findMany({
        where,
        include: {
          members: {
            include: {
              user: { select: { id: true, firstName: true, lastName: true, avatar: true } }
            }
          },
          _count: { select: { messages: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.chatRoom.count({ where }),
    ]);

    return NextResponse.json({ 
      success: true, 
      rooms,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const validatedData = chatRoomSchema.parse(body);
    
    // SECURITY FIX: Sanitize string inputs to prevent XSS
    const sanitizedData = sanitizeFields(validatedData, ['name']);

    const room = await prisma.chatRoom.create({
      data: {
        name: sanitizedData.name,
        type: sanitizedData.type,
        createdById: session.user.id,
        members: {
          create: [
            { userId: session.user.id, role: 'admin' },
            ...sanitizedData.memberIds.map((id: string) => ({ userId: id, role: 'member' }))
          ]
        }
      },
      include: {
        members: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true } }
          }
        }
      }
    });

    return NextResponse.json({ success: true, room }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating chat room:', error);
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
}