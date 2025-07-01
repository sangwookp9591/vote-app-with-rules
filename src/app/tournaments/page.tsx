'use client';

import { useQuery } from '@tanstack/react-query';
import {
  tournamentListWrapper,
  tournamentCard,
  tournamentTitle,
  tournamentMeta,
} from './tournaments.css';

interface Tournament {
  id: string;
  title: string;
  description?: string;
  gameType: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
}

export default function TournamentListPage() {
  const { data, isLoading, error } = useQuery<Tournament[]>({
    queryKey: ['tournaments'],
    queryFn: async () => {
      const res = await fetch('/api/tournaments');
      if (!res.ok) throw new Error('토너먼트 목록 조회 실패');
      return res.json();
    },
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {(error as Error).message}</div>;

  return (
    <div className={tournamentListWrapper}>
      <h1>토너먼트 목록</h1>
      {data && data.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {data.map((t) => (
            <div key={t.id} className={tournamentCard}>
              <div className={tournamentTitle}>{t.title}</div>
              <div className={tournamentMeta}>
                <span>게임: {t.gameType}</span>
                <span>
                  기간: {t.startDate.slice(0, 10)} ~ {t.endDate.slice(0, 10)}
                </span>
                <span>상태: {t.status}</span>
              </div>
              <div style={{ marginTop: 8, color: '#666', fontSize: 14 }}>{t.description}</div>
            </div>
          ))}
        </div>
      ) : (
        <div>등록된 토너먼트가 없습니다.</div>
      )}
    </div>
  );
}
