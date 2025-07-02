import { style } from '@vanilla-extract/css';

export const tournamentCard = style({
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

export const tournamentCardHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '1rem',
});

export const tournamentCardTitle = style({
  fontSize: '1.25rem',
  fontWeight: 700,
  color: 'var(--foreground)',
  marginBottom: '0.5rem',
});

export const tournamentCardDescription = style({
  fontSize: '0.875rem',
  color: 'var(--muted-foreground)',
  lineHeight: 1.5,
  marginBottom: '1rem',
});

export const tournamentCardStats = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1rem',
  marginBottom: '1.5rem',
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
});

export const viewButton = style({
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
