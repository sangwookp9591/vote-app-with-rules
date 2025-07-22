// 방송국(스트리머) 정보 조회
export async function fetchMyStation() {
  const res = await fetch('/api/streamers/profile');
  if (!res.ok) throw new Error('방송국 정보 조회 실패');
  return res.json();
}

// 방송국(스트리머) 정보 수정
export async function updateMyStation(data: {
  description: string;
  bannerImageUrl: string | undefined;
}) {
  const res = await fetch('/api/streamers/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('방송국 정보 수정 실패');
  return res.json();
}
