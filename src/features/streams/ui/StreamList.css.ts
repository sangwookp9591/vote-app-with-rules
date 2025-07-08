import { style } from '@vanilla-extract/css';

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: 24,
  padding: 24,
});

export const card = style({
  textDecoration: 'none',
  color: 'inherit',
  borderRadius: 16,
  boxShadow: '0 2px 12px #e0e7ef33',
  background: '#fff',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  transition: 'box-shadow 0.2s',
  position: 'relative',
  selectors: {
    '&:hover': {
      boxShadow: '0 4px 24px #e0e7ef66',
      transform: 'translateY(-2px) scale(1.01)',
    },
  },
});

export const thumbnail = style({
  position: 'relative',
  width: '100%',
  aspectRatio: '16/9',
  background: '#eee',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const thumbnailImg = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: 0,
});

export const liveBadge = style({
  position: 'absolute',
  top: 12,
  left: 12,
  background: '#ff1744',
  color: '#fff',
  fontWeight: 700,
  fontSize: 13,
  borderRadius: 8,
  padding: '2px 10px',
  boxShadow: '0 2px 8px #ff174455',
  letterSpacing: 1,
  zIndex: 2,
});

export const title = style({
  fontWeight: 700,
  fontSize: 18,
  margin: '16px 16px 8px 16px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const infoRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: '0 16px 16px 16px',
});

export const profile = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

export const profileImg = style({
  width: 28,
  height: 28,
  borderRadius: '50%',
  objectFit: 'cover',
});

export const nickname = style({
  fontSize: 15,
  fontWeight: 500,
});

export const viewers = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  color: '#888',
  fontSize: 14,
});
