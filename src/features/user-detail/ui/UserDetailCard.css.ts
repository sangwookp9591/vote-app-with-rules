// src/features/user-detail/ui/UserDetailCard.css.ts
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const cardContainer = style({
  width: '90vw',
  display: 'flex',
  flexDirection: 'row',
});
export const userInfoCard = style({
  maxWidth: 600,
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

export const userBannerCard = style({
  width: '90vw',
  margin: '0 auto',
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  padding: 24,
  position: 'relative',
});

export const banner = style({
  width: '100%',
  height: 160,
  overflow: 'hidden',
  borderRadius: 12,
  marginBottom: -60,
});

export const bannerImg = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
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

export const stats = style({
  display: 'flex',
  gap: 24,
  margin: '16px 0',
  fontSize: '1.1rem',
});

export const description = style({
  margin: '12px 0',
  color: '#444',
});

export const snsLinks = style({
  display: 'flex',
  gap: 12,
});

export const snsIcon = style({
  width: 28,
  height: 28,
});
