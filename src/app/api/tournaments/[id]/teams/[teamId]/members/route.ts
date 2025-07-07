import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

// 팀원 초대(추가)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; teamId: string }> },
) {
  const { teamId } = await params;
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: 'userId는 필수입니다.' }, { status: 400 });
    }
    const exists = await prisma.teamMember.findFirst({ where: { teamId, userId } });
    if (exists) {
      return NextResponse.json({ error: '이미 팀원입니다.' }, { status: 409 });
    }
    const member = await prisma.teamMember.create({
      data: {
        teamId,
        userId,
        isLeader: false,
        inviteStatus: 'PENDING',
        lolNickname: '',
        lolTier: 'BRONZE',
        lolRank: 4,
        lolPosition: 'TOP',
        lolPoints: 0,
      },
    });
    // 팀 정보 및 팀장 정보 조회
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: { include: { user: true } },
      },
    });
    const leader = team?.members.find((m) => m.isLeader)?.user;
    // 알림 생성
    await prisma.notification.create({
      data: {
        type: 'TEAM_INVITATION',
        title: '팀 초대 알림',
        content: `팀장 ${leader?.nickname || ''}님이 ${team?.name || ''} 팀에 초대했습니다. 수락/거절을 선택해 주세요.`,
        userId,
        link: `/tournaments/${team?.tournamentId}/teams/${teamId}/invitation`,
      },
    });
    // 실시간 알림 emit
    const notificationPayload = {
      type: 'TEAM_INVITATION',
      title: '팀 초대 알림',
      content: `팀장 ${leader?.nickname || ''}님이 ${team?.name || ''} 팀에 초대했습니다. 수락/거절을 선택해 주세요.`,
      userId,
      link: `/tournaments/${team?.tournamentId}/teams/${teamId}/invitation`,
    };
    // 디버깅: 환경변수와 fetch 요청 로그
    console.log('SOCKET_URL:', SOCKET_URL);
    console.log('Emit fetch URL:', `${SOCKET_URL || 'http://socket-server:4000'}/emit`);
    console.log('Emit fetch payload:', { userId, notification: notificationPayload });
    try {
      const emitRes = await fetch(`${SOCKET_URL || 'http://socket-server:4000'}/emit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, notification: notificationPayload }),
      });
      console.log('Emit fetch status:', emitRes.status);
      const emitResText = await emitRes.text();
      console.log('Emit fetch response:', emitResText);
    } catch (emitErr) {
      console.error('Emit fetch error:', emitErr);
    }
    return NextResponse.json(member, { status: 201 });
  } catch (e) {
    console.error('팀원 초대 실패:', e);
    return NextResponse.json({ error: '팀원 초대 실패', detail: String(e) }, { status: 500 });
  }
}
