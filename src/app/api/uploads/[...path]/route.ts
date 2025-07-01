import { NextRequest, NextResponse } from 'next/server';
import { createReadStream, existsSync, statSync } from 'fs';
import path from 'path';

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  const filePath = path.join(process.cwd(), 'uploads', ...params.path);
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    return new NextResponse('Not Found', { status: 404 });
  }
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
  return new NextResponse(stream as any, {
    headers: { 'Content-Type': mimeType },
  });
}
