import React from 'react';
import { NavLink } from 'react-router-dom';

const MobileNav = () => {
  const navItems = [
    { to: '/dashboard', icon: 'dashboard', label: 'Início' },
    { to: '/inventory', icon: 'medical_services', label: 'Estoque' },
    { to: '/agenda', icon: 'event_note', label: 'Agenda' },
    { to: '/history', icon: 'history', label: 'Histórico' },
    { to: '/settings', icon: 'settings', label: 'Ajustes' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest/90 backdrop-blur-md flex justify-around items-center h-16 px-4 z-50 shadow-[0_-8px_24px_rgba(0,0,0,0.05)] border-t border-outline-variant/10">
      {navItems.map((item, index) => {
        // Center button
        if (index === 2) {
          return (
            <React.Fragment key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 ${
                    isActive ? 'text-primary' : 'text-on-surface-variant'
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
                    <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                  </>
                )}
              </NavLink>

              {/* Floating Action Button injected in the middle */}
              <button className="flex items-center justify-center -mt-8 w-14 h-14 editorial-gradient rounded-full text-on-primary shadow-lg shadow-primary/30 z-50 hover:scale-105 active:scale-95 transition-transform">
                <span className="material-symbols-outlined">add</span>
              </button>
            </React.Fragment>
          );
        }

        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 ${
                isActive ? 'text-primary' : 'text-on-surface-variant'
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
                <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default MobileNav;