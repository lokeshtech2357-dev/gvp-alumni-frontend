import { useState } from 'react';
import MainHeader from './MainHeader';
import UnifiedSidebar from './UnifiedSidebar';
import Footer from './Footer';

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 antialiased selection:bg-cyan-500 selection:text-white">
      {/* 1. Header at the top */}
      <MainHeader onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

      {/* 2. Main Body: Single Unified Sidebar on Left + Content & Footer on Right */}
      <div className="flex-1 flex flex-row relative min-w-0">
        <UnifiedSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Content Column with Footer naturally below */}
        <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
          <main className="flex-1 min-h-[70vh]">
            {children}
          </main>

          {/* 3. Footer remains intact below content without sidebar overlap */}
          <Footer />
        </div>
      </div>
    </div>
  );
}

