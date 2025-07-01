import { style } from '@vanilla-extract/css';

export const tournamentListWrapper = style({
  maxWidth: 900,
  margin: '0 auto',
  padding: '32px 16px',
});

export const tournamentCard = style({
  background: 'var(--card-bg, #fff)',
  border: '1px solid var(--card-border, #eee)',
  borderRadius: 12,
  padding: 24,
  minWidth: 260,
  maxWidth: 320,
  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

export const tournamentTitle = style({
  fontSize: 20,
  fontWeight: 700,
  marginBottom: 8,
});

export const tournamentMeta = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  fontSize: 14,
  color: '#888',
});
