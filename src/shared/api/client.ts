// 공통 API 클라이언트 설정
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 10000,
};

// 공통 에러 처리
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 공통 fetch 래퍼
export async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { error: '알 수 없는 오류가 발생했습니다.' };
    }

    throw new ApiError(errorData.error || `HTTP ${response.status}`, response.status, errorData);
  }

  return response.json();
}
