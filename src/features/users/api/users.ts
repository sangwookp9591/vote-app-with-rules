import { User, UserProfile } from '@/entities/user';

const API_BASE = '/api/users';

export const usersApi = {
  // 사용자 목록 조회
  getUsers: async (): Promise<UserProfile[]> => {
    const response = await fetch(API_BASE);

    if (!response.ok) {
      throw new Error('사용자 목록 조회 실패');
    }

    return response.json();
  },

  // 사용자 상세 조회
  getUser: async (id: string): Promise<User> => {
    const response = await fetch(`${API_BASE}/${id}`);

    if (!response.ok) {
      throw new Error('사용자 정보 조회 실패');
    }

    return response.json();
  },

  // 사용자 프로필 수정
  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '사용자 정보 수정 실패');
    }

    return response.json();
  },
};
