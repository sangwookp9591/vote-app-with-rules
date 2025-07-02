export interface Tournament {
  id: string;
  title: string;
  description?: string;
  gameType: GameType;
  teamSize: number;
  startDate: string;
  endDate: string;
  status: TournamentStatus;
  createdAt: string;
  voteStartDate?: string;
  voteEndDate?: string;
  hostId: string;
}

export enum GameType {
  LOL = 'LOL',
  PUBG = 'PUBG',
  OVERWATCH = 'OVERWATCH',
  VALORANT = 'VALORANT',
  CS2 = 'CS2',
  DOTA2 = 'DOTA2',
  ETC = 'ETC',
}

export enum TournamentStatus {
  PREPARING = 'PREPARING',
  TEAM_RECRUITING = 'TEAM_RECRUITING',
  VOTING = 'VOTING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface CreateTournamentData {
  title: string;
  description?: string;
  gameType: GameType;
  teamSize: number;
  startDate: string;
  endDate: string;
  hostId: string;
}

export interface TournamentFilters {
  status?: TournamentStatus;
  gameType?: GameType;
  search?: string;
}
