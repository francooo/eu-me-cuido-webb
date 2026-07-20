import React from 'react';
import { NavLink } from 'react-router-dom';

const MobileNav = () => {
  const navItems = [
    { to: '/dashboard', icon: 'dashboard', label: 'Painel' },
    { to: '/inventory', icon: 'medical_services', label: 'Estoque' },
    // Center FAB will be handled specially
    { to: '/agenda', icon: 'event_note', label: 'Agenda' },
    { to: '/history', icon: 'history', label: 'Relatórios' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-2xl flex justify-around items-center min-h-[var(--bottom-nav-h)] pb-safe z-30 shadow-[0_-12px_32px_rgba(0,0,0,0.1)] border-t border-outline-variant/10 px-2 lg:px-8">
      {navItems.map((item, index) => {
        // Center space for FAB
        const isMiddle = index === 2;

        return (
          <React.Fragment key={item.to}>
            {isMiddle && (
              <div className="relative -top-3 w-14 h-14 shrink-0 pointer-events-none">
                <NavLink
                  to="/inventory?new=true"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full shadow-xl shadow-primary/30 flex items-center justify-center pointer-events-auto hover:shadow-2xl active:scale-90 transition-all border-4 border-surface"
                >
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
                </NavLink>
              </div>
            )}
            
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1.5 flex-1 transition-all h-full ${
                  isActive ? 'text-primary' : 'text-on-surface-variant/60'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-primary/10' : ''}`}>
                    <span
                      className="material-symbols-outlined text-2xl"
                      style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {item.icon}
                    </span>
                  </div>
                  <span className={`text-[11px] uppercase font-black tracking-wide leading-none ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default MobileNav;