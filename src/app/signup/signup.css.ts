import { style } from '@vanilla-extract/css';

export const formStyle = style({
  background: 'var(--card-bg)',
  border: '1px solid var(--card-border)',
  borderRadius: 12,
  padding: 32,
  minWidth: 320,
  boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
});

export const titleStyle = style({
  marginBottom: 24,
  textAlign: 'center',
});

export const labelStyle = style({
  display: 'block',
  marginBottom: 8,
});

export const inputStyle = style({
  width: '100%',
  marginTop: 4,
  marginBottom: 16,
  padding: 8,
  borderRadius: 6,
  border: '1px solid var(--input-border)',
  background: 'var(--input-bg)',
  color: 'var(--input-text)',
});

export const checkboxLabelStyle = style({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 16,
  selectors: {
    '& > input': {
      marginRight: 8,
    },
  },
});

export const errorStyle = style({
  color: 'red',
  marginBottom: 12,
});

export const successStyle = style({
  color: 'green',
  marginBottom: 12,
});

export const submitButtonStyle = style({
  width: '100%',
  padding: 12,
  borderRadius: 6,
  background: 'var(--primary, #4f9fff)',
  color: 'var(--button-text)',
  border: 'none',
  fontWeight: 600,
  fontSize: 16,
  cursor: 'pointer',
  marginTop: 8,
});

export const imageStyle = style({
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginBottom: 20,
  marginTop: 4,
  width: 64,
  height: 64,
});

export const profileImageInputStyle = style({
  display: 'block',
  marginBottom: 12,
  marginTop: 8,
  fontWeight: 500,
});

export const profileImagePreviewStyle = style({
  display: 'block',
  margin: '8px auto 16px auto',
  width: 80,
  height: 80,
  objectFit: 'cover',
  borderRadius: '50%',
  border: '2px solid var(--card-border)',
  background: '#f5f5f5',
});
