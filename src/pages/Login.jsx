import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'E-mail ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px]">
      {/* Desktop Brand Header */}
      <div className="hidden md:flex flex-col items-start mb-12">
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/30 rotate-3">
          <span className="material-symbols-outlined text-white text-3xl -rotate-3">clinical_notes</span>
        </div>
        <div>
          <h1 className="font-headline text-2xl font-extrabold tracking-tight text-on-surface uppercase mb-0.5">Eu me cuido</h1>
          <div className="h-1 w-12 bg-primary rounded-full"></div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8 text-left">
        <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">Bem-vindo de volta</h2>
        <p className="text-on-surface-variant/80 text-sm font-medium">Seu cuidado começa aqui.</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl text-sm font-medium flex items-center gap-3">
          <span className="material-symbols-outlined text-lg flex-shrink-0">error</span>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="font-headline text-[11px] font-bold uppercase tracking-[0.15em] text-on-surface-variant ml-1">E-MAIL</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors text-lg">mail</span>
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
              className="w-full bg-white/60 border border-outline-variant/50 rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-outline/60 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="font-headline text-[11px] font-bold uppercase tracking-[0.15em] text-on-surface-variant ml-1">SENHA</label>
            <a href="#" className="text-[11px] font-bold uppercase tracking-wider text-primary hover:underline transition-all">ESQUECEU?</a>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors text-lg">lock</span>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full bg-white/60 border border-outline-variant/50 rounded-xl py-4 pl-12 pr-12 text-on-surface placeholder:text-outline/60 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full editorial-gradient text-white font-headline font-bold py-4 rounded-xl shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
              Entrando...
            </>
          ) : (
            <>
              Entrar no Portal
              <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-outline-variant/30"></div>
          <span className="flex-shrink mx-4 text-xs font-bold text-outline-variant uppercase tracking-widest">OU</span>
          <div className="flex-grow border-t border-outline-variant/30"></div>
        </div>

        {/* Google Login Button */}
        <button type="button" className="w-full bg-white border border-outline-variant/50 text-on-surface font-headline font-bold py-4 rounded-xl shadow-sm hover:bg-surface-container-lowest hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group">
          <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          Entrar com Google
        </button>
      </form>

      {/* Footer Link */}
      <div className="mt-10 text-center md:text-left">
        <p className="text-on-surface-variant text-sm font-medium">
          Novo no Eu me cuido?{' '}
          <Link to="/signup" className="text-primary font-bold hover:underline transition-all">Criar Conta</Link>
        </p>
      </div>

      {/* Support/Legal Links */}
      <div className="mt-12 flex flex-wrap justify-center md:justify-start gap-6 border-t border-outline-variant/30 pt-8">
        <a href="#" className="text-xs font-bold uppercase tracking-widest text-on-surface/50 hover:text-on-surface transition-colors">PRIVACIDADE</a>
        <a href="#" className="text-xs font-bold uppercase tracking-widest text-on-surface/50 hover:text-on-surface transition-colors">TERMOS</a>
        <a href="#" className="text-xs font-bold uppercase tracking-widest text-on-surface/50 hover:text-on-surface transition-colors">SUPORTE</a>
      </div>
    </div>
  );
};

export default Login;