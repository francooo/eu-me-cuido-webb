import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import MobileNav from '../components/MobileNav';

const MainLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Simple logic to set TopNav title based on route
  const getTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Painel';
      case '/agenda': return 'Agenda';
      case '/inventory': return 'Estoque';
      case '/history': return 'Histórico';
      case '/settings': return 'Ajustes';
      default: return 'Eu me cuido';
    }
  };

  const getSubtitle = () => {
    if (location.pathname === '/dashboard') return 'Hoje';
    return null;
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col md:flex-row relative">
      <SideNav isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[35] md:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen w-full">
        <TopNav 
          title={getTitle()} 
          subtitle={getSubtitle()} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        <main className="flex-1 pt-24 pb-28 md:pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full transition-all duration-300">
          <Outlet />
        </main>

        {/* Global Footer - Hidden on mobile to save space */}
        <footer className="hidden md:flex w-full py-8 mt-auto justify-between items-center px-8 border-t border-outline-variant/15 bg-surface-container-low text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">
          <p>© 2024 Eu me cuido • Gestão de Saúde de Alta Fidelidade</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
            <a href="#" className="hover:text-primary transition-colors">Termos</a>
            <a href="#" className="hover:text-primary transition-colors">Suporte</a>
          </div>
        </footer>
      </div>
      
      <MobileNav />
    </div>
  );
};

export default MainLayout;