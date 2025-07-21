import { style } from '@vanilla-extract/css';

export const vodTitle = style({
  fontSize: '1.4rem',
  fontWeight: 700,
  margin: '32px 0 16px 0',
});

export const vodGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: 24,
});

export const vodCard = style({
  display: 'block',
  background: '#fff',
  borderRadius: 12,
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  overflow: 'hidden',
  textDecoration: 'none',
  color: '#222',
  transition: 'box-shadow 0.2s',
  ':hover': {
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
  },
});

export const thumbnailWrapper = style({
  position: 'relative',
  width: '100%',
  aspectRatio: '16/9',
  background: '#eee',
  overflow: 'hidden',
});

export const thumbnail = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
});

export const duration = style({
  position: 'absolute',
  right: 8,
  bottom: 8,
  background: 'rgba(0,0,0,0.7)',
  color: '#fff',
  fontSize: '0.9rem',
  padding: '2px 8px',
  borderRadius: 6,
});

export const replayLabel = style({
  position: 'absolute',
  left: 8,
  top: 8,
  background: '#4a90e2',
  color: '#fff',
  fontSize: '0.85rem',
  padding: '2px 8px',
  borderRadius: 6,
  fontWeight: 600,
});

export const vodInfo = style({
  padding: '12px 16px',
});

export const vodTitleText = style({
  fontSize: '1.05rem',
  fontWeight: 600,
  marginBottom: 6,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const vodMeta = style({
  fontSize: '0.95rem',
  color: '#888',
  display: 'flex',
  gap: 12,
});
