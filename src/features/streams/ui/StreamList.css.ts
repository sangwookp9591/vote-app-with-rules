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

// --- 카테고리 필터 UI 스타일 ---
export const filterRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  margin: '0 0 16px 0',
  padding: '0 24px',
});

export const filterLabel = style({
  fontWeight: 700,
  fontSize: 15,
});

export const filterSelect = style({
  marginLeft: 8,
  padding: 6,
  borderRadius: 6,
  border: '1px solid #e0e7ef',
});

// --- 카테고리 뱃지 스타일 ---
export const categoryBadgeRow = style({
  display: 'flex',
  gap: 6,
  margin: '0 10px 6px 10px',
});

export const categoryTypeBadge = style({
  background: '#eaf6ff',
  color: '#2176d2',
  borderRadius: 6,
  fontSize: 12,
  padding: '2px 8px',
  fontWeight: 700,
});

export const categoryDetailBadge = style({
  background: '#f5eaff',
  color: '#7c3aed',
  borderRadius: 6,
  fontSize: 12,
  padding: '2px 8px',
  fontWeight: 700,
});
