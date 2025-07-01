import { style } from '@vanilla-extract/css';

export const tournamentListWrapper = style({
  maxWidth: 1200,
  margin: '0 auto',
  padding: '32px 16px',
  marginTop: 64,
});

export const tournamentHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '3rem',
  gap: '2rem',
  '@media': {
    '(max-width: 768px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
});

export const tournamentTitle = style({
  fontSize: '3rem',
  fontWeight: 800,
  marginBottom: '0.5rem',
  background: 'linear-gradient(45deg, #4f9fff, #ff4f9f)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
});

export const tournamentSubtitle = style({
  fontSize: '1.25rem',
  color: 'var(--muted-foreground)',
  margin: 0,
});

export const createButton = style({
  background: 'linear-gradient(45deg, #4f9fff, #ff4f9f)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  whiteSpace: 'nowrap',
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(79, 159, 255, 0.4)',
  },
});

export const tournamentGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '2rem',
  '@media': {
    '(max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const tournamentCard = style({
  background: 'var(--card-bg)',
  border: '1px solid var(--card-border)',
  borderRadius: '16px',
  padding: '1.5rem',
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  ':hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
  },
});

export const tournamentCardHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '1rem',
});

export const tournamentCardTitle = style({
  fontSize: '1.5rem',
  fontWeight: 700,
  margin: 0,
  color: 'var(--foreground)',
  lineHeight: 1.3,
});

export const tournamentCardDescription = style({
  color: 'var(--muted-foreground)',
  fontSize: '0.875rem',
  lineHeight: 1.5,
  margin: 0,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

export const tournamentCardStats = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem',
  padding: '1rem',
  background: 'var(--gray-alpha-100)',
  borderRadius: '8px',
});

export const tournamentCardStatus = style({
  display: 'flex',
  justifyContent: 'flex-end',
});

export const statusBadge = style({
  padding: '0.25rem 0.75rem',
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

export const statusBadgeUpcoming = style({
  background: 'rgba(255, 193, 7, 0.1)',
  color: '#ffc107',
});

export const statusBadgeOngoing = style({
  background: 'rgba(76, 175, 80, 0.1)',
  color: '#4caf50',
});

export const statusBadgeCompleted = style({
  background: 'rgba(158, 158, 158, 0.1)',
  color: '#9e9e9e',
});

export const tournamentCardMeta = style({
  marginTop: 'auto',
});

export const timeRemaining = style({
  fontSize: '0.875rem',
  color: 'var(--muted-foreground)',
  marginTop: '0.5rem',
});

export const emptyState = style({
  textAlign: 'center',
  padding: '4rem 2rem',
  color: 'var(--muted-foreground)',
});

export const loadingState = style({
  textAlign: 'center',
  padding: '4rem 2rem',
  color: 'var(--muted-foreground)',
});

export const errorState = style({
  textAlign: 'center',
  padding: '4rem 2rem',
  color: '#ef4444',
});
