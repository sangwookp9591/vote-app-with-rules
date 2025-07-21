import { prisma } from '@/shared/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  console.log('params : ', params);

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      nickname: true,
      role: true,
      profileImageUrl: true,
      followers: true,
      following: true,
      streamer: true,
      streams: true,
    },
  });

  return NextResponse.json(user);
}
