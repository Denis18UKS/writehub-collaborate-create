
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlignJustify, Home, FileText, User, MessageSquare, Bell, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  const navItems = [
    { icon: <Home size={20} />, label: 'Главная', path: '/dashboard' },
    { icon: <FileText size={20} />, label: 'Мои статьи', path: '/dashboard/articles' },
    { icon: <User size={20} />, label: 'Профиль', path: '/dashboard/profile' },
    { icon: <MessageSquare size={20} />, label: 'Идеи', path: '/dashboard/ideas' }
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-accent-cream/10 flex">
      {/* Sidebar for desktop */}
      <aside 
        className={`${
          isMobile
            ? `fixed inset-y-0 left-0 z-50 transform ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
              } transition-transform duration-300 ease-in-out`
            : 'sticky top-0 h-screen'
        } w-64 bg-white border-r border-gray-100 shadow-sm flex flex-col`}
      >
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-serif font-bold text-gradient">
              WriteHub
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                location.pathname === item.path
                  ? 'bg-accent-purple/10 text-accent-purple shadow-sm'
                  : 'text-gray-600 hover:bg-accent-cream/50 hover:text-accent-purple'
              }`}
            >
              {React.cloneElement(item.icon, {
                className: `mr-3 ${location.pathname === item.path ? 'text-accent-purple' : 'text-gray-400'}`
              })}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 m-4 border-t border-gray-100 rounded-lg bg-accent-cream/30">
          <Button variant="outline" className="w-full justify-start rounded-lg bg-white hover:bg-accent-cream hover:text-accent-purple transition-colors duration-300" asChild>
            <Link to="/logout">
              <LogOut className="mr-2 h-4 w-4" />
              Выйти
            </Link>
          </Button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-50 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="bg-white border-b border-gray-100 py-4 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            {isMobile && (
              <Button variant="ghost" size="sm" onClick={toggleSidebar} className="mr-4 hover:bg-accent-cream/50">
                <AlignJustify className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-lg font-medium text-gray-800">
              {navItems.find((item) => item.path === location.pathname)?.label || 'Панель управления'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="relative hover:bg-accent-cream/50 rounded-full w-9 h-9 p-0">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent-purple"></span>
            </Button>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-accent-purple to-accent-sage flex items-center justify-center shadow-sm">
              <span className="text-sm font-medium text-white">ИП</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-grow p-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
