import { NextRequest, NextResponse } from 'next/server';
import { createReadStream, existsSync, statSync } from 'fs';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  // public/uploads 폴더에서 파일을 찾음
  const { path: pathArr } = await params;
  const filePath = path.join(process.cwd(), 'public', 'uploads', ...pathArr); // public/uploads 경로로 수정
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    return new NextResponse('Not Found', { status: 404 });
  }
  // 파일 확장자에 따라 Content-Type 지정
  const ext = path.extname(filePath).toLowerCase();
  const mimeType =
    ext === '.png'
      ? 'image/png'
      : ext === '.jpg' || ext === '.jpeg'
        ? 'image/jpeg'
        : ext === '.gif'
          ? 'image/gif'
          : ext === '.webp'
            ? 'image/webp'
            : 'application/octet-stream';
  const stream = createReadStream(filePath);
  // 스트림으로 이미지 반환
  return new NextResponse(stream as unknown as ReadableStream, {
    headers: { 'Content-Type': mimeType },
  });
}
