'use client';

import Link from 'next/link';
import { Tournament } from '@/entities/tournament';
import { getGameIcon, getStatusText, getStatusColor, formatDate } from '../model/tournament';
import { style } from '@vanilla-extract/css';

const tournamentCard = style({
  background: 'var(--card-bg)',
  border: '1px solid var(--card-border)',
  borderRadius: '12px',
  padding: '1.5rem',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  ':hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    borderColor: '#4f9fff',
  },
});

const tournamentCardHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '1rem',
});

const tournamentCardTitle = style({
  fontSize: '1.25rem',
  fontWeight: 700,
  color: 'var(--foreground)',
  marginBottom: '0.5rem',
});

const tournamentCardDescription = style({
  fontSize: '0.875rem',
  color: 'var(--muted-foreground)',
  lineHeight: 1.5,
  marginBottom: '1rem',
});

const tournamentCardStats = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1rem',
  marginBottom: '1.5rem',
});

const tournamentCardStatus = style({
  display: 'flex',
  justifyContent: 'flex-end',
});

const statusBadge = style({
  padding: '0.25rem 0.75rem',
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: 600,
});

const viewButton = style({
  background: 'linear-gradient(45deg, #4f9fff, #ff4f9f)',
  color: 'white',
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: 600,
  textAlign: 'center',
  transition: 'all 0.3s ease',
  display: 'block',
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(79, 159, 255, 0.4)',
  },
});

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
