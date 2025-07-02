import { style } from '@vanilla-extract/css';

export const tournamentListWrapper = style({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '2rem',
});

export const tournamentHeader = style({
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

export const tournamentTitle = style({
  fontSize: '2.5rem',
  fontWeight: 700,
  color: 'var(--foreground)',
  marginBottom: '0.5rem',
});

export const tournamentSubtitle = style({
  fontSize: '1.125rem',
  color: 'var(--muted-foreground)',
  lineHeight: 1.5,
});

export const createButton = style({
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

export const tournamentGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: '1.5rem',
  '@media': {
    '(max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const loadingState = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4rem 2rem',
  textAlign: 'center',
  color: 'var(--muted-foreground)',
});

export const errorState = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4rem 2rem',
  textAlign: 'center',
  color: '#dc3545',
});

export const emptyState = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4rem 2rem',
  textAlign: 'center',
  color: 'var(--muted-foreground)',
});
