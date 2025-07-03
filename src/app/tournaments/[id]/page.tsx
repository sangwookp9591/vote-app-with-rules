'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  tournamentDetailWrapper,
  tournamentHeader,
  tournamentTitle,
  tournamentDescription,
  tournamentStats,
  tournamentActions,
  applyButton,
  backButton,
  loadingState,
  errorState,
  statsGrid,
  statItem,
  statLabel,
  statValue,
} from './detail.css';
import { useSession } from 'next-auth/react';
import { tournamentsApi } from '@/features/tournaments/api/tournaments';
import { useState } from 'react';

interface Tournament {
  id: string;
  title: string;
  description?: string;
  gameType: string;
  teamSize: number;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
}

export default function TournamentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params?.id as string;
  const { data: session } = useSession();
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const {
    data: tournament,
    isLoading,
    error,
  } = useQuery<Tournament>({
    queryKey: ['tournament', tournamentId],
    queryFn: async () => {
      const res = await fetch(`/api/tournaments/${tournamentId}`);
      if (!res.ok) throw new Error('토너먼트 정보 조회 실패');
      return res.json();
    },
    enabled: !!tournamentId,
  });

  if (!tournamentId) {
    return (
      <div className={tournamentDetailWrapper}>
        <div className={errorState}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
          <div>토너먼트 ID가 없습니다.</div>
        </div>
      </div>
    );
  }

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPCOMING':
        return '#ffc107';
      case 'ONGOING':
        return '#4caf50';
      case 'COMPLETED':
        return '#9e9e9e';
      default:
        return '#ffc107';
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleApply = () => {
    router.push(`/tournaments/${tournamentId}/apply`);
  };

  // 상태 변경 핸들러
  const handleStatusChange = async () => {
    if (!selectedStatus) return;
    setStatusUpdating(true);
    try {
      await tournamentsApi.changeStatus(tournamentId, selectedStatus);
      router.refresh();
    } catch (e) {
      alert('상태 변경 실패: ' + (e as Error).message);
    } finally {
      setStatusUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className={tournamentDetailWrapper}>
        <div className={loadingState}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <div>토너먼트 정보를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className={tournamentDetailWrapper}>
        <div className={errorState}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
          <div>에러 발생: {(error as Error)?.message || '토너먼트를 찾을 수 없습니다.'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={tournamentDetailWrapper}>
      {/* Header */}
      <div className={tournamentHeader}>
        <Link href="/tournaments" className={backButton}>
          ← 토너먼트 목록으로
        </Link>
        {/* <Link href="/streamer-profile" className={applyButton} style={{ marginLeft: 16 }}>
          프로필 등록/수정
        </Link> */}

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '2rem' }}>{getGameIcon(tournament.gameType)}</span>
          <div>
            <h1 className={tournamentTitle}>{tournament.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: 'var(--muted-foreground)' }}>{tournament.gameType}</span>
              <span
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: `${getStatusColor(tournament.status)}20`,
                  color: getStatusColor(tournament.status),
                }}
              >
                {getStatusText(tournament.status)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tournament Stats */}
      <div className={tournamentStats}>
        <div className={statsGrid}>
          <div className={statItem}>
            <div className={statLabel}>시작일</div>
            <div className={statValue}>{formatDate(tournament.startDate)}</div>
          </div>
          <div className={statItem}>
            <div className={statLabel}>종료일</div>
            <div className={statValue}>{formatDate(tournament.endDate)}</div>
          </div>
          <div className={statItem}>
            <div className={statLabel}>생성일</div>
            <div className={statValue}>{formatDate(tournament.createdAt)}</div>
          </div>
          <div className={statItem}>
            <div className={statLabel}>상태</div>
            <div className={statValue}>{getStatusText(tournament.status)}</div>
          </div>
          <div className={statItem}>
            <div className={statLabel}>팀원 수</div>
            <div className={statValue} style={{ color: '#4f9fff', fontWeight: 600 }}>
              {tournament.teamSize}명
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {tournament.description && (
        <div className={tournamentDescription}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>
            토너먼트 설명
          </h3>
          <p style={{ lineHeight: 1.6, color: 'var(--foreground)' }}>{tournament.description}</p>
        </div>
      )}

      {/* Actions */}
      <div className={tournamentActions}>
        <Link href={`/tournaments/${tournamentId}/teams`} className={applyButton}>
          팀 목록
        </Link>
        {tournament.status === 'UPCOMING' && (
          <>
            <Link href={`/tournaments/${tournamentId}/teams/create`} className={applyButton}>
              팀 생성하기
            </Link>
            <Link href={`/tournaments/${tournamentId}/apply`} className={applyButton}>
              참가 신청
            </Link>
          </>
        )}
        {/*
        {tournament.status === 'ONGOING' && (
          <Link href={``} className={applyButton}>
            참가자 목록 보기
          </Link>
        )}
        {tournament.status === 'COMPLETED' && (
          <Link href={``} className={applyButton}>
            결과 보기
          </Link>
        )}
        */}
      </div>
    </div>
  );
}
