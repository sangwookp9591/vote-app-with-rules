import { NextResponse } from 'next/server';
import { withCORS } from '../_middlewares/cors';
import { withHelmet } from '../_middlewares/helmet';
import { withRateLimit } from '../_middlewares/rateLimit';

const handler = () => {
  return NextResponse.json({ status: 'ok' }, { status: 200 });
};

export const GET = withRateLimit(withCORS(withHelmet(handler)));
