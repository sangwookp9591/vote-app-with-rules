import { style } from '@vanilla-extract/css';

export const applicationWrapper = style({
  maxWidth: '600px',
  margin: '0 auto',
  padding: '2rem',
});

export const pageTitle = style({
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: '2rem',
  textAlign: 'center',
  color: 'var(--foreground)',
});

export const applicationCard = style({
  background: 'var(--card-bg)',
  border: '1px solid var(--card-border)',
  borderRadius: '12px',
  padding: '2rem',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
});

export const applicationForm = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
});

export const formGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

export const formLabel = style({
  fontSize: '1rem',
  fontWeight: 600,
  color: 'var(--foreground)',
});

export const formTextarea = style({
  width: '100%',
  padding: '0.75rem',
  border: '1px solid var(--card-border)',
  borderRadius: '8px',
  fontSize: '1rem',
  backgroundColor: 'var(--background)',
  color: 'var(--foreground)',
  resize: 'vertical',
  minHeight: '120px',
  transition: 'border-color 0.2s ease',
  ':focus': {
    outline: 'none',
    borderColor: '#4f9fff',
    boxShadow: '0 0 0 3px rgba(79, 159, 255, 0.1)',
  },
});

export const submitButton = style({
  background: 'linear-gradient(45deg, #4f9fff, #ff4f9f)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  padding: '1rem 2rem',
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

export const statusCard = style({
  background: 'var(--card-bg)',
  border: '1px solid var(--card-border)',
  borderRadius: '12px',
  padding: '2rem',
  textAlign: 'center',
});

export const statusTitle = style({
  fontSize: '1.5rem',
  fontWeight: 600,
  marginBottom: '1rem',
  color: 'var(--foreground)',
});

export const statusBadge = style({
  display: 'inline-block',
  padding: '0.5rem 1rem',
  borderRadius: '20px',
  fontSize: '0.9rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  marginBottom: '1rem',
});

export const statusPending = style({
  backgroundColor: 'rgba(255, 193, 7, 0.2)',
  color: '#856404',
});

export const statusApproved = style({
  backgroundColor: 'rgba(40, 167, 69, 0.2)',
  color: '#155724',
});

export const statusRejected = style({
  backgroundColor: 'rgba(220, 53, 69, 0.2)',
  color: '#721c24',
});

export const statusMessage = style({
  fontSize: '1rem',
  color: 'var(--muted-foreground)',
  lineHeight: 1.5,
});

export const errorMessage = style({
  color: '#dc3545',
  fontSize: '0.9rem',
  marginTop: '0.5rem',
});

export const successMessage = style({
  color: '#28a745',
  fontSize: '0.9rem',
  marginTop: '0.5rem',
});
