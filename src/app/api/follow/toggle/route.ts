import { prisma } from '@/shared/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();
  const { userId, streamerId } = body;

  try {
    const followers = await prisma.follower.findMany({
      where: {
        userId,
        streamerId,
      },
      select: {
        id: true,
      },
    });
    if (followers) {
      await prisma.follower.delete({
        where: {
          id: followers[0]?.id,
        },
      });
    } else {
      await prisma.follower.create({
        data: {
          userId,
          streamerId,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: '팔로우 토글 실패', detail: String(e) }, { status: 500 });
  }
}
