'use client';

import { useState } from 'react';
import Sidebar from '../widgets/Sidebar/Sidebar';
import Navbar from '../widgets/Navbar/Navbar';
import Provider from '../context/ThemeProvider';
import ThemeColorUpdater from '../shared/ui/ThemeColorUpdater';
import AuthProvider from '@/context/AuthProvider';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <AuthProvider>
        <Sidebar open={sidebarOpen} />
        <div style={{ marginLeft: sidebarOpen ? 240 : 0, transition: 'margin-left 0.2s' }}>
          <Navbar onSidebarToggle={() => setSidebarOpen((v) => !v)} sidebarOpen={sidebarOpen} />
          <Provider>
            <ThemeColorUpdater />
            {children}
          </Provider>
        </div>
      </AuthProvider>
    </>
  );
}
