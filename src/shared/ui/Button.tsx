import { ReactNode } from 'react';
import { style } from '@vanilla-extract/css';

const buttonBase = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: 600,
  textDecoration: 'none',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  ':disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none',
  },
});

const buttonPrimary = style({
  background: 'linear-gradient(45deg, #4f9fff, #ff4f9f)',
  color: 'white',
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(79, 159, 255, 0.4)',
  },
  selectors: {
    '&:disabled:hover': {
      transform: 'none',
      boxShadow: 'none',
    },
  },
});

const buttonSecondary = style({
  background: 'transparent',
  color: 'var(--muted-foreground)',
  border: '1px solid var(--card-border)',
  ':hover': {
    backgroundColor: 'var(--gray-alpha-100)',
    borderColor: 'var(--foreground)',
  },
});

const buttonDanger = style({
  background: '#dc3545',
  color: 'white',
  ':hover': {
    backgroundColor: '#c82333',
    transform: 'translateY(-1px)',
  },
});

const buttonSize = {
  small: style({ padding: '0.5rem 1rem', fontSize: '0.875rem' }),
  medium: style({ padding: '0.75rem 1.5rem', fontSize: '1rem' }),
  large: style({ padding: '1rem 2rem', fontSize: '1.125rem' }),
};

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  type = 'button',
  className,
}: ButtonProps) {
  const variantClass = {
    primary: buttonPrimary,
    secondary: buttonSecondary,
    danger: buttonDanger,
  }[variant];

  const sizeClass = buttonSize[size];

  return (
    <button
      type={type}
      className={`${buttonBase} ${variantClass} ${sizeClass} ${className || ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
