import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  // 요청에서 방송 정보(제목, 설명, 스트리머ID, 카테고리 대분류/소분류) 추출
  const { title, description, streamerId, categoryType, categoryDetail } = await req.json();

  // 필수값 체크
  if (!title || !streamerId || !categoryType || !categoryDetail) {
    return NextResponse.json(
      { error: 'title, streamerId, categoryType, categoryDetail 필수' },
      { status: 400 },
    );
  }

  // streamKey는 nanoid 등으로 생성
  const streamKey = nanoid();

  // 방송 생성 (카테고리 정보 포함)
  const stream = await prisma.stream.create({
    data: {
      title,
      description,
      streamerId,
      isLive: true,
      startedAt: new Date(),
      streamKey,
      categoryType,
      categoryDetail,
    },
  });

  return NextResponse.json({
    rtmpUrl: `rtmp://localhost:1935/live`,
    streamKey: stream.streamKey,
    hlsUrl: `http://localhost:8080/live/${stream.streamKey}.m3u8`, // HLS 주소를 /live/로 통일
    stream,
  });
}
