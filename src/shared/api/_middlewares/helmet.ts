import { NextRequest, NextResponse } from 'next/server';

export function withHelmet(handler: (req: NextRequest) => Promise<NextResponse> | NextResponse) {
  return async (req: NextRequest) => {
    const res = await handler(req);
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('X-Frame-Options', 'SAMEORIGIN');
    res.headers.set('X-XSS-Protection', '1; mode=block');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    return res;
  };
}
