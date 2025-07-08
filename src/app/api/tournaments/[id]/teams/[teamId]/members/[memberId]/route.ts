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
    const { inviteStatus, notificationId } = await req.json();
    if (!notificationId) {
      return NextResponse.json({ error: 'notificationId가 필요합니다.' }, { status: 400 });
    }
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

    const updatedN = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({
      id: updated.id,
      inviteStatus: updated.inviteStatus,
      isRead: updatedN.isRead,
    });
  } catch (e) {
    return NextResponse.json({ error: '팀원 상태 변경 실패', detail: String(e) }, { status: 500 });
  }
}

// 팀원 추방 (DELETE)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; teamId: string; memberId: string }> },
) {
  const { teamId, memberId } = await params;
  try {
    // 추방될 멤버 정보 조회
    const member = await prisma.teamMember.findUnique({
      where: { id: memberId },
      include: { user: true },
    });
    // 팀 정보 및 팀장 정보 조회
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: { include: { user: true } } },
    });
    const leader = team?.members.find((m) => m.isLeader)?.user;
    // 실제 삭제
    await prisma.teamMember.delete({ where: { id: memberId } });
    // 알림 생성
    if (member) {
      await prisma.notification.create({
        data: {
          type: 'TEAM_KICK',
          title: '팀 추방 알림',
          content: `팀장 ${leader?.nickname || ''}님이 ${team?.name || ''} 팀에서 회원님을 추방했습니다.`,
          userId: member.userId,
        },
      });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: '팀원 추방 실패', detail: String(e) }, { status: 500 });
  }
}
