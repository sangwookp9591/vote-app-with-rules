import { prisma } from '@/shared/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// 채팅 로그 저장 API
export async function POST(req: NextRequest) {
  try {
    const { userId, streamId, message } = await req.json();

    // 한글 주석: 필수값 체크
    if (!userId || !streamId || !message) {
      return NextResponse.json({ error: '필수값이 누락되었습니다.' }, { status: 400 });
    }

    // 한글 주석: ChatLog 저장
    await prisma.chatLog.create({
      data: {
        userId,
        streamId,
        message,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    // 한글 주석: 에러 처리
    return NextResponse.json({ error: '채팅 로그 저장 중 오류 발생' }, { status: 500 });
  }
}
