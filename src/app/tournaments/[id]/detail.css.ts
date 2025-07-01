import { style } from '@vanilla-extract/css';

export const tournamentDetailWrapper = style({
  maxWidth: 1000,
  margin: '0 auto',
  padding: '32px 16px',
  marginTop: 64,
});

export const tournamentHeader = style({
  marginBottom: '2rem',
});

export const tournamentTitle = style({
  fontSize: '2.5rem',
  fontWeight: 800,
  margin: 0,
  background: 'linear-gradient(45deg, #4f9fff, #ff4f9f)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
});

export const tournamentDescription = style({
  background: 'var(--card-bg)',
  border: '1px solid var(--card-border)',
  borderRadius: '16px',
  padding: '1.5rem',
  marginBottom: '2rem',
});

export const tournamentStats = style({
  background: 'var(--card-bg)',
  border: '1px solid var(--card-border)',
  borderRadius: '16px',
  padding: '1.5rem',
  marginBottom: '2rem',
});

export const statsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1.5rem',
  '@media': {
    '(max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const statItem = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

export const statLabel = style({
  fontSize: '0.875rem',
  color: 'var(--muted-foreground)',
  fontWeight: 500,
});

export const statValue = style({
  fontSize: '1.125rem',
  fontWeight: 600,
  color: 'var(--foreground)',
});

export const tournamentActions = style({
  display: 'flex',
  gap: '1rem',
  justifyContent: 'center',
  marginTop: '2rem',
  '@media': {
    '(max-width: 768px)': {
      flexDirection: 'column',
    },
  },
});

export const applyButton = style({
  background: 'linear-gradient(45deg, #4f9fff, #ff4f9f)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  padding: '1rem 2rem',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(79, 159, 255, 0.4)',
  },
});

export const backButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  color: 'var(--muted-foreground)',
  textDecoration: 'none',
  fontSize: '0.875rem',
  fontWeight: 500,
  marginBottom: '1rem',
  transition: 'color 0.2s ease',
  ':hover': {
    color: 'var(--foreground)',
  },
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
