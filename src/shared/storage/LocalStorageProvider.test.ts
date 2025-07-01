import { LocalStorageProvider } from './LocalStorageProvider';
import { promises as fs } from 'fs';
import path from 'path';

// Node.js 환경에서 File 객체를 흉내내는 MockFile 클래스
class MockFile {
  name: string;
  type: string;
  private _buffer: Buffer;
  constructor(name: string, content: Buffer | string, type = 'image/png') {
    this.name = name;
    this.type = type;
    this._buffer = Buffer.isBuffer(content) ? content : Buffer.from(content);
  }
  async arrayBuffer() {
    return this._buffer;
  }
}

describe('LocalStorageProvider', () => {
  const uploadsDir = path.resolve(process.cwd(), 'uploads', 'test');
  let provider: LocalStorageProvider;

  beforeAll(() => {
    provider = new LocalStorageProvider();
  });

  afterAll(async () => {
    // 테스트 후 업로드 파일 정리
    await fs.rm(uploadsDir, { recursive: true, force: true });
  });

  it('should save file and return correct URL', async () => {
    const file = new MockFile('test.png', Buffer.from('hello world'));
    const url = await provider.upload(file as any, { folder: 'test' });

    // URL이 올바른지
    expect(url).toMatch(/^\/uploads\/test\/.+\.png$/);

    // 실제 파일이 저장되었는지
    const filename = url.split('/').pop()!;
    const savedPath = path.join(uploadsDir, filename);
    const exists = await fs.stat(savedPath).then(
      () => true,
      () => false,
    );
    expect(exists).toBe(true);

    // 파일 내용이 올바른지
    const savedContent = await fs.readFile(savedPath);
    expect(savedContent.toString()).toBe('hello world');
  });
});
