import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { title, description, streamerId } = await req.json();

  // streamKey는 nanoid 등으로 생성
  const streamKey = nanoid();

  const stream = await prisma.stream.create({
    data: {
      title,
      description,
      streamerId,
      isLive: true,
      startedAt: new Date(),
      streamKey,
    },
  });

  return NextResponse.json({
    rtmpUrl: `rtmp://localhost:1935/live`,
    streamKey: stream.streamKey,
    hlsUrl: `http://localhost:8080/hls/${stream.streamKey}.m3u8`, // HLS 주소를 /hls/로 통일
    stream,
  });
}
