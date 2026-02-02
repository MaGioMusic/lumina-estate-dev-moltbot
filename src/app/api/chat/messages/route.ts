import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { nextAuthOptions as authOptions } from '@/lib/auth/nextAuthOptions';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sanitizeFields } from '@/lib/sanitize';

// SECURITY FIX: Add validation schema for chat messages
const chatMessageSchema = z.object({
  roomId: z.string().uuid('Invalid room ID'),
  content: z.string().min(1, 'Message content is required').max(5000, 'Message too long'),
  type: z.enum(['text', 'image', 'file', 'system']).default('text'),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('roomId');
    if (!roomId) return NextResponse.json({ error: 'Room ID required' }, { status: 400 });
    
    // SECURITY FIX: Add pagination to prevent DoS
    const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(
      200,
      Math.max(1, Number.parseInt(searchParams.get('limit') || '100', 10) || 100),
    );
    const skip = (page - 1) * limit;

    // Verify user is member of room
    const membership = await prisma.chatRoomMember.findUnique({
      where: { roomId_userId: { roomId, userId: session.user.id } }
    });
    if (!membership) return NextResponse.json({ error: 'Access denied' }, { status: 403 });

    const where = { roomId, isDeleted: false };

    const [messages, total] = await Promise.all([
      prisma.chatMessage.findMany({
        where,
        include: {
          sender: { select: { id: true, firstName: true, lastName: true, avatar: true } }
        },
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
      }),
      prisma.chatMessage.count({ where }),
    ]);

    return NextResponse.json({ 
      success: true, 
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const validatedData = chatMessageSchema.parse(body);
    
    // SECURITY FIX: Sanitize string inputs to prevent XSS
    const sanitizedData = sanitizeFields(validatedData, ['content']);
    const messageType = sanitizedData.type === 'system' ? 'text' : sanitizedData.type;

    // Verify user is member of room
    const membership = await prisma.chatRoomMember.findUnique({
      where: { roomId_userId: { roomId: sanitizedData.roomId, userId: session.user.id } }
    });
    if (!membership) return NextResponse.json({ error: 'Access denied' }, { status: 403 });

    const message = await prisma.chatMessage.create({
      data: {
        roomId: sanitizedData.roomId,
        senderId: session.user.id,
        content: sanitizedData.content,
        type: messageType,
      },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, avatar: true } }
      }
    });

    // Update room's updatedAt
    await prisma.chatRoom.update({
      where: { id: sanitizedData.roomId },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}