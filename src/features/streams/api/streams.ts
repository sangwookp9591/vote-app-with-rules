import type { Stream } from '@/entities/stream/model/types';

export interface StartStreamResponse {
  rtmpUrl: string;
  streamKey: string;
  hlsUrl: string;
  stream: Stream;
}

// 방송방 목록 조회
export async function fetchStreams(): Promise<Stream[]> {
  const res = await fetch('/api/streams');
  if (!res.ok) throw new Error('방송방 목록 조회 실패');
  return res.json();
}

// 방송 시작
export async function createStream(data: {
  title: string;
  description?: string;
  streamerId: string;
}): Promise<StartStreamResponse> {
  const res = await fetch('/api/streams/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('방송 시작 실패');
  return res.json();
}

// 방송방 상세 조회
export async function fetchStream(id: string): Promise<Stream> {
  const res = await fetch(`/api/streams/${id}`);
  if (!res.ok) throw new Error('방송방 상세 조회 실패');
  return res.json();
}

// 방송방 상태 갱신(시작/종료/시청자수)
export async function updateStream(
  id: string,
  data: Partial<{ isLive: boolean; endedAt: string; viewers: number }>,
): Promise<Stream> {
  const res = await fetch(`/api/streams/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('방송방 상태 갱신 실패');
  return res.json();
}

// 방송방별 실시간 시청자 수 조회 (최초 1회만 fetch)
export async function fetchViewerCounts(): Promise<Record<string, number>> {
  const res = await fetch('/api/streams/viewers');
  if (!res.ok) throw new Error('시청자 수 조회 실패');
  return res.json();
}
