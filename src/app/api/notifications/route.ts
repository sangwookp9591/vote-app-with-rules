import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

const prisma = new PrismaClient();

// 알림 목록 조회 (GET)
export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.id) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: token.id },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
    // link 필드 포함해서 반환
    return NextResponse.json(
      notifications.map((n) => ({
        id: n.id,
        title: n.title,
        content: n.content,
        isRead: n.isRead,
        createdAt: n.createdAt,
        type: n.type,
        link: n.link ?? null,
      })),
    );
  } catch (e) {
    return NextResponse.json({ error: '알림 목록 조회 실패', detail: String(e) }, { status: 500 });
  }
}
