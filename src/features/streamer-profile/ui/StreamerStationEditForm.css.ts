import { style } from '@vanilla-extract/css';

export const bannerPreview = style({
  width: '100%',
  height: '100%',
  objectFit: 'fill',
  position: 'absolute',
  left: 0,
  top: 0,
});

export const submitButton = style({
  background: '#4a90e2',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '10px 24px',
  fontWeight: 700,
  fontSize: 16,
  cursor: 'pointer',
});

export const bannerImageStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  width: '100%',
  height: 140,
  borderRadius: '10px',
  background: '#f5f5f5',
  cursor: 'pointer',
  marginBottom: 8,
  overflow: 'hidden',
  transition: 'border-color 0.2s',
  selectors: {
    '&:hover': {
      borderColor: 'var(--primary, #4f9fff)',
    },
  },
});

export const bannerImageInput = style({
  display: 'none',
});
