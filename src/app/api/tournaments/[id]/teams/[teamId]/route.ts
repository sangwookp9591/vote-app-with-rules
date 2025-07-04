import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 팀 상세 조회 (GET)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; teamId: string }> },
) {
  const { teamId } = await params;
  try {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
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
    if (!team) {
      return NextResponse.json({ error: '팀을 찾을 수 없습니다.' }, { status: 404 });
    }
    // 팀장/팀원 분리 및 상태 가공
    const leader = team.members.find((m) => m.isLeader);
    const members = team.members
      .filter((m) => !m.isLeader)
      .map((m) => ({
        id: m.userId,
        nickname: m.user.nickname,
        profileImageUrl: m.user.profileImageUrl,
        status: 'ACCEPTED', // TODO: 추후 초대 상태 연동
      }));
    return NextResponse.json({
      id: team.id,
      name: team.name,
      leader: leader
        ? {
            id: leader.userId,
            nickname: leader.user.nickname,
            profileImageUrl: leader.user.profileImageUrl,
          }
        : null,
      members,
    });
  } catch (e) {
    return NextResponse.json({ error: '팀 상세 조회 실패', detail: String(e) }, { status: 500 });
  }
}
