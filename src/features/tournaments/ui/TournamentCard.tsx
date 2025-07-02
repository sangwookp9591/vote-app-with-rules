'use client';

import Link from 'next/link';
import { Tournament } from '@/entities/tournament';
import { getGameIcon, getStatusText, getStatusColor, formatDate } from '../model/tournament';
import {
  tournamentCard,
  tournamentCardHeader,
  tournamentCardTitle,
  tournamentCardDescription,
  tournamentCardStats,
  tournamentCardStatus,
  statusBadge,
  viewButton,
} from './TournamentCard.css';

interface TournamentCardProps {
  tournament: Tournament;
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  return (
    <div className={tournamentCard}>
      <div className={tournamentCardHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>{getGameIcon(tournament.gameType)}</span>
          <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>{tournament.gameType}</span>
        </div>
        <div className={tournamentCardStatus}>
          <span
            className={statusBadge}
            style={{
              backgroundColor: `${getStatusColor(tournament.status)}20`,
              color: getStatusColor(tournament.status),
            }}
          >
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
          <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>시작일</span>
          <span style={{ fontWeight: 600 }}>{formatDate(tournament.startDate)}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>종료일</span>
          <span style={{ fontWeight: 600 }}>{formatDate(tournament.endDate)}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>팀원 수</span>
          <span style={{ fontWeight: 600, color: '#4f9fff' }}>{tournament.teamSize}명</span>
        </div>
      </div>

      <Link href={`/tournaments/${tournament.id}`} className={viewButton}>
        자세히 보기
      </Link>
    </div>
  );
}
