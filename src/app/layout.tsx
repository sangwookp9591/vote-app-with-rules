// 서버 런타임에서 uncaughtException, unhandledRejection을 잡아 로그로 남김 (실무적 장애 추적)
if (typeof process !== 'undefined' && process?.on) {
  process.on('uncaughtException', (err) => {
    console.error('uncaughtException(치명적 에러):', err, err.stack);
  });
  process.on('unhandledRejection', (reason) => {
    console.error('unhandledRejection(비동기 에러):', reason);
  });
}

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AppShell from './AppShell';
import { Nanum_Gothic } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const nanumGothic = Nanum_Gothic({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata = {
  title: 'LoL SWL',
  description: 'PSW 리그오브레전드 상욱 리그 투표 시스템',
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
};

const themeInitScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme-mode');
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    if(theme === 'dark') document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${nanumGothic.className}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
