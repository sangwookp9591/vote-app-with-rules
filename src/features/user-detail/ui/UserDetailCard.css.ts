// src/features/user-detail/ui/UserDetailCard.css.ts
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const cardContainer = style({
  width: '90vw',
  display: 'flex',
  flexDirection: 'row',
  gap: '10px',
});

export const leftSection = style({
  display: 'flex',
  flexDirection: 'column',
  width: '10vw',
  gap: '10px',
});
export const userInfoCard = style({
  margin: '0 auto',
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  padding: 24,
  position: 'relative',
  color: 'black',
});

export const profileSection = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 16,
});

export const profileImg = style({
  width: 96,
  height: 96,
  borderRadius: '50%',
  border: '4px solid #fff',
  objectFit: 'cover',
  background: '#eee',
});

export const nickname = style({
  fontSize: '1.5rem',
  fontWeight: 'bold',
});

export const badges = style({
  display: 'flex',
  gap: 8,
});

export const rightSection = style({
  width: '90vw',
  display: 'flex',
  flexDirection: 'column',
});
export const userBannerCard = style({
  width: '100%',
  height: '80%',
  margin: '0 auto',
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  padding: 24,
  position: 'relative',
});

export const banner = style({
  width: '100%',
  height: 300,
  overflow: 'hidden',
  borderRadius: 12,
  position: 'relative',
  marginBottom: 16,
});

export const bannerImg = style({
  width: '100%',
  height: '100%',
  objectFit: 'fill',
  position: 'absolute',
  left: 0,
  top: 0,
});

export const badge = recipe({
  base: {
    padding: '4px 10px',
    borderRadius: 12,
    fontSize: '0.9rem',
    color: '#fff',
    background: '#888',
    fontWeight: 500,
    display: 'inline-block',
  },
  variants: {
    type: {
      파트너: { background: '#4a90e2' },
      베스트: { background: '#7ed957' },
      서포터즈: { background: '#f5a623' },
      기본: { background: '#888' },
    },
  },
  defaultVariants: {
    type: '기본',
  },
});
export const bottomSection = style({
  display: 'flex',
  gap: 10,
  justifyContent: 'space-between',
});
export const stats = style({
  display: 'flex',
  alignItems: 'center',
  gap: 24,
  justifyContent: 'right',
  margin: '16px 0',
  fontSize: '1.1rem',
});

export const description = style({
  margin: '12px 0',
  color: '#444',
});

export const snsLinks = style({
  display: 'flex',
  justifyContent: 'right',
  gap: 12,
  marginBottom: 20,
});

export const snsIcon = style({
  display: 'flex', // flex 레이아웃 적용
  alignItems: 'center', // 세로 중앙 정렬
  justifyContent: 'center', // 가로 중앙 정렬
  width: '40px', // 아이콘이 들어갈 정사각형 크기 설정 (원형이 되도록)
  height: '40px',
  borderRadius: '50%', // 원형
  padding: '5px', // 필요시 조절
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
});

export const starIcon = style({
  transition: 'fill 0.4s ease', // fill 색상 애니메이션
  cursor: 'pointer',
});
