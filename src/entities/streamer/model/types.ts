// 인기 스트리머 추천 응답 타입
export interface PopularStreamer {
  id: string; // 스트리머(유저) ID
  nickname: string; // 닉네임
  profileImageUrl?: string | null; // 프로필 이미지
  viewerCount: number; // 최근 1주일간 시청자 수
  followerCount: number; // 최근 1주일간 팔로워 수
  voteCount: number; // 최근 1주일간 투표 수
}

// 스트리머 엔티티 타입 정의
// (Prisma 모델과 연동, 필요한 필드만 우선 작성)

export interface Streamer {
  id: string; // 스트리머 고유 ID
  userId: string; // 유저 ID (User와 1:1)
  createdAt: string;
  updatedAt: string;
  // 게임별 프로필(옵션)
  lolProfile?: LolProfile | null;
  valorantProfile?: ValorantProfile | null;
  // 필요시 다른 게임 프로필, 통계 등 추가 가능
}

// LoL 프로필 타입 예시
export interface LolProfile {
  id: string;
  streamerId: string;
  nickname: string;
  tier: string;
  rank: number;
  position: string;
  mainChampions: string[];
  winRate?: number;
  gamesPlayed?: number;
}

// 발로란트 프로필 타입 예시
export interface ValorantProfile {
  id: string;
  streamerId: string;
  nickname: string;
  tier: string;
  position: string;
  mainAgents: string[];
  role?: string;
  winRate?: number;
  gamesPlayed?: number;
}
