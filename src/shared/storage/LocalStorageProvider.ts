import { IStorageProvider } from './IStorageProvider';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

export class LocalStorageProvider implements IStorageProvider {
  baseDir: string;
  baseUrl: string;

  constructor(baseDir = path.resolve(process.cwd(), 'public/uploads'), baseUrl = '/uploads') {
    this.baseDir = baseDir;
    this.baseUrl = baseUrl;
  }

  async upload(file: File, options?: { folder?: string }): Promise<string> {
    const folder = options?.folder || '';
    const ext = path.extname(file.name) || '.png';
    const filename = `${randomUUID()}${ext}`;
    const targetDir = path.join(this.baseDir, folder);
    const targetPath = path.join(targetDir, filename);
    await fs.mkdir(targetDir, { recursive: true });
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(targetPath, Buffer.from(arrayBuffer));
    // 반환 URL은 /uploads/폴더/파일명
    return path.posix.join(this.baseUrl, folder, filename);
  }
}
