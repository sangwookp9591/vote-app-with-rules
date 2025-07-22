import { prisma } from '@/shared/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();
  const { userId, streamerId } = body;
  console.log('userId, streamerId  : ', userId, streamerId);
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const streamer = await prisma.user.findUnique({ where: { id: streamerId } });

    if (!user || !streamer) {
      return NextResponse.json({ error: '존재하지 않는 사용자입니다.' }, { status: 400 });
    }

    const followers = await prisma.follower.findMany({
      where: {
        userId,
        streamerId,
      },
      select: {
        id: true,
      },
    });

    console.log('followers : ', followers);
    if (followers?.length > 0) {
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
