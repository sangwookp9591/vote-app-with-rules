// User 타입을 import해서 사용
import { Streamer } from '@/entities/streamer/model/types';
import type { UserRole } from '../../model/types';

// User의 상세 정보를 나타내는 인터페이스
export interface UserDetail {
  id: string;
  nickname: string;
  profileImageUrl?: string;
  role: UserRole;
  createdAt: string;
  followerCount: number;
  streamer: Streamer;
}
