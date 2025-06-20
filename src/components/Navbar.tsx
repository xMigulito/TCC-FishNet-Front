'use client';

import { Menu } from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  isSidebarMinimized: boolean;
}

export default function Navbar({ toggleSidebar, isSidebarOpen, isSidebarMinimized }: NavbarProps) {
  return (
    <header className="relative z-10 navbar shadow-md">
      <div className={`
        flex justify-between items-center h-16
        transition-all duration-300 ease-in-out
        ${isSidebarOpen && !isSidebarMinimized ? 'pl-64' : isSidebarMinimized ? 'pl-20' : 'pl-0'}
        md:pl-0
      `}>
        <div className="flex items-center pl-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md navbar-text hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
} 