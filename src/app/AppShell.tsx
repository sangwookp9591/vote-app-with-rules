'use client';

import { useState } from 'react';
import Sidebar from '../widgets/Sidebar/Sidebar';
import Navbar from '../widgets/Navbar/Navbar';
import Provider from '../context/ThemeProvider';
import ThemeColorUpdater from '../shared/ui/ThemeColorUpdater';
import AuthProvider from '@/context/AuthProvider';
import TanstackProvider from '@/context/TanstackProvider';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <TanstackProvider>
        <AuthProvider>
          <Sidebar open={sidebarOpen} />
          <div className={`main-content ${!sidebarOpen ? 'collapsed' : ''}`}>
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
