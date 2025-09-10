'use client';

import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import { usePathname, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import HotJar from '@/components/HotJar';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Não mostrar sidebar e navbar na página de login
  const isLoginPage = pathname === '/login';

  // Redirecionar para login se não estiver autenticado e não estiver na página de login
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, isLoginPage, router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMinimize = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  // Se for página de login, renderizar apenas o conteúdo
  if (isLoginPage) {
    return (
      <html lang="pt-BR" className="h-full">
        <body className={`${inter.className} h-full`}>
          {children}
        </body>
      </html>
    );
  }

  // Se ainda estiver carregando, mostrar loading
  if (isLoading) {
    return (
      <html lang="pt-BR" className="h-full">
        <body className={`${inter.className} h-full`}>
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                Verificando autenticação...
              </p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  // Se não estiver autenticado, mostrar loading enquanto redireciona
  if (!isAuthenticated) {
    return (
      <html lang="pt-BR" className="h-full">
        <body className={`${inter.className} h-full`}>
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                Redirecionando para login...
              </p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="pt-BR" className="h-full">
      <body className={`${inter.className} h-full`}>
        <HotJar hotjarId={process.env.NEXT_PUBLIC_HOTJAR_ID || ''} />
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <LayoutContent>
        {children}
      </LayoutContent>
    </AuthProvider>
  );
}
