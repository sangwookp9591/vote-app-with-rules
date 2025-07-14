'use server';

import { LocalStorageProvider } from '@/shared/storage/LocalStorageProvider';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

export type SignupFormState = { error?: string; success?: string };

export async function signupAction(
  prevState: SignupFormState,
  formData: FormData,
): Promise<SignupFormState> {
  const prisma = new PrismaClient();
  const email = formData.get('email') as string;
  const nickname = formData.get('nickname') as string;
  const password = formData.get('password') as string;
  // const isStreamer = formData.get('isStreamer') === 'on'; // 추후 사용

  // 프로필 이미지 파일 저장
  let profileImageUrl: string | undefined = undefined;
  const profileImage = formData.get('profileImage');
  if (profileImage && typeof profileImage === 'object' && 'arrayBuffer' in profileImage) {
    const storage = new LocalStorageProvider();
    profileImageUrl = await storage.upload(profileImage as File, { folder: 'user' });
  }

  if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
    return { error: '올바른 이메일을 입력하세요.' };
  }
  if (!nickname || nickname.length < 2) {
    return { error: '닉네임은 2자 이상이어야 합니다.' };
  }
  if (!password || password.length < 6) {
    return { error: '비밀번호는 6자 이상이어야 합니다.' };
  }

  // 중복 이메일/닉네임 체크
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { nickname }],
    },
  });
  if (existingUser) {
    if (existingUser.email === email) {
      return { error: '이미 사용 중인 이메일입니다.' };
    }
    if (existingUser.nickname === nickname) {
      return { error: '이미 사용 중인 닉네임입니다.' };
    }
  }

  // 비밀번호 해싱 (bcrypt 사용)
  let hashedPassword: string;
  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch {
    return { error: '비밀번호 암호화 중 오류가 발생했습니다.' };
  }

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname,
        profileImageUrl,
        role: email === 'admin@admin.com' ? 'ADMIN' : undefined,
      },
    });

    // isStreamer 체크 시 스트리머 신청 자동 생성
    const isStreamer = formData.get('isStreamer') === 'on';
    if (isStreamer) {
      // 이미 신청한 적이 없고, 이미 스트리머가 아닌 경우에만 생성
      const existingApplication = await prisma.streamerApplication.findUnique({
        where: { userId: user.id },
      });
      const existingStreamer = await prisma.streamer.findUnique({ where: { userId: user.id } });
      if (!existingApplication && !existingStreamer) {
        await prisma.streamerApplication.create({
          data: {
            userId: user.id,
            status: 'PENDING',
          },
        });
      }
    }

    return { success: '회원가입이 완료되었습니다!' };
  } catch {
    return { error: '회원가입 중 오류가 발생했습니다.' };
  } finally {
    await prisma.$disconnect();
  }
}
