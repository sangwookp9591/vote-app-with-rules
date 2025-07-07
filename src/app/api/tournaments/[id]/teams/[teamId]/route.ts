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
    return NextResponse.json({
      id: team.id,
      name: team.name,
      description: team.description,
      members: team.members.map((m) => ({
        id: m.id,
        user: {
          id: m.user.id,
          nickname: m.user.nickname,
          profileImageUrl: m.user.profileImageUrl,
        },
        isLeader: m.isLeader,
        inviteStatus: m.inviteStatus,
      })),
    });
  } catch (e) {
    return NextResponse.json({ error: '팀 상세 조회 실패', detail: String(e) }, { status: 500 });
  }
}
