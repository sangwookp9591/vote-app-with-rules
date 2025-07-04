import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 팀원 초대 상태 변경 (수락/거절)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; teamId: string; memberId: string }> },
) {
  const { memberId } = await params;
  try {
    const { inviteStatus } = await req.json();
    if (!['ACCEPTED', 'REJECTED'].includes(inviteStatus)) {
      return NextResponse.json(
        { error: 'inviteStatus는 ACCEPTED 또는 REJECTED여야 합니다.' },
        { status: 400 },
      );
    }
    const updated = await prisma.teamMember.update({
      where: { id: memberId },
      data: { inviteStatus },
    });
    return NextResponse.json({ id: updated.id, inviteStatus: updated.inviteStatus });
  } catch (e) {
    return NextResponse.json({ error: '팀원 상태 변경 실패', detail: String(e) }, { status: 500 });
  }
}

// 팀원 추방 (DELETE)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; teamId: string; memberId: string }> },
) {
  const { memberId } = await params;
  try {
    await prisma.teamMember.delete({ where: { id: memberId } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: '팀원 추방 실패', detail: String(e) }, { status: 500 });
  }
}
