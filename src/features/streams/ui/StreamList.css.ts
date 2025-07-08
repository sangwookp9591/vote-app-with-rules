import { style } from '@vanilla-extract/css';

export const grid = style({
  display: 'grid',
  justifyContent: 'start', // 왼쪽 정렬
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: 16,
  padding: 12,
  '@media': {
    'screen and (min-width: 1200px)': {
      gridTemplateColumns: 'repeat(6, 1fr)',
    },
    'screen and (max-width: 1199px) and (min-width: 900px)': {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
    'screen and (max-width: 899px) and (min-width: 600px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    'screen and (max-width: 599px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const card = style({
  textDecoration: 'none',
  color: 'inherit',
  borderRadius: 12,
  boxShadow: '0 2px 8px #e0e7ef33',
  background: '#fff',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  transition: 'box-shadow 0.2s',
  position: 'relative',
  minWidth: 0,
  maxWidth: 220,
  margin: 0,
  selectors: {
    '&:hover': {
      boxShadow: '0 4px 16px #e0e7ef66',
      transform: 'translateY(-2px) scale(1.01)',
    },
  },
});

export const thumbnail = style({
  position: 'relative',
  width: '100%',
  aspectRatio: '4/3',
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
  top: 8,
  left: 8,
  background: '#ff1744',
  color: '#fff',
  fontWeight: 700,
  fontSize: 12,
  borderRadius: 7,
  padding: '2px 8px',
  boxShadow: '0 2px 8px #ff174455',
  letterSpacing: 1,
  zIndex: 2,
});

export const title = style({
  fontWeight: 700,
  fontSize: 15,
  margin: '10px 10px 6px 10px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const infoRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: '0 10px 10px 10px',
});

export const profile = style({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
});

export const profileImg = style({
  width: 22,
  height: 22,
  borderRadius: '50%',
  objectFit: 'cover',
});

export const nickname = style({
  fontSize: 13,
  fontWeight: 500,
});

export const viewers = style({
  display: 'flex',
  alignItems: 'center',
  gap: 3,
  color: '#888',
  fontSize: 12,
});
