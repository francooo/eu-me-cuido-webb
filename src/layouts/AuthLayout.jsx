import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col antialiased selection:bg-primary-fixed-dim">
      <main className="relative flex-grow flex flex-col md:flex-row overflow-hidden">
        {/* Background/Imagery Section */}
        <div className="relative w-full md:w-1/2 lg:w-3/5 min-h-[40vh] md:min-h-screen">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBD8gFca1J_LOF1IJhERZBXQ4wkfRnpMKg7IGX4PLF81mxNqbfxHYs0HpS4VzJR5QsB1AsEV9K4xQK3VscIYOKdgv_do5V9Q4goKyXt-DJ_tj0cPHGM1TlCTPtoOHuKhn6ZyL63rFNg4wstBboY9PjfknKQhMmy-O_IZDAORAfuQ2ubb15mnDHEfggefExq_eqL2D1NUywfv_5JaF6D-Lq5eNj9g550rxKQhpqr2ZNWUgEtvqW0810dYwSn-Z6Qqq2r6CLYenDw7gPo"
            alt="Heartwarming photograph of a mother tenderly embracing and caring for her young child"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/5"></div>

          {/* Floating Branding for Mobile Overlay */}
          <div className="absolute top-8 left-8 z-20 md:hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg rotate-3">
                <span className="material-symbols-outlined text-white text-xl -rotate-3">clinical_notes</span>
              </div>
              <h1 className="font-headline text-lg font-extrabold tracking-tight text-white drop-shadow-md uppercase">Eu me cuido</h1>
            </div>
          </div>
        </div>

        {/* Auth Content Area (Form injected via Outlet) */}
        <div className="relative z-10 w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-6 sm:p-12 md:p-16 glass-card shadow-2xl">
          <Outlet />
        </div>
      </main>

      {/* Decorative Background for desktop (only visible if the layout shifts) */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[0%] -right-[10%] w-[50%] h-[50%] bg-secondary-fixed/10 blur-[150px] rounded-full"></div>
      </div>
    </div>
  );
};

export default AuthLayout;