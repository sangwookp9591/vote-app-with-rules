import { style } from '@vanilla-extract/css';

// 섹션 전체 컨테이너
export const section = style({
  margin: '0 0 32px 0',
  padding: '0 24px',
});

// 섹션 타이틀
export const title = style({
  fontWeight: 800,
  fontSize: 20,
  margin: '0 0 12px 0',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

// 가로 스크롤 카드 리스트
export const scrollRow = style({
  display: 'flex',
  overflowX: 'auto',
  gap: 16,
  paddingBottom: 8,
  WebkitOverflowScrolling: 'touch',
});

// 개별 카드
export const card = style({
  minWidth: 160,
  maxWidth: 200,
  background: '#fff',
  borderRadius: 12,
  boxShadow: '0 2px 8px #e0e7ef33',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 16,
  position: 'relative',
  transition: 'box-shadow 0.2s',
  selectors: {
    '&:hover': {
      boxShadow: '0 4px 16px #e0e7ef66',
      transform: 'translateY(-2px) scale(1.01)',
    },
  },
});

// 프로필 이미지
export const profileImg = style({
  width: 56,
  height: 56,
  borderRadius: '50%',
  objectFit: 'cover',
  marginBottom: 8,
  border: '2px solid #eaf6ff',
});

// 닉네임
export const nickname = style({
  fontWeight: 700,
  fontSize: 15,
  marginBottom: 4,
});

// 통계(시청자/팔로워/투표)
export const stats = style({
  display: 'flex',
  gap: 8,
  fontSize: 12,
  color: '#555',
  marginBottom: 4,
});

// 랭킹 순위 뱃지
export const rankBadge = style({
  position: 'absolute',
  top: 8,
  left: 8,
  background: '#ffe066',
  color: '#b8860b',
  fontWeight: 800,
  fontSize: 13,
  borderRadius: 8,
  padding: '2px 10px',
  boxShadow: '0 2px 8px #ffe06655',
  zIndex: 2,
});

// 1~3위 강조
export const topRank = style({
  background: '#ffb300',
  color: '#fff',
});
