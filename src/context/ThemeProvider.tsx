'use client';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

const Provider = ({ children }: { children: React.ReactNode }) => (
  <NextThemeProvider
    attribute="class"
    defaultTheme="system"
    value={{
      light: 'light',
      dark: 'dark',
    }}
  >
    {children}
  </NextThemeProvider>
);

export default Provider;
