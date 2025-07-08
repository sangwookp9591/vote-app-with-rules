export interface Team {
  id: string;
  name: string;
  tournamentId: string;
  createdAt: string;
  updatedAt: string;
  members: TeamMember[];
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  isLeader: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    nickname: string;
    profileImageUrl?: string;
  };
  inviteStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  // LoL 관련 정보
  lolNickname: string;
  lolTier: LolTier;
  lolRank: number;
  lolPosition: LolPosition;
  lolPoints: number;
}

export enum LolTier {
  IRON = 'IRON',
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  EMERALD = 'EMERALD',
  DIAMOND = 'DIAMOND',
  MASTER = 'MASTER',
  GRANDMASTER = 'GRANDMASTER',
  CHALLENGER = 'CHALLENGER',
}

export enum LolPosition {
  TOP = 'TOP',
  JUNGLE = 'JUNGLE',
  MID = 'MID',
  ADC = 'ADC',
  SUPPORT = 'SUPPORT',
}

export interface CreateTeamData {
  name: string;
  tournamentId: string;
  leaderId: string;
  members: string[];
}

export interface TeamDetail {
  id: string;
  name: string;
  leader: {
    id: string;
    nickname: string;
    profileImageUrl?: string;
  } | null;
  members: TeamMember[];
  description?: string;
}
