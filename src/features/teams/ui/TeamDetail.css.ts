import { recipe } from '@vanilla-extract/recipes';

export const buttonStyle = recipe({
  base: {
    border: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    padding: '0.5rem 0.7rem',
  },
  variants: {
    variant: {
      primary: { background: '#4f9fff', color: '#fff' },
      secondary: { background: '#fff', color: '#4f9fff', border: '1px solid #4f9fff' },
    },
    size: {
      md: { fontSize: '0.8rem' },
      lg: { fontSize: '1.2rem', padding: '1rem 2rem' },
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});
