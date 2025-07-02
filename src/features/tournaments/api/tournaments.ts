import { Tournament, CreateTournamentData, TournamentFilters } from '@/entities/tournament';

const API_BASE = '/api/tournaments';

export const tournamentsApi = {
  // 토너먼트 목록 조회
  getTournaments: async (filters?: TournamentFilters): Promise<Tournament[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.gameType) params.append('gameType', filters.gameType);
    if (filters?.search) params.append('search', filters.search);

    const url = params.toString() ? `${API_BASE}?${params.toString()}` : API_BASE;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('토너먼트 목록 조회 실패');
    }

    return response.json();
  },

  // 토너먼트 상세 조회
  getTournament: async (id: string): Promise<Tournament> => {
    const response = await fetch(`${API_BASE}/${id}`);

    if (!response.ok) {
      throw new Error('토너먼트 정보 조회 실패');
    }

    return response.json();
  },

  // 토너먼트 생성
  createTournament: async (data: CreateTournamentData): Promise<Tournament> => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '토너먼트 생성 실패');
    }

    return response.json();
  },

  // 토너먼트 수정
  updateTournament: async (
    id: string,
    data: Partial<CreateTournamentData>,
  ): Promise<Tournament> => {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '토너먼트 수정 실패');
    }

    return response.json();
  },

  // 토너먼트 삭제
  deleteTournament: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '토너먼트 삭제 실패');
    }
  },
};
