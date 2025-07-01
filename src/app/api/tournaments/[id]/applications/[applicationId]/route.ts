import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 참가 신청 승인/거절 (PATCH)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; applicationId: string } },
) {
  try {
    const body = await req.json();
    const { status } = body;
    if (!status || !['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'status(PENDING/APPROVED/REJECTED) 값이 필요합니다.' },
        { status: 400 },
      );
    }
    const updated = await prisma.tournamentApplication.update({
      where: { id: params.applicationId },
      data: { status },
    });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: '신청 상태 변경 실패', detail: String(e) }, { status: 500 });
  }
}
