import { style } from '@vanilla-extract/css';

export const container = style({
  maxWidth: '95vw',
  margin: '0 auto',
  padding: 24,
});

export const flexRow = style({
  display: 'flex',
  gap: 24,
  alignItems: 'flex-start',
  '@media': {
    'screen and (max-width: 900px)': {
      flexDirection: 'column',
      gap: 16,
    },
  },
});

export const playerAreaCol = style({
  flex: 2,
  minWidth: 0,
});

export const chatArea = style({
  flex: 1,
  minWidth: 0,
  background: '#f8fbff',
  borderRadius: 12,
  boxShadow: '0 2px 8px #e0e7ef33',
  padding: 0,
  height: '60vh',
  display: 'flex',
  flexDirection: 'column',
  '@media': {
    'screen and (max-width: 900px)': {
      height: 320,
      marginTop: 8,
    },
  },
});

export const titleRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
});

export const liveBadge = style({
  background: '#ff1744',
  color: '#fff',
  borderRadius: 8,
  padding: '2px 10px',
  fontWeight: 700,
  fontSize: 13,
});

export const description = style({
  color: '#888',
  marginBottom: 8,
});

export const streamerRow = style({
  marginBottom: 12,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

export const profileImg = style({
  width: 32,
  height: 32,
  borderRadius: '50%',
  objectFit: 'cover',
  marginLeft: 8,
});

export const statusRow = style({
  marginBottom: 12,
});

export const viewersRow = style({
  marginBottom: 12,
});

export const buttonRow = style({
  marginBottom: 24,
});

export const actionButton = style({
  border: 'none',
  borderRadius: 8,
  padding: '8px 24px',
  fontWeight: 700,
  cursor: 'pointer',
  fontSize: 16,
  selectors: {
    '&[data-variant="start"]': {
      background: '#4f9fff',
      color: '#fff',
    },
    '&[data-variant="end"]': {
      background: '#ff1744',
      color: '#fff',
    },
  },
});

export const actionError = style({
  color: 'red',
  marginTop: 8,
});

export const playerArea = style({
  width: '100%',
  aspectRatio: '16/9',
  background: '#eee',
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 24,
  fontWeight: 700,
  marginBottom: 32,
  boxShadow: '0 2px 12px #e0e7ef33',
  overflow: 'hidden',
});

export const playerAreaLive = style({
  background: '#222',
  color: '#fff',
});
