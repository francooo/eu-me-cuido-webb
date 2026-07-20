import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TopNav = ({ title = "Dashboard", subtitle, toggleSidebar }) => {
  const { user, selectedMember, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const nameToUse = selectedMember?.name || user?.name || 'User';
  const initials = nameToUse.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const avatarToUse = selectedMember?.avatar_url || null;

  return (
    <header className="sticky top-0 w-full h-16 sm:h-20 glass-nav z-30 flex items-center justify-between px-4 md:px-12 w-full border-b border-outline-variant/10">
      <div className="flex items-center gap-8 w-full max-w-[1600px] mx-auto">
        <div className="flex items-center gap-4 md:gap-8 flex-1">
          {/* Mobile: Hamburger */}
          <button
            onClick={toggleSidebar}
            className="md:hidden w-11 h-11 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-all"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>

          <div className="relative hidden lg:block w-72">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline material-symbols-outlined text-xl">search</span>
            <input 
              className="w-full bg-surface-container-low border-none rounded-2xl py-3 pl-12 pr-4 text-xs font-medium focus:ring-4 focus:ring-primary/10 placeholder:text-outline-variant transition-all outline-none" 
              placeholder="Buscar informações..." 
              type="text"
            />
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/dashboard" className="text-xs font-black text-primary border-b-2 border-primary pb-1 tracking-[0.1em] uppercase">Visão Geral</Link>
            <Link to="/reports" className="text-xs font-bold text-on-surface-variant hover:text-primary transition-all tracking-[0.1em] uppercase">Relatórios</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-1">
            <button className="tap-target inline-flex items-center justify-center p-2 sm:p-3 text-on-surface-variant hover:text-primary transition-all relative group">
              <span className="material-symbols-outlined text-2xl group-hover:scale-110">notifications</span>
              <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-error rounded-full ring-2 ring-surface"></span>
            </button>
            <button className="tap-target sm:inline-flex items-center justify-center p-2 sm:p-3 text-on-surface-variant hover:text-primary transition-all hidden group">
              <span className="material-symbols-outlined text-2xl group-hover:scale-110">chat_bubble</span>
            </button>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden border-2 border-white shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              {avatarToUse ? (
                <img src={avatarToUse} alt={nameToUse} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary flex items-center justify-center text-white font-black text-sm">{initials}</div>
              )}
            </button>
            
            {showMenu && (
              <>
                <div className="fixed inset-0 z-[55]" onClick={() => setShowMenu(false)}></div>
                <div className="absolute right-0 top-full mt-3 w-64 bg-surface-container-lowest rounded-[2rem] shadow-2xl border border-outline-variant/15 overflow-hidden z-[55] animate-in slide-in-from-top-2 duration-300">
                  <div className="px-7 py-6 bg-surface-container-low/50">
                    <p className="font-black text-on-surface text-sm tracking-tighter leading-none">{user?.name}</p>
                    <p className="text-xs uppercase font-bold text-primary/60 tracking-widest mt-2">{user?.email}</p>
                  </div>
                  <div className="p-3">
                    <button
                      onClick={() => { navigate('/settings'); setShowMenu(false); }}
                      className="w-full px-5 py-4 text-left text-xs font-bold text-on-surface hover:bg-surface-container-high rounded-2xl transition-all flex items-center gap-4 group"
                    >
                      <span className="material-symbols-outlined text-xl opacity-30 group-hover:opacity-100 transition-opacity">settings</span>
                      Meus Ajustes
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-5 py-4 text-left text-xs font-bold text-error hover:bg-error/5 rounded-2xl transition-all flex items-center gap-4 group"
                    >
                      <span className="material-symbols-outlined text-xl opacity-60">logout</span>
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