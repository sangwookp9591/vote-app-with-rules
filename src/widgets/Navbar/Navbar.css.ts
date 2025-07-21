import { style } from '@vanilla-extract/css';

export const dropdownWrapper = style({
  position: 'relative',
  display: 'inline-block',
});

export const dropdownButton = style({
  background: 'none',
  border: 'none',
  fontSize: '1rem',
  cursor: 'pointer',
  padding: '8px 16px',
  borderRadius: 8,
  fontWeight: 600,
  ':hover': { background: '#f0f4ff' },
});

export const dropdownMenu = style({
  position: 'absolute',
  top: '100%',
  right: 0,
  minWidth: 160,
  background: '#fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  borderRadius: 8,
  marginTop: 4,
  zIndex: 100,
  padding: '8px 0',
});

export const dropdownItem = style({
  display: 'block',
  padding: '10px 20px',
  color: '#222',
  textDecoration: 'none',
  fontWeight: 500,
  ':hover': { background: '#f0f4ff' },
});
