import { style } from '@vanilla-extract/css';

export const chatPanel = style({
  background: '#f9f9fb',
  borderRadius: 18,
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  padding: 20,
  maxWidth: 600,
  minWidth: 280,
  height: '60vh',
  display: 'flex',
  flexDirection: 'column',
  border: 'none',
});

export const messagesArea = style({
  flex: 1,
  overflowY: 'auto',
  marginBottom: 14,
  paddingRight: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
});

export const messageRow = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: 8,
  fontSize: 15,
  lineHeight: 1.7,
  minHeight: 28,
});

export const badge = style({
  width: 24,
  height: 24,
  borderRadius: '50%',
  background: '#e3e8f0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 15,
  marginRight: 4,
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
});

export const nickname = style({
  fontWeight: 700,
  marginRight: 4,
  color: '#2d8cff',
  fontSize: 15,
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

export const message = style({
  //   background: '#fff',
  borderRadius: 8,
  padding: '6px 12px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  wordBreak: 'break-all',
  fontSize: 15,
  color: '#222',
  maxWidth: 200,
});

export const systemMessage = style({
  color: '#b0b0b0',
  fontSize: 13,
  marginLeft: 8,
  fontStyle: 'italic',
});

export const inputRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginTop: 8,
});

export const input = style({
  flex: 1,
  border: '1.5px solid #e0e0e0',
  borderRadius: 12,
  padding: '10px 14px',
  fontSize: 15,
  outline: 'none',
  background: '#fff',
  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
});

export const sendButton = style({
  background: 'linear-gradient(90deg, #2d8cff 60%, #1769aa 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: 12,
  padding: '10px 18px',
  fontWeight: 700,
  fontSize: 15,
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(45,140,255,0.08)',
  transition: 'background 0.2s',
  ':hover': {
    background: 'linear-gradient(90deg, #1769aa 60%, #2d8cff 100%)',
  },
  ':disabled': {
    background: '#b0c4de',
    cursor: 'not-allowed',
  },
});
