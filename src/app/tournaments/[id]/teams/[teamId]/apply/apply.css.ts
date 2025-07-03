import { style } from '@vanilla-extract/css';

export const wrapper = style({
  maxWidth: 480,
  margin: '0 auto',
  padding: 24,
});

export const title = style({
  fontSize: '1.3rem',
  fontWeight: 700,
  marginBottom: 24,
});

export const formGroup = style({
  marginBottom: 18,
});

export const label = style({
  fontWeight: 600,
  marginBottom: 6,
  display: 'block',
});

export const textarea = style({
  width: '100%',
  borderRadius: 8,
  border: '1px solid #e0e7ef',
  padding: 10,
  fontSize: '1rem',
  resize: 'vertical',
});

export const submitButton = style({
  width: '100%',
  background: 'linear-gradient(45deg, #4f9fff, #ff4f9f)',
  color: 'white',
  border: 'none',
  borderRadius: 8,
  padding: '0.9rem 0',
  fontWeight: 700,
  fontSize: '1.1rem',
  marginTop: 10,
  cursor: 'pointer',
  transition: 'opacity 0.2s',
  selectors: {
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.7,
    },
  },
});

export const error = style({
  color: '#ff4f9f',
  marginTop: 16,
  fontWeight: 600,
});

export const success = style({
  color: '#4f9fff',
  marginTop: 16,
  fontWeight: 600,
});
