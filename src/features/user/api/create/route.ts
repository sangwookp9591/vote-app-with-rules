import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const result = userSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: result.error.errors },
      { status: 400 },
    );
  }
  // 실제 DB 저장 등은 생략, 예시로 성공 응답만 반환
  return NextResponse.json({ ok: true, user: result.data }, { status: 201 });
};
