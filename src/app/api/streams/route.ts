import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../shared/prisma/client';
import { nanoid } from 'nanoid';

export async function GET() {
  const streams = await prisma.stream.findMany({
    where: { isLive: true },
    include: { streamer: { select: { id: true, nickname: true, profileImageUrl: true } } },
    orderBy: { startedAt: 'desc' },
  });
  return NextResponse.json(streams);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  // TODO: 인증/권한 체크 필요
  const { title, description, streamerId } = body;
  if (!title || !streamerId) {
    return NextResponse.json({ error: 'title, streamerId required' }, { status: 400 });
  }
  const streamKey = nanoid(24);
  const stream = await prisma.stream.create({
    data: {
      title,
      description,
      streamerId,
      streamKey,
      isLive: false,
    },
  });
  return NextResponse.json(stream);
}
