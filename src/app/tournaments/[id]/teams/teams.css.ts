import { style } from '@vanilla-extract/css';

export const wrapper = style({
  maxWidth: 900,
  margin: '0 auto',
  padding: 24,
});

export const title = style({
  fontSize: '1.5rem',
  fontWeight: 700,
  marginBottom: 24,
});

export const topBar = style({
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: 20,
});

export const createButton = style({
  background: 'linear-gradient(45deg, #4f9fff, #ff4f9f)',
  color: 'white',
  padding: '0.75rem 1.5rem',
  borderRadius: 8,
  fontWeight: 600,
  textDecoration: 'none',
  fontSize: '1rem',
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: 24,
});

export const card = style({
  background: 'var(--card-bg, #f8fbff)',
  border: '1.5px solid var(--card-border, #e0e7ef)',
  borderRadius: 14,
  padding: 20,
  boxShadow: '0 2px 8px rgba(79,159,255,0.07)',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  minHeight: 180,
});

export const teamName = style({
  fontWeight: 700,
  fontSize: '1.15rem',
  marginBottom: 4,
});

export const teamDesc = style({
  color: '#888',
  fontSize: 13,
  marginBottom: 6,
});

export const leaderRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 4,
});

export const leaderLabel = style({
  fontSize: 13,
  color: '#4f9fff',
  fontWeight: 600,
});

export const leaderAvatar = style({
  width: 28,
  height: 28,
  borderRadius: '50%',
  background: '#e0e7ef',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: 15,
});

export const leaderName = style({
  fontWeight: 600,
  fontSize: 14,
});

export const memberCount = style({
  fontSize: 13,
  color: '#888',
});

export const applyButton = style({
  marginTop: 10,
  background: 'linear-gradient(45deg, #4f9fff, #ff4f9f)',
  color: 'white',
  padding: '0.5rem 1rem',
  borderRadius: 8,
  fontWeight: 600,
  textDecoration: 'none',
  fontSize: '0.98rem',
  textAlign: 'center',
  display: 'inline-block',
});

export const error = style({
  color: '#ff4f9f',
});

export const leaderCrown = style({
  marginLeft: 4,
  fontSize: '1.1em',
  color: '#ffd700',
  verticalAlign: 'middle',
});
