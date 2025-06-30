'use client';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

const THEME_COLOR = {
  light: '#ffffff',
  dark: '#0a0a0a',
};

export default function ThemeColorUpdater() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const color = THEME_COLOR[resolvedTheme as 'light' | 'dark'] || THEME_COLOR.light;
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', color);
  }, [resolvedTheme]);

  return null;
}
