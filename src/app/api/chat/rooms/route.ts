import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextAuthOptions';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const rooms = await prisma.chatRoom.findMany({
      where: {
        members: {
          some: { userId: session.user.id }
        }
      },
      include: {
        members: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, avatar: true } }
          }
        },
        _count: { select: { messages: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ success: true, rooms });
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name, type = 'group', memberIds = [] } = await req.json();

    const room = await prisma.chatRoom.create({
      data: {
        name,
        type,
        createdById: session.user.id,
        members: {
          create: [
            { userId: session.user.id, role: 'admin' },
            ...memberIds.map((id: string) => ({ userId: id, role: 'member' }))
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
    console.error('Error creating chat room:', error);
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
}