import { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { Sidebar } from './SideBar';

// ==========================================
// MAIN LAYOUT PROPS
// ==========================================

interface MainLayoutProps {
  children: ReactNode;
}

// ==========================================
// MAIN LAYOUT COMPONENT
// ==========================================

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-light-bg dark:bg-dark-bg">
      {/* Top Bar */}
      <TopBar />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
