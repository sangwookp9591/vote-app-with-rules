import { Team, CreateTeamData } from '@/entities/team';

const API_BASE = '/api/tournaments';

export const teamsApi = {
  // 토너먼트별 팀 목록 조회
  getTeams: async (tournamentId: string): Promise<Team[]> => {
    const response = await fetch(`${API_BASE}/${tournamentId}/teams`);

    if (!response.ok) {
      throw new Error('팀 목록 조회 실패');
    }

    return response.json();
  },

  // 팀 생성
  createTeam: async (data: CreateTeamData): Promise<Team> => {
    const response = await fetch(`${API_BASE}/${data.tournamentId}/teams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '팀 생성 실패');
    }

    return response.json();
  },

  // 팀 상세 조회
  getTeam: async (tournamentId: string, teamId: string): Promise<Team> => {
    const response = await fetch(`${API_BASE}/${tournamentId}/teams/${teamId}`);

    if (!response.ok) {
      throw new Error('팀 정보 조회 실패');
    }

    return response.json();
  },

  // 팀 수정
  updateTeam: async (
    tournamentId: string,
    teamId: string,
    data: Partial<CreateTeamData>,
  ): Promise<Team> => {
    const response = await fetch(`${API_BASE}/${tournamentId}/teams/${teamId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '팀 수정 실패');
    }

    return response.json();
  },

  // 팀 삭제
  deleteTeam: async (tournamentId: string, teamId: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/${tournamentId}/teams/${teamId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '팀 삭제 실패');
    }
  },
};
