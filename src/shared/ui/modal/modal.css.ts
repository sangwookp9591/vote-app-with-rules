import { style, keyframes } from '@vanilla-extract/css';

export const testButton = style({
  padding: '12px 24px',
  fontSize: '16px',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: '#4A90E2',
  color: '#fff',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease-in-out', // 👈 부드러운 색상 변화

  selectors: {
    '&:hover': {},
  },
});

export const underlineText = style({
  position: 'relative',
  display: 'inline-block',

  selectors: {
    '&::after': {
      content: "''",
      position: 'absolute',
      left: 0, // 왼쪽부터 시작
      bottom: -2, //텍스트보다 아래로 이동
      height: 2, //선의 두깨
      width: '0%', //처음에는 안보이게
      backgroundColor: '#4A90E2',
      transition: 'width 0.3s ease-in-out', //부드럽게 늘어나게
    },
    '&:hover::after': {
      width: '100%',
    },
  },
});

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const fadeOut = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

export const modalOverlay = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
});

export const modalContent = style({
  backgroundColor: '#fff',
  borderRadius: 8,
  padding: 24,
  width: 320,
  margin: '100px auto',
  position: 'relative',
  animationDuration: '0.3s',
  animationFillMode: 'forwards',
});

export const fadeInAnimation = style({
  animationName: fadeIn,
  animationTimingFunction: 'ease-in-out',
});

export const fadeOutAnimation = style({
  animationName: fadeOut,
  animationTimingFunction: 'ease-in-out',
});
