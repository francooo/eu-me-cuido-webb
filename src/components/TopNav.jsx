import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TopNav = ({ title = "Dashboard", subtitle }) => {
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
    <header className="fixed top-0 right-0 left-0 md:left-64 z-30 bg-surface/80 backdrop-blur-md">
      <div className="flex justify-between items-center h-16 px-8 w-full border-b border-outline-variant/10">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold tracking-tight text-on-surface">{title}</h2>
          {subtitle && (
            <>
              <span className="w-px h-6 bg-outline-variant/30"></span>
              <div className="flex items-center gap-2 px-3 py-1 bg-primary-fixed rounded-full hidden sm:flex">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <span className="text-xs font-bold text-on-primary-fixed-variant">{subtitle}</span>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Pesquisar..."
              className="bg-surface-container-highest border-none rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-1 focus:ring-primary/40"
            />
            <span className="material-symbols-outlined absolute left-3 top-2 text-on-surface-variant text-xl">search</span>
          </div>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
          </button>

          {/* User Avatar + Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="h-10 w-10 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center ring-2 ring-primary-fixed hover:ring-primary transition-all text-sm"
            >
              {initials}
            </button>
            {showMenu && (
              <div className="absolute right-0 top-12 w-56 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/15 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-outline-variant/15">
                  <p className="font-bold text-on-surface text-sm truncate">{user?.name}</p>
                  <p className="text-xs text-on-surface-variant truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left text-sm font-semibold text-error hover:bg-error-container/20 transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  Sair da conta
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;