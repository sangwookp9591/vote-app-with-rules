import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 팀 생성 (POST)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { name, leaderId, members } = body;

    if (!name || !leaderId || !members || !Array.isArray(members)) {
      return NextResponse.json({ error: '필수 입력값 누락' }, { status: 400 });
    }

    // 토너먼트 정보 조회
    const tournament = await prisma.tournament.findUnique({
      where: { id },
    });

    if (!tournament) {
      return NextResponse.json({ error: '토너먼트를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 팀원 수 검증
    if (members.length < 1) {
      return NextResponse.json(
        { error: '팀원은 최소 1명(팀장) 이상이어야 합니다.' },
        { status: 400 },
      );
    }
    if (members.length > tournament.teamSize) {
      return NextResponse.json(
        { error: `팀원 수가 너무 많습니다. 최대 ${tournament.teamSize}명까지 가능합니다.` },
        { status: 400 },
      );
    }

    // 팀 생성 및 팀원 추가
    const team = await prisma.team.create({
      data: {
        name,
        tournamentId: id,
        members: {
          create: members.map((memberId: string, index: number) => ({
            userId: memberId,
            isLeader: index === 0, // 첫 번째 멤버가 팀장
            // LoL 관련 정보는 나중에 업데이트
            lolNickname: '',
            lolTier: 'BRONZE',
            lolRank: 4,
            lolPosition: 'TOP',
            lolPoints: 0,
            inviteStatus: index === 0 ? 'ACCEPTED' : 'PENDING',
          })),
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                nickname: true,
                profileImageUrl: true,
              },
            },
          },
        },
      },
    });

    // 팀장 정보
    const leader = team.members.find((m) => m.isLeader);
    // 팀장 이외의 멤버에게 알림 생성
    await Promise.all(
      team.members
        .filter((m) => !m.isLeader)
        .map((m) =>
          prisma.notification.create({
            data: {
              type: 'TEAM_INVITATION',
              title: '팀 초대 알림',
              content: `팀장 ${leader?.user.nickname}님이 ${team.name} 팀에 초대했습니다. 수락/거절을 선택해 주세요.`,
              userId: m.userId,
            },
          }),
        ),
    );

    return NextResponse.json(team, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: '팀 생성 실패', detail: String(e) }, { status: 500 });
  }
}

// 토너먼트의 팀 목록 조회 (GET)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const teams = await prisma.team.findMany({
      where: { tournamentId: id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                nickname: true,
                profileImageUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(teams);
  } catch (e) {
    return NextResponse.json({ error: '팀 목록 조회 실패', detail: String(e) }, { status: 500 });
  }
}
