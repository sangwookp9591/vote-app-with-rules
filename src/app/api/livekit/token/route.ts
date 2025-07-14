import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';

const LIVEKIT_API_KEY = 'APINFfsGtmv7jXM';
const LIVEKIT_API_SECRET = '7cAzpzoKTseerIxntqhXOiViBqMl1Im5GGs9segkOn5A';

export async function POST(req: NextRequest) {
  const { roomName, userName } = await req.json();
  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, { identity: userName });
  at.addGrant({ room: roomName, canPublish: true, canSubscribe: true });
  const token = at.toJwt();
  return NextResponse.json({ token });
}
