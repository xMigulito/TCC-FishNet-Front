'use client';

import { useState, Suspense } from 'react';
import './globals.css';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import PageLoading from '@/components/PageLoading';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen">
          <Navbar toggleSidebar={toggleSidebar} />
          <Sidebar isOpen={isSidebarOpen} />
          <main className={`transition-all duration-200 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
            <Suspense fallback={<PageLoading />}>
              {children}
            </Suspense>
          </main>
        </div>
      </body>
    </html>
  );
}
