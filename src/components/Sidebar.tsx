'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  FileText, 
  BarChart3, 
  Settings, 
  ChevronDown, 
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-6 h-6" />
    },
    {
      name: 'Tanques',
      path: '/tanques',
      icon: <Building2 className="w-6 h-6" />
    },
    {
      name: 'Relatórios',
      path: '/relatorios',
      icon: <FileText className="w-6 h-6" />
    },
    {
      name: 'Gráficos',
      path: '/graficos',
      icon: <BarChart3 className="w-6 h-6" />
    }
  ];

  const footerItems: MenuItem[] = [
    {
      name: 'Configurações',
      path: '/configuracoes',
      icon: <Settings className="w-6 h-6" />
    }
  ];

  const handleLogout = () => {
    router.push('/login');
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const MenuButton = ({ item }: { item: MenuItem }) => {
    const isActive = pathname === item.path;
    return (
      <button
        onClick={() => handleNavigation(item.path)}
        className={`
          group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg
          transition-all duration-150 ease-out
          ${isActive 
            ? 'bg-accent text-primary shadow-md' 
            : 'text-white hover:bg-accent hover:text-primary'
          }
        `}
      >
        <div className={`
          mr-3 transition-colors duration-150
          ${isActive ? 'text-primary' : 'text-white group-hover:text-primary'}
        `}>
          {item.icon}
        </div>
        <span className="font-medium">{item.name}</span>
      </button>
    );
  };

  const UserProfile = () => (
    <div className="relative">
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="flex items-center w-full p-3 rounded-lg hover:bg-black/10 transition-colors duration-150"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-white font-medium text-sm">
          U
        </div>
        <span className="ml-3 text-sm font-medium text-white">Usuário</span>
        <ChevronDown 
          className={`ml-auto w-4 h-4 text-white transition-transform duration-150 ${isProfileOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isProfileOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-full rounded-lg bg-white shadow-lg border border-gray-200 overflow-hidden">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm text-primary hover:bg-secondary hover:text-white transition-colors duration-150"
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
      fixed inset-y-0 left-0 z-50 w-64 bg-primary shadow-xl
      transform transition-transform duration-150 ease-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="flex flex-col h-full">
        <header className="flex-shrink-0 px-6 py-6 border-b border-white/10">
          <h1 className="text-2xl font-bold text-white">FishNet</h1>
        </header>

        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <MenuButton key={item.path} item={item} />
          ))}
        </nav>

        <footer className="flex-shrink-0 border-t border-white/10">
          <div className="px-3 py-3 space-y-1">
            {footerItems.map((item) => (
              <MenuButton key={item.path} item={item} />
            ))}
          </div>
          
          <div className="px-3 py-3 border-t border-white/10">
            <UserProfile />
          </div>
        </footer>
      </div>
    </aside>
  );
} 