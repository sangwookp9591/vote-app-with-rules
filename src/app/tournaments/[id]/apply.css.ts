import { style } from '@vanilla-extract/css';

export const formCard = style({
  background: 'var(--card-bg)',
  border: '1px solid var(--card-border)',
  borderRadius: '16px',
  padding: '2rem',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  maxWidth: 480,
  margin: '0 auto',
});

export const formTitle = style({
  fontSize: '1.5rem',
  fontWeight: 700,
  marginBottom: '1.5rem',
  color: 'var(--foreground)',
});

export const fieldLabel = style({
  fontWeight: 600,
  marginBottom: '0.5rem',
  color: 'var(--muted-foreground)',
});

export const iconButton = style({
  border: 'none',
  background: 'none',
  borderRadius: '8px',
  padding: '8px 14px',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  transition: 'background 0.15s, border 0.15s',
  selectors: {
    '&[data-active="true"]': {
      background: 'var(--primary-bg)',
      border: '2px solid var(--primary)',
      color: 'var(--primary)',
    },
    '&:hover': {
      background: 'var(--primary-bg)',
    },
  },
});

export const chip = style({
  display: 'inline-flex',
  alignItems: 'center',
  background: 'var(--primary-bg)',
  color: 'var(--primary)',
  borderRadius: '16px',
  padding: '4px 12px',
  fontWeight: 600,
  marginRight: '8px',
  marginBottom: '8px',
  fontSize: '0.95rem',
  gap: 4,
});

export const chipRemove = style({
  background: 'none',
  border: 'none',
  color: 'var(--primary)',
  fontWeight: 700,
  cursor: 'pointer',
  marginLeft: 4,
  fontSize: '1.1em',
});

export const submitButton = style({
  background: 'linear-gradient(45deg, #4f9fff, #ff4f9f)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  padding: '0.75rem 2rem',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: '2rem',
  transition: 'all 0.3s ease',
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(79, 159, 255, 0.4)',
  },
});
