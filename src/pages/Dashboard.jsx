import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="mb-10">
        <h3 className="text-5xl font-extrabold text-on-surface tracking-tighter mb-2">Tudo em ordem, Beatriz.</h3>
        <p className="text-on-surface-variant text-lg max-w-2xl">
          Você já completou 85% das suas doses hoje. Continue assim para manter seu plano de saúde em dia.
        </p>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Daily Summary: Taken vs Missed */}
        <div className="md:col-span-8 bg-surface-container-lowest p-8 rounded-xl shadow-[0_32px_64px_rgba(11,28,48,0.05)] flex flex-col md:flex-row gap-8 items-center border border-outline-variant/15">
          <div className="relative h-48 w-48 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-surface-container-high" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12"></circle>
              <circle className="text-primary" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeDasharray="553" strokeDashoffset="83" strokeWidth="12"></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-on-surface">6/7</span>
              <span className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Doses</span>
            </div>
          </div>
          <div className="flex-1 space-y-6">
            <div>
              <h4 className="text-lg font-bold mb-1">Resumo Diário</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">Seu progresso de hoje está acima da média semanal. Apenas uma dose pendente para a noite.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary-container/30 p-4 rounded-xl">
                <span className="text-xs font-bold text-on-secondary-container/70 uppercase">Concluídas</span>
                <p className="text-2xl font-bold text-on-secondary-container">06</p>
              </div>
              <div className="bg-error-container/30 p-4 rounded-xl">
                <span className="text-xs font-bold text-on-error-container/70 uppercase">Perdidas</span>
                <p className="text-2xl font-bold text-on-error-container">01</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Doses */}
        <div className="md:col-span-4 bg-primary-container/10 backdrop-blur-md p-8 rounded-xl border border-primary-fixed-dim/20 relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">schedule</span>
              Próximas Doses
            </h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-primary-fixed-dim ring-4 ring-primary/10"></div>
                  <div className="w-px h-12 bg-outline-variant/30 mt-2"></div>
                </div>
                <div>
                  <p className="text-xs font-bold text-primary uppercase">14:30 — Hoje</p>
                  <p className="font-bold text-on-surface">Atorvastatina 20mg</p>
                  <p className="text-xs text-on-surface-variant">Após o almoço</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-tertiary-fixed-dim"></div>
                  <div className="w-px h-12 bg-outline-variant/30 mt-2"></div>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase">19:00 — Hoje</p>
                  <p className="font-bold text-on-surface">Metformina 500mg</p>
                  <p className="text-xs text-on-surface-variant">Durante o jantar</p>
                </div>
              </div>
            </div>
            <Link to="/agenda" className="mt-4 inline-block text-primary text-sm font-bold hover:underline">Ver agenda completa</Link>
          </div>
        </div>

        {/* Active Prescriptions Overview */}
        <div className="md:col-span-12 space-y-6 mt-4">
          <div className="flex justify-between items-end">
            <h4 className="text-2xl font-extrabold tracking-tight">Prescrições Ativas</h4>
            <Link to="/inventory" className="text-sm font-semibold text-primary hover:opacity-80 transition-opacity">Gerenciar Todos</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Medicine Card 1 */}
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">pill</span>
                </div>
                <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full uppercase tracking-tight">Em Dia</span>
              </div>
              <h5 className="font-bold text-on-surface text-lg">Losartana Potássica</h5>
              <p className="text-sm text-on-surface-variant mb-4">50mg • 1x ao dia</p>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
                <span className="material-symbols-outlined text-sm">inventory_2</span>
                12 de 30 comprimidos restantes
              </div>
              <div className="mt-4 w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[40%] rounded-full"></div>
              </div>
            </div>

            {/* Medicine Card 2 */}
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">vaccines</span>
                </div>
                <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full uppercase tracking-tight">Em Dia</span>
              </div>
              <h5 className="font-bold text-on-surface text-lg">Vitamina D3</h5>
              <p className="text-sm text-on-surface-variant mb-4">2000 UI • 1x ao dia</p>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
                <span className="material-symbols-outlined text-sm">inventory_2</span>
                45 de 60 cápsulas restantes
              </div>
              <div className="mt-4 w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[75%] rounded-full"></div>
              </div>
            </div>

            {/* Medicine Card 3 (Refill Alert) */}
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-error-container/20 flex items-center justify-center text-error">
                  <span className="material-symbols-outlined text-3xl">medication</span>
                </div>
                <span className="px-3 py-1 bg-error-container text-on-error-container text-[10px] font-bold rounded-full uppercase tracking-tight">Repor Estoque</span>
              </div>
              <h5 className="font-bold text-on-surface text-lg">Amoxicilina</h5>
              <p className="text-sm text-on-surface-variant mb-4">500mg • 3x ao dia</p>
              <div className="flex items-center gap-2 text-xs text-on-error-container font-bold">
                <span className="material-symbols-outlined text-sm">warning</span>
                Apenas 2 dias restantes
              </div>
              <div className="mt-4 w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                <div className="bg-error h-full w-[15%] rounded-full"></div>
              </div>
            </div>

          </div>
        </div>

        {/* Insights / Health Stats section */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-surface-container p-6 rounded-xl flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-3xl">favorite</span>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase">Frequência Cardíaca</p>
              <p className="text-xl font-bold">72 bpm</p>
            </div>
          </div>
          <div className="bg-surface-container p-6 rounded-xl flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-3xl">water_drop</span>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase">Hidratação Diária</p>
              <p className="text-xl font-bold">1.8 / 2.5 L</p>
            </div>
          </div>
          <div className="bg-surface-container p-6 rounded-xl flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-3xl">sleep</span>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase">Qualidade do Sono</p>
              <p className="text-xl font-bold">7h 45m</p>
            </div>
          </div>
          <div className="bg-surface-container p-6 rounded-xl flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-3xl">fitness_center</span>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase">Atividade Física</p>
              <p className="text-xl font-bold">35 min</p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Dashboard;