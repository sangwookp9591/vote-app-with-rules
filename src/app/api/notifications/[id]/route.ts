import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

const prisma = new PrismaClient();

// 알림 읽음(PATCH), 삭제(DELETE)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.id) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }
  try {
    const notification = await prisma.notification.findUnique({ where: { id: params.id } });
    if (!notification || notification.userId !== token.id) {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }
    const updated = await prisma.notification.update({
      where: { id: params.id },
      data: { isRead: true },
    });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: '알림 읽음 처리 실패', detail: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.id) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }
  try {
    const notification = await prisma.notification.findUnique({ where: { id: params.id } });
    if (!notification || notification.userId !== token.id) {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }
    await prisma.notification.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: '알림 삭제 실패', detail: String(e) }, { status: 500 });
  }
}
