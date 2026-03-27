import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import MobileNav from '../components/MobileNav';

const MainLayout = () => {
  const location = useLocation();

  // Simple logic to set TopNav title based on route
  const getTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Painel';
      case '/agenda': return 'Agenda e Lembretes';
      case '/inventory': return 'Estoque';
      case '/history': return 'Histórico';
      case '/settings': return 'Configurações do Sistema';
      default: return 'Eu me cuido';
    }
  };

  const getSubtitle = () => {
    if (location.pathname === '/dashboard') return 'Visualizando a Agenda';
    return null;
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col md:flex-row">
      <SideNav />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <TopNav title={getTitle()} subtitle={getSubtitle()} />
        <main className="flex-1 pt-24 pb-20 md:pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>

        {/* Global Footer */}
        <footer className="w-full py-8 mt-auto flex flex-col md:flex-row justify-between items-center px-8 border-t border-outline-variant/15 bg-surface-container-low text-xs text-on-surface-variant">
          <p>© 2024 Eu me cuido. Cuidados Médicos de Precisão.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-primary transition-colors">Termos de Serviço</a>
            <a href="#" className="hover:text-primary transition-colors">Suporte</a>
          </div>
        </footer>
      </div>
      <MobileNav />
    </div>
  );
};

export default MainLayout;