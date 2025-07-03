import { style } from '@vanilla-extract/css';

export const wrapper = style({
  maxWidth: 800,
  margin: '0 auto',
  padding: '2rem',
});

export const title = style({
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: '2rem',
  color: 'var(--foreground)',
});

export const formGroup = style({
  marginBottom: '1.5rem',
});

export const label = style({
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: 600,
  color: 'var(--foreground)',
});

export const input = style({
  width: '100%',
  padding: '0.75rem',
  border: '1px solid var(--card-border)',
  borderRadius: '8px',
  fontSize: '1rem',
  backgroundColor: 'var(--card-bg)',
  color: 'var(--foreground)',
  transition: 'border-color 0.2s ease',
  ':focus': {
    outline: 'none',
    borderColor: '#4f9fff',
  },
});

export const textarea = style({
  width: '100%',
  padding: '0.75rem',
  border: '1px solid var(--card-border)',
  borderRadius: '8px',
  fontSize: '1rem',
  backgroundColor: 'var(--card-bg)',
  color: 'var(--foreground)',
  resize: 'vertical',
  minHeight: 80,
});

export const teamSizeInfo = style({
  padding: '0.75rem',
  backgroundColor: 'rgba(79, 159, 255, 0.1)',
  border: '1px solid rgba(79, 159, 255, 0.2)',
  borderRadius: '8px',
  marginBottom: '1rem',
  fontSize: '0.875rem',
  color: '#4f9fff',
  fontWeight: 600,
});

export const memberSelector = style({
  border: '1px solid var(--card-border)',
  borderRadius: '8px',
  padding: '1rem',
  backgroundColor: 'var(--card-bg)',
  minHeight: '200px',
});

export const memberList = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '0.5rem',
  marginBottom: '1rem',
});

export const memberItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem',
  border: '1px solid var(--card-border)',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  ':hover': {
    borderColor: '#4f9fff',
    backgroundColor: 'rgba(79, 159, 255, 0.05)',
  },
  selectors: {
    '&.selected': {
      borderColor: '#4f9fff',
      backgroundColor: 'rgba(79, 159, 255, 0.1)',
    },
  },
});

export const memberAvatar = style({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: 'var(--accent-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'white',
});

export const memberInfo = style({
  flex: 1,
});

export const memberName = style({
  fontWeight: 600,
  fontSize: '0.875rem',
});

export const memberEmail = style({
  fontSize: '0.75rem',
  color: 'var(--muted-foreground)',
});

export const selectedMembers = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  marginTop: '1rem',
});

export const selectedMemberTag = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  padding: '0.25rem 0.5rem',
  backgroundColor: 'rgba(79, 159, 255, 0.1)',
  border: '1px solid rgba(79, 159, 255, 0.2)',
  borderRadius: '4px',
  fontSize: '0.875rem',
});

export const removeButton = style({
  background: 'none',
  border: 'none',
  color: '#ff4f4f',
  cursor: 'pointer',
  fontSize: '1rem',
  padding: '0',
  width: '16px',
  height: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const buttonGroup = style({
  display: 'flex',
  gap: '1rem',
  marginTop: '2rem',
});

export const submitButton = style({
  background: 'linear-gradient(45deg, #4f9fff, #ff4f9f)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  ':hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(79, 159, 255, 0.3)',
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
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'inline-block',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  ':hover': {
    backgroundColor: 'var(--gray-alpha-100)',
    borderColor: 'var(--foreground)',
  },
});

export const error = style({
  color: '#ff4f4f',
  fontSize: '0.875rem',
  marginTop: '0.5rem',
});
