// app/api/user/profile/route.ts

import { prisma } from '@/shared/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { userId } = body;

  if (!userId) {
    return NextResponse.json({ error: '로그인 필요' }, { status: 401 });
  }

  const { nickname, profileImageUrl } = await req.json();

  // 기존 사용자 정보 가져오기
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { nickname: true, profileImageUrl: true },
  });

  if (!user) {
    return NextResponse.json({ error: '사용자 정보 없음' }, { status: 404 });
  }

  // 변경사항이 없으면 업데이트 생략
  const isNicknameChanged = nickname !== user.nickname;
  const isImageChanged = profileImageUrl !== user.profileImageUrl;

  if (!isNicknameChanged && !isImageChanged) {
    return NextResponse.json({ success: '변경사항 없음' }, { status: 200 });
  }

  // 중복 닉네임 체크
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ nickname }],
    },
  });
  if (existingUser) {
    if (existingUser.nickname === nickname) {
      return { error: '이미 사용 중인 닉네임입니다.' };
    }
  }

  // 변경된 부분만 업데이트
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(isNicknameChanged ? { nickname } : {}),
      ...(isImageChanged ? { profileImageUrl } : {}),
    },
  });

  return NextResponse.json({ success: '수정 완료', user: updatedUser }, { status: 200 });
}
