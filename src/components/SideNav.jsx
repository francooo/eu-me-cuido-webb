import React from 'react';
import { NavLink } from 'react-router-dom';

const SideNav = () => {
  const navItems = [
    { to: '/dashboard', icon: 'dashboard', label: 'Painel' },
    { to: '/inventory', icon: 'medical_services', label: 'Medicamentos' },
    { to: '/agenda', icon: 'event_note', label: 'Agenda' },
    { to: '/history', icon: 'history', label: 'Histórico' },
    { to: '/settings', icon: 'settings', label: 'Configurações' },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 overflow-y-auto bg-surface-container-low flex flex-col py-8 gap-6 z-40 border-r border-outline-variant/10 hidden md:flex">
      <div className="px-6">
        <h1 className="text-lg font-extrabold text-on-surface tracking-tight">Eu me cuido</h1>
        <p className="text-xs text-on-surface-variant font-medium">Premium Health Concierge</p>
      </div>

      {/* Family Profile Switcher (simplified for layout) */}
      <div className="px-6 space-y-3">
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Family Members</p>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button className="relative group">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary ring-offset-2 ring-offset-surface-container-low transition-all bg-surface-container-high flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-sm">person</span>
            </div>
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-secondary rounded-full border-2 border-surface-container-low"></span>
          </button>

          <button className="w-10 h-10 rounded-full bg-surface-container-high border border-dashed border-outline flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined text-sm">add</span>
          </button>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-transform duration-200 hover:translate-x-1 ${
                isActive
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-lowest/50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 mt-auto">
        <button className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 px-6 rounded-full font-semibold flex items-center justify-center gap-2 shadow-lg hover:opacity-90 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-xl">add</span>
          <span className="text-sm">Adicionar Novo</span>
        </button>
      </div>
    </aside>
  );
};

export default SideNav;