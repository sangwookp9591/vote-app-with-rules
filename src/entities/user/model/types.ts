// src/entities/user/model/types.ts

import { Stream } from '@/entities/stream/model/types';
import { Streamer } from '@/entities/streamer/model/types';
// 필요시 다른 엔티티 import

export interface User {
  id: string;
  email: string;
  nickname: string;
  name?: string;
  profileImageUrl?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;

  // --- 확장: 유저의 모든 정보 ---
  // 스트리머 정보 (있을 경우)
  streamer?: Streamer | null;

  // 유저가 진행한 방송 목록
  streams?: Stream[];

  // 팔로워/팔로잉
  followers?: User[]; // 나를 팔로우하는 사람들
  following?: User[]; // 내가 팔로우하는 사람들

  // 받은/보낸 알림
  notifications?: Notification[];

  // 투표, 팀, 토너먼트 등 필요시 추가
  // votes?: Vote[];
  // teams?: TeamMember[];
  // applications?: TournamentApplication[];
  // hostedTournaments?: Tournament[];
  // 기타 필요한 관계들...
}

// 역할
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  STREAMER = 'STREAMER', // 필요시 추가
}

// 프로필만 필요한 경우
export interface UserProfile {
  id: string;
  nickname: string;
  email: string;
  profileImageUrl?: string;
}

// 필요시 Notification, Streamer, Stream 등 타입도 import/정의
