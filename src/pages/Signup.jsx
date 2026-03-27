import React from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="w-full max-w-[480px]">
      <div className="flex flex-col items-center mb-10">
        <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-container rounded-full flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-on-primary text-3xl">clinical_notes</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-on-surface uppercase tracking-widest text-[10px] mb-2 opacity-60">
          Eu me cuido
        </h2>
        <h1 className="text-3xl font-bold text-on-surface tracking-tight text-center">
          Cadastre-se no Eu me cuido
        </h1>
        <p className="text-on-surface-variant text-sm mt-3 text-center max-w-[280px]">
          Comece sua jornada para uma experiência de saúde mais precisa e baseada em dados.
        </p>
      </div>

      <form className="space-y-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="full_name" className="block text-xs font-semibold text-on-surface-variant ml-1">Nome Completo</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-xl">person</span>
              <input
                type="text"
                id="full_name"
                name="full_name"
                placeholder="João Silva"
                className="w-full pl-12 pr-4 py-3.5 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-on-surface-variant/40 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-xs font-semibold text-on-surface-variant ml-1">E-mail</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-xl">mail</span>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="name@example.com"
                className="w-full pl-12 pr-4 py-3.5 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-on-surface-variant/40 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-xs font-semibold text-on-surface-variant ml-1">Senha</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-xl">lock</span>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-on-surface-variant/40 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm_password" className="block text-xs font-semibold text-on-surface-variant ml-1">Confirmar Senha</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-xl">verified_user</span>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-on-surface-variant/40 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 space-y-6">
          <button type="submit" className="w-full py-4 px-6 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-full font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2">
            Cadastrar
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>

          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-on-surface-variant">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4 ml-1">Entrar</Link>
            </p>
            <div className="flex items-center gap-2 text-[10px] text-on-surface-variant/60 uppercase tracking-widest font-medium">
              <span className="w-8 h-[1px] bg-outline-variant/30"></span>
              Verificação de Segurança Necessária
              <span className="w-8 h-[1px] bg-outline-variant/30"></span>
            </div>
          </div>
        </div>
      </form>

      <div className="mt-8 flex justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm">shield</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Conformidade HIPAA</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm">lock</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Criptografia AES-256</span>
        </div>
      </div>
    </div>
  );
};

export default Signup;