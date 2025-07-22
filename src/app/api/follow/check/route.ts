import { prisma } from '@/shared/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string; streamerId: string }> },
) {
  const { userId, streamerId } = await params;

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
