'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { tournamentsApi } from '@/features/tournaments';
import { TournamentCard } from '@/features/tournaments';
import {
  tournamentListWrapper,
  tournamentHeader,
  tournamentTitle,
  tournamentSubtitle,
  createButton,
  tournamentGrid,
  loadingState,
  errorState,
  emptyState,
} from './tournaments.css';
import { useSession } from 'next-auth/react';

export default function TournamentListPage() {
  const { data: session } = useSession();
  const {
    data: tournaments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tournaments'],
    queryFn: () => tournamentsApi.getTournaments(),
  });

  if (isLoading) {
    return (
      <div className={tournamentListWrapper}>
        <div className={loadingState}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <div>토너먼트 목록을 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={tournamentListWrapper}>
        <div className={errorState}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
          <div>에러 발생: {(error as Error).message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={tournamentListWrapper}>
      {/* Header Section */}
      <div className={tournamentHeader}>
        <div>
          <h1 className={tournamentTitle}>토너먼트</h1>
          <p className={tournamentSubtitle}>PSW 최고의 게이머들이 모이는 토너먼트에 참가하세요</p>
        </div>
        {session?.user?.role === 'ADMIN' && (
          <Link href="/tournaments/create" className={createButton}>
            토너먼트 생성
          </Link>
        )}
      </div>

      {/* Tournament Grid */}
      {tournaments && tournaments.length > 0 ? (
        <div className={tournamentGrid}>
          {tournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      ) : (
        <div className={emptyState}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>아직 토너먼트가 없습니다</h3>
          {session?.user?.role === 'ADMIN' && (
            <>
              <p style={{ marginBottom: '1.5rem' }}>첫 번째 토너먼트를 생성해보세요!</p>
              <Link href="/tournaments/create" className={createButton}>
                토너먼트 생성하기
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
