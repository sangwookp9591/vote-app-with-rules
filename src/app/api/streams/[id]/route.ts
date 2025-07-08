import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../shared/prisma/client';

// 방송방 상세 조회
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const stream = await prisma.stream.findUnique({
    where: { id },
    include: { streamer: { select: { id: true, nickname: true, profileImageUrl: true } } },
  });
  if (!stream) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json(stream);
}

// 방송 시작/종료, 시청자 수 갱신
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();
  // isLive, endedAt, viewers 등 갱신
  const { isLive, endedAt, viewers } = body;
  const data: Partial<{ isLive: boolean; endedAt: Date; viewers: number }> = {};
  if (typeof isLive === 'boolean') data.isLive = isLive;
  if (endedAt) data.endedAt = endedAt;
  if (typeof viewers === 'number') data.viewers = viewers;
  const stream = await prisma.stream.update({ where: { id }, data });
  return NextResponse.json(stream);
}
