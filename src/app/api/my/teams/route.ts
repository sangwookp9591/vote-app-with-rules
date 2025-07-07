import { NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json([], { status: 200 });
  }
  const userId = session.user.id;
  // 내가 팀장인 팀들 찾기
  const leaderTeams = await prisma.teamMember.findMany({
    where: {
      userId,
      isLeader: true,
    },
    include: {
      team: true,
    },
  });
  const result = leaderTeams.map((tm) => ({
    tournamentId: tm.team.tournamentId,
    teamId: tm.teamId,
    isLeader: tm.isLeader,
  }));
  return NextResponse.json(result, { status: 200 });
}
