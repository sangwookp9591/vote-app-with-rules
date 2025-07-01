'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  tournamentListWrapper,
  tournamentHeader,
  tournamentTitle,
  tournamentSubtitle,
  tournamentGrid,
  tournamentCard,
  tournamentCardHeader,
  tournamentCardTitle,
  tournamentCardMeta,
  tournamentCardStats,
  tournamentCardStatus,
  statusBadge,
  statusBadgeUpcoming,
  statusBadgeOngoing,
  statusBadgeCompleted,
  tournamentCardDescription,
  createButton,
  emptyState,
  loadingState,
  errorState,
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'UPCOMING':
        return statusBadgeUpcoming;
      case 'ONGOING':
        return statusBadgeOngoing;
      case 'COMPLETED':
        return statusBadgeCompleted;
      default:
        return statusBadgeUpcoming;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'UPCOMING':
        return '예정';
      case 'ONGOING':
        return '진행중';
      case 'COMPLETED':
        return '완료';
      default:
        return status;
    }
  };

  const getGameIcon = (gameType: string) => {
    switch (gameType.toLowerCase()) {
      case 'lol':
      case 'league of legends':
        return '🎮';
      case 'pubg':
        return '🔫';
      case 'overwatch':
        return '⚡';
      case 'valorant':
        return '🎯';
      default:
        return '🏆';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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
      {data && data.length > 0 ? (
        <div className={tournamentGrid}>
          {data.map((tournament) => (
            <div key={tournament.id} className={tournamentCard}>
              <div className={tournamentCardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{getGameIcon(tournament.gameType)}</span>
                  <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                    {tournament.gameType}
                  </span>
                </div>
                <div className={tournamentCardStatus}>
                  <span className={`${statusBadge} ${getStatusBadgeClass(tournament.status)}`}>
                    {getStatusText(tournament.status)}
                  </span>
                </div>
              </div>

              <h3 className={tournamentCardTitle}>{tournament.title}</h3>

              {tournament.description && (
                <p className={tournamentCardDescription}>{tournament.description}</p>
              )}

              <div className={tournamentCardStats}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                    시작일
                  </span>
                  <span style={{ fontWeight: 600 }}>{formatDate(tournament.startDate)}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                    종료일
                  </span>
                  <span style={{ fontWeight: 600 }}>{formatDate(tournament.endDate)}</span>
                </div>
              </div>

              <div className={tournamentCardMeta}>
                <Link
                  href={`/tournaments/${tournament.id}`}
                  style={{
                    background: 'linear-gradient(45deg, #4f9fff, #ff4f9f)',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    display: 'block',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(79, 159, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  자세히 보기
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={emptyState}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏆</div>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>등록된 토너먼트가 없습니다</h3>
          <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>
            첫 번째 토너먼트를 생성해보세요!
          </p>
          <Link href="/tournaments/create" className={createButton}>
            토너먼트 생성하기
          </Link>
        </div>
      )}
    </div>
  );
}
