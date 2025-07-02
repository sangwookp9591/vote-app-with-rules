import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import AppShell from './AppShell';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const nanumBarunGothic = localFont({
  src: '../../public/fonts/NanumBarunGothic.ttf',
  display: 'swap',
  weight: '400',
  variable: '--font-nanumbarun',
});

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
    <html lang="ko" suppressHydrationWarning className={nanumBarunGothic.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${nanumBarunGothic.className}`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
