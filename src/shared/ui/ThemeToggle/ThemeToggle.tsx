'use client';
import { useEffect, useState } from 'react';

const THEME_KEY = 'theme-mode';

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY);
    const initial = saved || getSystemTheme();
    setTheme(initial);
    document.body.classList.toggle('dark', initial === 'dark');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
    document.body.classList.toggle('dark', next === 'dark');
  };

  return (
    <button
      aria-label="테마 전환"
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.5)',
        border: 'none',
        borderRadius: '50%',
        width: 44,
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: '#FFD700',
        fontSize: 24,
      }}
    >
      {theme === 'dark' ? (
        <span role="img" aria-label="라이트 모드">
          🌞
        </span>
      ) : (
        <span role="img" aria-label="다크 모드">
          🌙
        </span>
      )}
    </button>
  );
}
