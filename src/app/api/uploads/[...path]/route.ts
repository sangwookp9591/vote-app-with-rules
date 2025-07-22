import { NextRequest, NextResponse } from 'next/server';
import { createReadStream, existsSync, statSync } from 'fs';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';

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

export async function POST(req: NextRequest): Promise<NextResponse> {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  // 파일 유효성 검사
  if (!file || typeof file === 'string') {
    return new NextResponse('파일이 존재하지 않거나 유효하지 않음', { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 업로드 경로 설정
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);

  // 디렉토리 없으면 생성
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  // 파일 저장
  await writeFile(filePath, buffer);

  // 업로드된 이미지 URL 반환
  const fileUrl = `/uploads/${fileName}`;
  return NextResponse.json({ url: fileUrl });
}
