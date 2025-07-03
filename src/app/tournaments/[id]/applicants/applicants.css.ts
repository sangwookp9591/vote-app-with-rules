import { style } from '@vanilla-extract/css';

export const applicantsGrid = style({
  display: 'grid',
  gap: 20,
  maxHeight: 600,
  overflowY: 'auto',
  gridTemplateColumns: 'repeat(1, 1fr)',
  '@media': {
    '(min-width: 600px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '(min-width: 900px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    '(min-width: 1200px)': {
      gridTemplateColumns: 'repeat(5, 1fr)',
    },
  },
});

export const applicantCard = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'var(--card-bg, #f8fbff)',
  borderRadius: 12,
  padding: 16,
  boxShadow: '0 2px 8px rgba(79,159,255,0.07)',
  border: '1.5px solid var(--card-border, #e0e7ef)',
  transition: 'background 0.2s',
  width: 180,
  minWidth: 180,
  maxWidth: 180,
  minHeight: 210,
  maxHeight: 240,
  margin: '0 auto',
  color: 'var(--foreground, #222)',
  selectors: {
    'html.dark &': {
      background: '#181c20',
      color: '#f3f3f3',
      border: '1.5px solid #23272f',
    },
  },
});

export const avatar = style({
  width: 48,
  height: 48,
  borderRadius: '50%',
  overflow: 'hidden',
  background: '#e0e7ef',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 24,
  fontWeight: 700,
  marginBottom: 10,
});

export const nickname = style({
  fontWeight: 700,
  fontSize: '1rem',
  marginBottom: 6,
  textAlign: 'center',
});

export const position = style({
  color: '#4f9fff',
  fontWeight: 600,
  marginBottom: 2,
  fontSize: '0.95rem',
});

export const tier = style({
  color: '#ff4f9f',
  fontWeight: 600,
  marginBottom: 4,
  fontSize: '0.95rem',
});

export const createdAt = style({
  color: '#888',
  fontSize: 11,
});

export const positionPill = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  background: 'rgba(79,159,255,0.08)',
  borderRadius: 16,
  padding: '4px 12px',
  fontWeight: 600,
  fontSize: '0.97rem',
  color: '#4f9fff',
  marginBottom: 4,
  marginTop: 2,
  border: '1px solid #e0e7ef',
  selectors: {
    'html.dark &': {
      background: 'rgba(79,159,255,0.18)',
      border: '1px solid #23272f',
      color: '#7ec3ff',
    },
  },
});

export const tierPill = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  background: 'rgba(255,79,159,0.08)',
  borderRadius: 16,
  padding: '4px 12px',
  fontWeight: 600,
  fontSize: '0.97rem',
  color: '#ff4f9f',
  marginBottom: 4,
  marginTop: 2,
  border: '1px solid #e0e7ef',
  selectors: {
    'html.dark &': {
      background: 'rgba(255,79,159,0.18)',
      border: '1px solid #23272f',
      color: '#ffb3d4',
    },
  },
});
