'use client';

import { Menu } from 'lucide-react';
import { useHotJar } from '@/hooks/useHotJar';

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  isSidebarMinimized: boolean;
  isMobile: boolean;
}

export default function Navbar({ toggleSidebar, isSidebarOpen, isSidebarMinimized, isMobile }: NavbarProps) {
  const { trackEvent } = useHotJar();
  return (
    <header className="relative z-10 navbar shadow-md">
      <div className={`
        flex justify-between items-center h-14 sm:h-16
        transition-all duration-300 ease-in-out
        ${isMobile 
          ? 'pl-0' // No mobile, sempre sem padding
          : isSidebarOpen && !isSidebarMinimized 
            ? 'pl-80 sm:pl-72 md:pl-64' 
            : isSidebarMinimized 
              ? 'pl-12 sm:pl-14 md:pl-16 lg:pl-20' 
              : 'pl-0'
        }
      `}>
        <div className="flex items-center pl-2 sm:pl-4">
          <button
            onClick={() => {
              trackEvent('Sidebar Toggle', {
                action: isSidebarOpen ? 'close' : 'open',
                isMinimized: isSidebarMinimized,
                timestamp: new Date().toISOString()
              });
              toggleSidebar();
            }}
            className="p-1.5 sm:p-2 rounded-md hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </button>
        </div>
      </div>
    </header>
  );
} 