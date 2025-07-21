import { prisma } from '@/shared/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id)
    return NextResponse.json({ error: 'Bad Request - id가 존재하지 않습니다.' }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      nickname: true,
      role: true,
      profileImageUrl: true,
      _count: {
        select: {
          followers: true,
        },
      },
      createdAt: true,
    },
  });
  if (!user) return NextResponse.json({ error: 'not found ' }, { status: 404 });

  const { _count, ...userWithoutCount } = user;
  const userWithFollowerCount = {
    ...userWithoutCount,
    followerCount: _count.followers,
  };

  return NextResponse.json(userWithFollowerCount);
}
