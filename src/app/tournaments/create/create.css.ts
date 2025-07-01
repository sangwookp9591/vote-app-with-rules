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
