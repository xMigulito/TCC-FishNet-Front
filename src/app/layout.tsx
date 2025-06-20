'use client';

import { useState } from 'react';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMinimize = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  return (
    <html lang="pt-BR" className="h-full">
      <body className={`${inter.className} h-full`}>
        <div className="flex h-full bg-page">
          <Sidebar 
            isOpen={isSidebarOpen} 
            isMinimized={isSidebarMinimized}
            onToggleMinimize={toggleMinimize}
          />
          <div className={`
            flex-1 flex flex-col min-w-0
            transition-all duration-300 ease-in-out
            ${isSidebarMinimized ? 'md:ml-20' : 'md:ml-64'}
          `}>
            <Navbar 
              toggleSidebar={toggleSidebar} 
              isSidebarOpen={isSidebarOpen}
              isSidebarMinimized={isSidebarMinimized}
            />
            <main className="flex-1 overflow-auto">
              <div className="h-full p-4 md:p-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
