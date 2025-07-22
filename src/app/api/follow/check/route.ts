import { prisma } from '@/shared/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const streamerId = searchParams.get('streamerId');

  if (userId && streamerId) {
    const followers = await prisma.follower.findMany({
      where: {
        userId,
        streamerId,
      },
    });
    return NextResponse.json(followers ? { isFollower: true } : { isFollower: false });
  } else {
    return NextResponse.json({ error: '토너먼트를 찾을 수 없습니다.' }, { status: 404 });
  }
}
