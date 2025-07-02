import { style } from '@vanilla-extract/css';

export const createPageWrapper = style({
  maxWidth: 800,
  margin: '0 auto',
  padding: '32px 16px',
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

// Apple Style DateTime Picker
export const dateTimePicker = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
});

export const dateTimePickerInput = style({
  flex: 1,
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

export const dateTimePickerButton = style({
  padding: '0.75rem',
  border: '1px solid var(--card-border)',
  borderRadius: '8px',
  background: 'var(--background)',
  color: 'var(--foreground)',
  cursor: 'pointer',
  fontSize: '1.2rem',
  transition: 'all 0.2s ease',
  ':hover': {
    background: 'var(--gray-alpha-100)',
    borderColor: '#4f9fff',
  },
});

export const dateTimePickerOverlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(4px)',
});

export const dateTimePickerModal = style({
  background: 'var(--card-bg)',
  borderRadius: '16px',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  maxWidth: '90vw',
  maxHeight: '90vh',
  overflow: 'hidden',
  animation: 'slideIn 0.3s ease-out',
  '@media': {
    '(max-width: 768px)': {
      width: '95vw',
      maxHeight: '80vh',
    },
  },
});

export const dateTimePickerContent = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

export const dateTimePickerHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1.5rem',
  borderBottom: '1px solid var(--card-border)',
});

export const dateTimePickerTitle = style({
  fontSize: '1.25rem',
  fontWeight: 600,
  color: 'var(--foreground)',
  margin: 0,
});

export const dateTimePickerClose = style({
  background: 'none',
  border: 'none',
  fontSize: '1.5rem',
  color: 'var(--muted-foreground)',
  cursor: 'pointer',
  padding: '0.5rem',
  borderRadius: '50%',
  transition: 'all 0.2s ease',
  ':hover': {
    background: 'var(--gray-alpha-100)',
    color: 'var(--foreground)',
  },
});

export const dateTimePickerBody = style({
  flex: 1,
  padding: '1.5rem',
  overflow: 'auto',
});

export const dateTimePickerSection = style({
  marginBottom: '2rem',
  ':last-child': {
    marginBottom: 0,
  },
});

export const dateTimePickerSectionTitle = style({
  fontSize: '1rem',
  fontWeight: 600,
  color: 'var(--foreground)',
  marginBottom: '1rem',
  textAlign: 'center',
});

export const dateTimePickerRow = style({
  display: 'flex',
  gap: '1rem',
  justifyContent: 'center',
  alignItems: 'flex-start',
  '@media': {
    '(max-width: 768px)': {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
});

export const dateTimePickerColumn = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: '80px',
  flex: 1,
});

export const dateTimePickerOption = style({
  padding: '0.75rem 0.5rem',
  textAlign: 'center',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontSize: '0.875rem',
  color: 'var(--foreground)',
  position: 'relative',
  ':hover': {
    background: 'var(--gray-alpha-100)',
  },
});

export const dateTimePickerOptionSelected = style({
  background: 'linear-gradient(45deg, #4f9fff, #ff4f9f)',
  color: 'white',
  fontWeight: 600,
  ':hover': {
    background: 'linear-gradient(45deg, #4f9fff, #ff4f9f)',
  },
});

export const dateTimePickerFooter = style({
  display: 'flex',
  gap: '1rem',
  padding: '1.5rem',
  borderTop: '1px solid var(--card-border)',
  justifyContent: 'flex-end',
  '@media': {
    '(max-width: 768px)': {
      flexDirection: 'column',
    },
  },
});

export const dateTimePickerConfirm = style({
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
});

export const dateTimePickerCancel = style({
  background: 'transparent',
  color: 'var(--muted-foreground)',
  border: '1px solid var(--card-border)',
  borderRadius: '8px',
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  ':hover': {
    background: 'var(--gray-alpha-100)',
    borderColor: 'var(--foreground)',
  },
});

// Game Type Selector
export const gameTypeSelector = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1rem',
  '@media': {
    '(max-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '(max-width: 480px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const gameTypeOption = style({
  background: 'var(--card-bg)',
  border: '2px solid var(--card-border)',
  borderRadius: '12px',
  padding: '1.5rem',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.7rem',
  ':hover': {
    transform: 'translateY(-4px) scale(1.04)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.18)',
    borderColor: '#4f9fff',
  },
  selectors: {
    '&.selected': {
      borderColor: '#4f9fff',
      background: 'linear-gradient(135deg, rgba(79, 159, 255, 0.13), rgba(255, 79, 159, 0.13))',
      boxShadow: '0 8px 25px rgba(79, 159, 255, 0.22)',
      transform: 'translateY(-2px)',
    },
  },
});

export const gameTypeIcon = style({
  width: 72,
  height: 72,
  minWidth: 72,
  minHeight: 72,
  maxWidth: 72,
  maxHeight: 72,
  borderRadius: 18,
  background: 'linear-gradient(135deg, #f8fbff 60%, #e3f0ff 100%)',
  boxShadow: '0 4px 16px rgba(79,159,255,0.10)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1.1rem',
  marginTop: '0.2rem',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '2px solid #e3f0ff',
  selectors: {
    '&:hover': {
      boxShadow: '0 8px 32px rgba(79,159,255,0.18)',
      borderColor: '#4f9fff',
    },
    '&.lol-animation': {
      animation: 'lolPulse 2s ease-in-out infinite',
    },
    '&.cs2-animation': {
      animation: 'pubgShake 1.5s ease-in-out infinite',
    },
    '&.valorant-animation': {
      animation: 'overwatchGlow 2s ease-in-out infinite',
    },
    '&.overwatch-animation': {
      animation: 'valorantSpin 3s linear infinite',
    },
    '&.pubg-animation': {
      animation: 'cs2Explode 2.5s ease-in-out infinite',
    },
    '&.dota2-animation': {
      animation: 'dota2Sword 2s ease-in-out infinite',
    },
  },
});

export const gameTypeLabel = style({
  fontSize: '1.1rem',
  fontWeight: 700,
  color: 'var(--foreground)',
  marginBottom: '0.5rem',
});

export const gameTypeDescription = style({
  fontSize: '0.875rem',
  color: 'var(--muted-foreground)',
  lineHeight: 1.4,
});

export const teamSize = style({
  fontSize: '0.75rem',
  color: '#4f9fff',
  marginTop: '0.75rem',
  fontWeight: '600',
  textAlign: 'center',
  padding: '0.25rem 0.5rem',
  backgroundColor: 'rgba(79, 159, 255, 0.1)',
  borderRadius: '0.5rem',
  border: '1px solid rgba(79, 159, 255, 0.2)',
  display: 'inline-block',
});
