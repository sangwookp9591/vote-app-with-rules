export interface Stream {
  id: string;
  title: string;
  description?: string;
  streamer: Streamer;
  streamerId: string;
  isLive: boolean;
  startedAt: string;
  endedAt?: string;
  viewers: number;
  streamKey: string;
  createdAt: string;
  updatedAt: string;
  // --- 카테고리 필드 추가 (대분류/소분류) ---
  categoryType: 'GAME' | 'RADIO' | 'SPORTS'; // 대분류
  categoryDetail: string; // 소분류(LOL, 토크, 축구 등)
}

export interface Streamer {
  id: string;
  nickname: string;
  profileImageUrl?: string;
}
