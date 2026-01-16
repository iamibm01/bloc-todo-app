import { ReactNode, RefObject } from 'react';
import { TopBar } from './TopBar';
import { Sidebar } from './SideBar';

// ==========================================
// MAIN LAYOUT PROPS
// ==========================================

interface MainLayoutProps {
  children: ReactNode;
  searchInputRef?: RefObject<HTMLInputElement | null>;
  onShowShortcuts?: () => void;
}

// ==========================================
// MAIN LAYOUT COMPONENT
// ==========================================

export function MainLayout({ children, searchInputRef, onShowShortcuts }: MainLayoutProps) {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-light-bg dark:bg-dark-bg">
      {/* Top Bar */}
      <TopBar searchInputRef={searchInputRef} onShowShortcuts={onShowShortcuts} />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content - Single scrollable area */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}