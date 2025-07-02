'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { tournamentsApi } from '@/features/tournaments';
import { TournamentCard } from '@/features/tournaments';
import { style } from '@vanilla-extract/css';

const tournamentListWrapper = style({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '2rem',
});

const tournamentHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '2rem',
  '@media': {
    '(max-width: 768px)': {
      flexDirection: 'column',
      gap: '1rem',
    },
  },
});

const tournamentTitle = style({
  fontSize: '2.5rem',
  fontWeight: 700,
  color: 'var(--foreground)',
  marginBottom: '0.5rem',
});

const tournamentSubtitle = style({
  fontSize: '1.125rem',
  color: 'var(--muted-foreground)',
  lineHeight: 1.5,
});

const createButton = style({
  background: 'linear-gradient(45deg, #4f9fff, #ff4f9f)',
  color: 'white',
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(79, 159, 255, 0.4)',
  },
});

const tournamentGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: '1.5rem',
  '@media': {
    '(max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

const loadingState = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4rem 2rem',
  textAlign: 'center',
  color: 'var(--muted-foreground)',
});

const errorState = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4rem 2rem',
  textAlign: 'center',
  color: '#dc3545',
});

const emptyState = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4rem 2rem',
  textAlign: 'center',
  color: 'var(--muted-foreground)',
});

export default function TournamentListPage() {
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
        <Link href="/tournaments/create" className={createButton}>
          토너먼트 생성
        </Link>
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
          <p style={{ marginBottom: '1.5rem' }}>첫 번째 토너먼트를 생성해보세요!</p>
          <Link href="/tournaments/create" className={createButton}>
            토너먼트 생성하기
          </Link>
        </div>
      )}
    </div>
  );
}
