import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

const prisma = new PrismaClient();

// GET: 내 스트리머 프로필 조회
export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.id) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }
  // 스트리머 정보 + 게임별 프로필
  const streamer = await prisma.streamer.findUnique({
    where: { userId: token.id as string },
    include: {
      lolProfile: true,
      valorantProfile: true,
    },
  });
  if (!streamer) {
    return NextResponse.json({ error: '스트리머가 아닙니다.' }, { status: 404 });
  }
  return NextResponse.json(streamer);
}

// POST: 내 스트리머 프로필 생성/수정 (게임별)
export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.id) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }
  const body = await req.json();
  const { game, profile } = body; // game: 'lol' | 'valorant', profile: { ... }
  if (!game || !profile) {
    return NextResponse.json({ error: 'game, profile 필수' }, { status: 400 });
  }
  // 스트리머 row가 없으면 생성
  let streamer = await prisma.streamer.findUnique({ where: { userId: token.id as string } });
  if (!streamer) {
    streamer = await prisma.streamer.create({ data: { userId: token.id as string } });
  }
  // 게임별 프로필 upsert
  if (game === 'lol') {
    const data = { ...profile, streamerId: streamer.id };
    const lolProfile = await prisma.lolProfile.upsert({
      where: { streamerId: streamer.id },
      update: data,
      create: data,
    });
    return NextResponse.json(lolProfile);
  } else if (game === 'valorant') {
    const data = { ...profile, streamerId: streamer.id };
    const valorantProfile = await prisma.valorantProfile.upsert({
      where: { streamerId: streamer.id },
      update: data,
      create: data,
    });
    return NextResponse.json(valorantProfile);
  } else {
    return NextResponse.json({ error: '지원하지 않는 게임' }, { status: 400 });
  }
}
