import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    // 이미 팀원인지 확인
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
    return NextResponse.json(member, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: '팀원 초대 실패', detail: String(e) }, { status: 500 });
  }
}
