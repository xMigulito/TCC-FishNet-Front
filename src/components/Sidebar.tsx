'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { ChevronDown, LogOut, LayoutDashboard, Settings, FileText, BarChart3, Database, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useHotJar } from '@/hooks/useHotJar';

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  isOpen: boolean;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

export default function Sidebar({ isOpen, isMinimized, onToggleMinimize }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { logout, user } = useAuth();
  const { trackEvent } = useHotJar();

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-6 h-6" /> },
    { name: 'Tanques', path: '/tanques', icon: <Database className="w-6 h-6" /> },
    { name: 'Gráficos', path: '/graficos', icon: <BarChart3 className="w-6 h-6" /> },
    { name: 'Relatórios', path: '/relatorios', icon: <FileText className="w-6 h-6" /> },
  ];

  const footerItems: MenuItem[] = [
    { name: 'Configurações', path: '/configuracoes', icon: <Settings className="w-6 h-6" /> },
  ];

  const handleNavigation = useCallback((path: string, name: string) => {
    trackEvent('Sidebar Navigation', {
      destination: path,
      pageName: name,
      timestamp: new Date().toISOString()
    });
    router.push(path);
  }, [router, trackEvent]);

  const handleLogout = useCallback(() => {
    trackEvent('User Logout', {
      userId: user?.id,
      userEmail: user?.email,
      timestamp: new Date().toISOString()
    });
    logout();
    router.push('/login');
  }, [logout, router, trackEvent, user]);

  const MenuButton = ({ item }: { item: MenuItem }) => {
    const isActive = pathname === item.path;
    return (
      <button
        onClick={() => handleNavigation(item.path, item.name)}
        className={`
          group flex items-center w-full px-2 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg
          transition-all duration-150 ease-in-out
          ${isActive ? 'sidebar-item-active' : 'sidebar-text sidebar-item-hover'}
          ${isMinimized ? 'justify-center' : ''}
        `}
        title={isMinimized ? item.name : ''}
      >
        <div className={`
          ${!isMinimized && 'mr-2 sm:mr-3'} transition-colors duration-150
          ${isActive ? 'text-white' : 'sidebar-text'}
        `}>
          {item.icon}
        </div>
        {!isMinimized && <span className="font-medium whitespace-nowrap">{item.name}</span>}
      </button>
    );
  };

  const UserProfile = () => (
    <div className="relative">
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className={`
          flex items-center w-full p-3 rounded-lg sidebar-item-hover
          ${isMinimized ? 'justify-center' : ''}
        `}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-primary font-bold text-sm">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        {!isMinimized && (
          <>
            <span className="ml-3 text-sm font-medium sidebar-text">
              {user?.name || 'Usuário'}
            </span>
            <ChevronDown 
              className={`ml-auto w-4 h-4 sidebar-text transition-transform duration-150 ${isProfileOpen ? 'rotate-180' : ''}`}
            />
          </>
        )}
      </button>

      {isProfileOpen && (
        <div className={`
          absolute bottom-full mb-2 rounded-lg bg-primary shadow-lg border border-white/10 overflow-hidden
          ${isMinimized ? 'left-full ml-2' : 'left-0 w-full'}
        `}>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm sidebar-text hover:bg-secondary hover:text-primary transition-colors duration-150 whitespace-nowrap"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sair
          </button>
        </div>
      )}
    </div>
  );

  return (
    <aside className={`
      fixed top-0 left-0 z-20 h-full sidebar
      transform transition-all duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      ${isMinimized ? 'w-14 sm:w-16 md:w-20' : 'w-72 sm:w-64'}
      md:translate-x-0
    `}>
      <div className="flex flex-col h-full p-2 sm:p-4">
        <header className="flex-shrink-0 px-1 sm:px-2 py-3 sm:py-4 border-b border-white/10">
          <button
            onClick={onToggleMinimize}
            className="w-full flex items-center justify-center hover:bg-white/10 rounded-lg p-2 transition-colors"
          >
            {!isMinimized ? (
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">FishNet</h1>
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            )}
          </button>
        </header>

        <nav className="flex-1 mt-2 sm:mt-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <MenuButton key={item.path} item={item} />
          ))}
        </nav>

        <footer className="flex-shrink-0 border-t border-white/10 pt-4">
          <div className="space-y-1">
            {footerItems.map((item) => (
              <MenuButton key={item.path} item={item} />
            ))}
          </div>
          
          <div className="mt-4 border-t border-white/10 pt-4">
            <UserProfile />
          </div>
        </footer>
      </div>
    </aside>
  );
} 