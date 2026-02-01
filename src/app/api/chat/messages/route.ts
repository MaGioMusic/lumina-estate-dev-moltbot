import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { nextAuthOptions as authOptions } from '@/lib/auth/nextAuthOptions';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sanitizeFields, sanitizeString } from '@/lib/sanitize';
import { enforceRateLimit } from '@/lib/security/rateLimiter';

// SECURITY FIX: Add security headers to prevent XSS
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'none'; object-src 'none'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

// SECURITY FIX: Add validation schema for chat messages
const chatMessageSchema = z.object({
  roomId: z.string().uuid('Invalid room ID'),
  content: z.string().min(1, 'Message content is required').max(5000, 'Message too long'),
  type: z.enum(['text', 'image', 'file', 'system']).default('text'),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: securityHeaders }
      );
    }

    // Rate limiting
    enforceRateLimit(`chat:messages:get:${session.user.id}`, {
      limit: 100,
      windowMs: 60_000,
      feature: 'chat messages list'
    });

    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('roomId');
    if (!roomId) {
      return NextResponse.json(
        { error: 'Room ID required' },
        { status: 400, headers: securityHeaders }
      );
    }
    
    // SECURITY FIX: Add pagination to prevent DoS
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') || '100')));
    const skip = (page - 1) * limit;

    // Verify user is member of room
    const membership = await prisma.chatRoomMember.findUnique({
      where: { roomId_userId: { roomId, userId: session.user.id } }
    });
    if (!membership) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403, headers: securityHeaders }
      );
    }

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

    // SECURITY FIX: Sanitize message content in GET response
    const sanitizedMessages = messages.map(msg => ({
      ...msg,
      content: sanitizeString(msg.content) || '',
      sender: msg.sender ? {
        ...msg.sender,
        firstName: sanitizeString(msg.sender.firstName) || '',
        lastName: sanitizeString(msg.sender.lastName) || '',
      } : null,
    }));

    return NextResponse.json({ 
      success: true, 
      messages: sanitizedMessages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    }, { headers: securityHeaders });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500, headers: securityHeaders }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: securityHeaders }
      );
    }

    // Rate limiting
    enforceRateLimit(`chat:messages:create:${session.user.id}`, {
      limit: 50,
      windowMs: 60_000,
      feature: 'chat message creation'
    });

    const body = await req.json();
    const validatedData = chatMessageSchema.parse(body);
    
    // SECURITY FIX: Sanitize string inputs to prevent XSS
    const sanitizedData = sanitizeFields(validatedData, ['content']);

    // Verify user is member of room
    const membership = await prisma.chatRoomMember.findUnique({
      where: { roomId_userId: { roomId: sanitizedData.roomId, userId: session.user.id } }
    });
    if (!membership) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403, headers: securityHeaders }
      );
    }

    const message = await prisma.chatMessage.create({
      data: {
        roomId: sanitizedData.roomId,
        senderId: session.user.id,
        content: sanitizedData.content,
        type: sanitizedData.type,
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

    // SECURITY FIX: Sanitize message in response and add security headers
    const sanitizedMessage = {
      ...message,
      content: sanitizeString(message.content) || '',
      sender: message.sender ? {
        ...message.sender,
        firstName: sanitizeString(message.sender.firstName) || '',
        lastName: sanitizeString(message.sender.lastName) || '',
      } : null,
    };

    return NextResponse.json(
      { success: true, message: sanitizedMessage },
      { status: 201, headers: securityHeaders }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400, headers: securityHeaders }
      );
    }
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500, headers: securityHeaders }
    );
  }
}