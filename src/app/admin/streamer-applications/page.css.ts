import { style } from '@vanilla-extract/css';

// CSS 스타일
export const adminWrapper = style({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '2rem',
});

export const pageTitle = style({
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: '2rem',
  color: 'var(--foreground)',
});

export const applicationCard = style({
  background: 'var(--card-bg)',
  border: '1px solid var(--card-border)',
  borderRadius: '12px',
  padding: '1.5rem',
  marginBottom: '1rem',
  transition: 'all 0.2s ease',
  ':hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
});

export const userInfo = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginBottom: '1rem',
});

export const userAvatar = style({
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: 'var(--primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.2rem',
  fontWeight: 600,
  color: 'white',
  overflow: 'hidden',
});

export const userDetails = style({
  flex: 1,
});

export const userName = style({
  fontSize: '1.1rem',
  fontWeight: 600,
  color: 'var(--foreground)',
  marginBottom: '0.25rem',
});

export const userEmail = style({
  fontSize: '0.9rem',
  color: 'var(--muted-foreground)',
});

export const applicationMeta = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
});

export const statusBadge = style({
  padding: '0.25rem 0.75rem',
  borderRadius: '20px',
  fontSize: '0.8rem',
  fontWeight: 600,
  textTransform: 'uppercase',
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

export const applicationDate = style({
  fontSize: '0.9rem',
  color: 'var(--muted-foreground)',
});

export const actionButtons = style({
  display: 'flex',
  gap: '0.5rem',
});

export const approveButton = style({
  background: 'linear-gradient(45deg, #28a745, #20c997)',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  padding: '0.5rem 1rem',
  fontSize: '0.9rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  ':hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(40, 167, 69, 0.3)',
  },
  ':disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none',
  },
});

export const rejectButton = style({
  background: 'linear-gradient(45deg, #dc3545, #fd7e14)',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  padding: '0.5rem 1rem',
  fontSize: '0.9rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  ':hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(220, 53, 69, 0.3)',
  },
  ':disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none',
  },
});

export const loadingState = style({
  textAlign: 'center',
  padding: '4rem 2rem',
  color: 'var(--muted-foreground)',
});

export const emptyState = style({
  textAlign: 'center',
  padding: '4rem 2rem',
  color: 'var(--muted-foreground)',
});
