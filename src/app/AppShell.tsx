'use client';

import { useState } from 'react';
import Sidebar from '../widgets/Sidebar/Sidebar';
import Navbar from '../widgets/Navbar/Navbar';
import Provider from '../context/ThemeProvider';
import ThemeColorUpdater from '../shared/ui/ThemeColorUpdater';
import AuthProvider from '@/context/AuthProvider';
import TanstackProvider from '@/context/TanstackProvider';
import { usePathname } from 'next/navigation';
function shouldHideSidebar(pathname: string) {
  const hidePatterns = [
    /^\/user\//,
    /^\/login$/,
    /^\/signup$/,
    // 추가 패턴
  ];
  return hidePatterns.some((pattern) => pattern.test(pathname));
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const hideSidebar = shouldHideSidebar(pathname || '');
  return (
    <>
      <TanstackProvider>
        <AuthProvider>
          {!hideSidebar && <Sidebar open={sidebarOpen} />}
          <div className={`${!hideSidebar && 'main-content'} ${!sidebarOpen ? 'collapsed' : ''}`}>
            <Navbar onSidebarToggle={() => setSidebarOpen((v) => !v)} sidebarOpen={sidebarOpen} />
            <Provider>
              <ThemeColorUpdater />
              <div className="page-container">{children}</div>
            </Provider>
          </div>
        </AuthProvider>
      </TanstackProvider>
    </>
  );
}
