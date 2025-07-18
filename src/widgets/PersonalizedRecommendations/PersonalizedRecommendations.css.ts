import { style } from '@vanilla-extract/css';

// 컨테이너 스타일
export const container = style({
  marginBottom: 24,
});

// 타이틀 스타일
export const title = style({
  fontWeight: 700,
  fontSize: 16,
  marginBottom: 8,
});

// 카드 리스트(가로 스크롤)
export const cardList = style({
  display: 'flex',
  gap: 12,
  overflowX: 'auto',
});

// 추천 카드 스타일
export const card = style({
  minWidth: 140,
  background: '#f7faff',
  border: '1px solid #e0e7ef',
  borderRadius: 12,
  padding: 12,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxShadow: '0 2px 8px #e0e7ef33',
});

// 프로필 이미지 스타일
export const profileImage = style({
  width: 48,
  height: 48,
  borderRadius: '50%',
  marginBottom: 8,
  objectFit: 'cover',
});

// 닉네임 스타일
export const nickname = style({
  fontWeight: 600,
  fontSize: 15,
});

// 추천 이유 스타일
export const reason = style({
  color: '#4f9fff',
  fontSize: 13,
  margin: '4px 0',
});
