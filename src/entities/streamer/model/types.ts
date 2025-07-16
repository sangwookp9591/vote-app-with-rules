// 인기 스트리머 추천 응답 타입
export interface PopularStreamer {
  id: string; // 스트리머(유저) ID
  nickname: string; // 닉네임
  profileImageUrl?: string | null; // 프로필 이미지
  viewerCount: number; // 최근 1주일간 시청자 수
  followerCount: number; // 최근 1주일간 팔로워 수
  voteCount: number; // 최근 1주일간 투표 수
}
