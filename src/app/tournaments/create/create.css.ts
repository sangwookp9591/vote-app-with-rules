import { style } from '@vanilla-extract/css';

export const createPageWrapper = style({
  maxWidth: 800,
  margin: '0 auto',
  padding: '32px 16px',
  marginTop: 64,
});

export const createForm = style({
  background: 'var(--card-bg)',
  border: '1px solid var(--card-border)',
  borderRadius: '16px',
  padding: '2rem',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
});

export const formTitle = style({
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: '2rem',
  textAlign: 'center',
  background: 'linear-gradient(45deg, #4f9fff, #ff4f9f)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
});

export const formGroup = style({
  marginBottom: '1.5rem',
});

export const formLabel = style({
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: 600,
  color: 'var(--foreground)',
  fontSize: '0.875rem',
});

export const formInput = style({
  width: '100%',
  padding: '0.75rem',
  border: '1px solid var(--card-border)',
  borderRadius: '8px',
  fontSize: '1rem',
  background: 'var(--background)',
  color: 'var(--foreground)',
  transition: 'border-color 0.2s ease',
  ':focus': {
    outline: 'none',
    borderColor: '#4f9fff',
    boxShadow: '0 0 0 3px rgba(79, 159, 255, 0.1)',
  },
});

export const formTextarea = style({
  width: '100%',
  padding: '0.75rem',
  border: '1px solid var(--card-border)',
  borderRadius: '8px',
  fontSize: '1rem',
  background: 'var(--background)',
  color: 'var(--foreground)',
  resize: 'vertical',
  minHeight: '100px',
  transition: 'border-color 0.2s ease',
  ':focus': {
    outline: 'none',
    borderColor: '#4f9fff',
    boxShadow: '0 0 0 3px rgba(79, 159, 255, 0.1)',
  },
});

export const formSelect = style({
  width: '100%',
  padding: '0.75rem',
  border: '1px solid var(--card-border)',
  borderRadius: '8px',
  fontSize: '1rem',
  background: 'var(--background)',
  color: 'var(--foreground)',
  cursor: 'pointer',
  transition: 'border-color 0.2s ease',
  ':focus': {
    outline: 'none',
    borderColor: '#4f9fff',
    boxShadow: '0 0 0 3px rgba(79, 159, 255, 0.1)',
  },
});

export const formDateInput = style({
  width: '100%',
  padding: '0.75rem',
  border: '1px solid var(--card-border)',
  borderRadius: '8px',
  fontSize: '1rem',
  background: 'var(--background)',
  color: 'var(--foreground)',
  transition: 'border-color 0.2s ease',
  ':focus': {
    outline: 'none',
    borderColor: '#4f9fff',
    boxShadow: '0 0 0 3px rgba(79, 159, 255, 0.1)',
  },
});

export const buttonGroup = style({
  display: 'flex',
  gap: '1rem',
  justifyContent: 'flex-end',
  marginTop: '2rem',
  '@media': {
    '(max-width: 768px)': {
      flexDirection: 'column',
    },
  },
});

export const submitButton = style({
  background: 'linear-gradient(45deg, #4f9fff, #ff4f9f)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  padding: '0.75rem 2rem',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(79, 159, 255, 0.4)',
  },
  ':disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none',
  },
});

export const cancelButton = style({
  background: 'transparent',
  color: 'var(--muted-foreground)',
  border: '1px solid var(--card-border)',
  borderRadius: '8px',
  padding: '0.75rem 2rem',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  ':hover': {
    background: 'var(--gray-alpha-100)',
    borderColor: 'var(--foreground)',
  },
});
