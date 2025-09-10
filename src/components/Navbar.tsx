'use client';

import { useHotJar } from '@/hooks/useHotJar';

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  isSidebarMinimized: boolean;
}

export default function Navbar({ toggleSidebar, isSidebarOpen, isSidebarMinimized }: NavbarProps) {
  const { trackEvent } = useHotJar();
  return (
    <header className="relative z-10 navbar shadow-md">
      <div className={`
        flex justify-between items-center h-16
        transition-all duration-300 ease-in-out
        ${isSidebarOpen && !isSidebarMinimized ? 'pl-64' : isSidebarMinimized ? 'pl-20' : 'pl-0'}
        md:pl-0
      `}>
        <div className="flex items-center pl-4">
        </div>
      </div>
    </header>
  );
} 