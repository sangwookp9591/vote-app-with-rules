import { NextRequest, NextResponse } from 'next/server';

const ipMap = new Map<string, { count: number; last: number }>();
const WINDOW_MS = 60 * 1000; // 1분
const MAX_REQ = 10; // 1분에 10회 제한

export function withRateLimit(handler: (req: NextRequest) => Promise<NextResponse> | NextResponse) {
  return async (req: NextRequest) => {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const entry = ipMap.get(ip) || { count: 0, last: now };
    if (now - entry.last > WINDOW_MS) {
      entry.count = 0;
      entry.last = now;
    }
    entry.count++;
    ipMap.set(ip, entry);
    if (entry.count > MAX_REQ) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }
    return handler(req);
  };
}
