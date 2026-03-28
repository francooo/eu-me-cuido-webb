import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TopNav = ({ title = "Dashboard", subtitle, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 z-[32] bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10">
      <div className="flex justify-between items-center h-16 sm:h-20 px-4 md:px-8 w-full max-w-7xl mx-auto">
        
        {/* Mobile: Hamburger */}
        <div className="flex items-center md:hidden">
          <button 
            onClick={toggleSidebar}
            className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
        </div>

        {/* Desktop: Title */}
        <div className="hidden md:flex flex-col">
          <h2 className="text-xl font-extrabold tracking-tight text-on-surface">{title}</h2>
          {subtitle && (
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Mobile: Centered Logo (Problem 4.2) */}
        <div className="md:hidden absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <h1 className="text-sm font-black text-primary leading-none tracking-tight">Eu me cuido</h1>
          <span className="text-[7px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/40 leading-none mt-1 ml-0.5">Health Care</span>
        </div>

        {/* Logo central para mobile (Problem 4.2) */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 pointer-events-none opacity-20">
          <span className="material-symbols-outlined text-4xl">clinical_notes</span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative hidden lg:block group">
            <input
              type="text"
              placeholder="Pesquisa rápida..."
              className="bg-surface-container-low border-none rounded-2xl py-2.5 pl-11 pr-5 text-xs w-64 focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-high transition-all outline-none"
            />
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-base group-focus-within:text-primary transition-colors">search</span>
          </div>
          
          <button className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low hover:text-primary rounded-full transition-all relative group active:scale-95">
            <span className="material-symbols-outlined text-2xl group-hover:scale-110">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full ring-2 ring-surface border-surface box-content"></span>
          </button>

          {/* User Avatar + Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold flex items-center justify-center ring-4 ring-primary/10 hover:ring-primary/20 transition-all text-xs"
            >
              {initials}
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>
                <div className="absolute right-0 top-14 w-64 bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/15 overflow-hidden z-[41] animate-in slide-in-from-top-2 duration-200">
                  <div className="px-6 py-5 bg-surface-container-low/50">
                    <p className="font-bold text-on-surface text-sm truncate">{user?.name}</p>
                    <p className="text-[10px] uppercase font-bold text-primary/60 tracking-wider truncate mt-0.5">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => { navigate('/settings'); setShowMenu(false); }}
                      className="w-full px-4 py-3 text-left text-xs font-bold text-on-surface hover:bg-surface-container-high rounded-2xl transition-all flex items-center gap-3 group"
                    >
                      <span className="material-symbols-outlined text-lg opacity-40 group-hover:opacity-100 transition-opacity">settings</span>
                      Meus Ajustes
                    </button>
                    <div className="h-px bg-outline-variant/10 my-1 mx-4"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-xs font-bold text-error hover:bg-error-container/20 rounded-2xl transition-all flex items-center gap-3"
                    >
                      <span className="material-symbols-outlined text-lg">logout</span>
                      Encerrar Sessão
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;