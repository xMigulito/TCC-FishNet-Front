'use client';

import { Menu } from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  return (
    <nav className="bg-[#042326] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-[#1D7373] hover:text-white hover:bg-[#1D7373] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1D7373]"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="ml-4 flex items-center">
              <span className="text-xl font-semibold text-white">FishNet</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 