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
}

export interface Streamer {
  id: string;
  nickname: string;
  profileImageUrl?: string;
}
