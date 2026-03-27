import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi, doseLogsApi, schedulesApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const iconMap = { pill: 'pill', vaccines: 'vaccines', medication: 'medication' };

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardApi.get()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleTakeDose = async (med) => {
    try {
      await doseLogsApi.create({
        medication_id: med.id,
        status: 'taken',
        scheduled_at: new Date().toISOString(),
      });
      const updated = await dashboardApi.get();
      setData(updated);
    } catch (err) {
      alert('Erro ao registrar dose: ' + err.message);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-on-surface-variant text-sm">Carregando dashboard...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <span className="material-symbols-outlined text-error text-5xl">error</span>
      <p className="text-on-surface font-bold">Erro ao carregar dados</p>
      <p className="text-on-surface-variant text-sm">{error}</p>
    </div>
  );

  const today = data?.today || { taken: 0, missed: 0, total: 0, progress: 0 };
  const circumference = 553;
  const offset = circumference - (circumference * today.progress) / 100;

  return (
    <>
      {/* Hero Section */}
      <section className="mb-10">
        <h3 className="text-5xl font-extrabold text-on-surface tracking-tighter mb-2">
          {today.progress >= 80 ? 'Tudo em ordem' : 'Continue em frente'}, {user?.name?.split(' ')[0] || 'você'}.
        </h3>
        <p className="text-on-surface-variant text-lg max-w-2xl">
          {today.total > 0
            ? `Você já completou ${today.progress}% das suas doses hoje. ${today.missed > 0 ? `${today.missed} dose(s) perdida(s).` : 'Continue assim!'}`
            : 'Nenhuma dose agendada ainda para hoje.'}
        </p>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Daily Summary */}
        <div className="md:col-span-8 bg-surface-container-lowest p-8 rounded-xl shadow-[0_32px_64px_rgba(11,28,48,0.05)] flex flex-col md:flex-row gap-8 items-center border border-outline-variant/15">
          <div className="relative h-48 w-48 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-surface-container-high" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12"></circle>
              <circle className="text-primary" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor"
                strokeDasharray={circumference} strokeDashoffset={offset} strokeWidth="12"
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}>
              </circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-on-surface">{today.taken}/{today.total}</span>
              <span className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Doses</span>
            </div>
          </div>
          <div className="flex-1 space-y-6">
            <div>
              <h4 className="text-lg font-bold mb-1">Resumo Diário</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {today.total === 0
                  ? 'Adicione seus medicamentos no inventário para começar.'
                  : `Seu progresso hoje: ${today.progress}% de adesão. ${today.missed > 0 ? 'Fique atento às doses pendentes.' : 'Excelente desempenho!'}`}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary-container/30 p-4 rounded-xl">
                <span className="text-xs font-bold text-on-secondary-container/70 uppercase">Concluídas</span>
                <p className="text-2xl font-bold text-on-secondary-container">{String(today.taken).padStart(2, '0')}</p>
              </div>
              <div className="bg-error-container/30 p-4 rounded-xl">
                <span className="text-xs font-bold text-on-error-container/70 uppercase">Perdidas</span>
                <p className="text-2xl font-bold text-on-error-container">{String(today.missed).padStart(2, '0')}</p>
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
            {data?.next_doses?.length > 0 ? (
              <div className="space-y-6">
                {data.next_doses.map((dose, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary-fixed-dim ring-4 ring-primary/10"></div>
                      {i < data.next_doses.length - 1 && <div className="w-px h-12 bg-outline-variant/30 mt-2"></div>}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary uppercase">{dose.scheduled_time?.slice(0, 5)} — Hoje</p>
                      <p className="font-bold text-on-surface">{dose.name}</p>
                      <p className="text-xs text-on-surface-variant">{dose.dosage}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">Nenhuma dose pendente para hoje.</p>
            )}
            <Link to="/agenda" className="mt-4 inline-block text-primary text-sm font-bold hover:underline">Ver agenda completa</Link>
          </div>
        </div>

        {/* Active Prescriptions */}
        <div className="md:col-span-12 space-y-6 mt-4">
          <div className="flex justify-between items-end">
            <h4 className="text-2xl font-extrabold tracking-tight">Prescrições Ativas</h4>
            <Link to="/inventory" className="text-sm font-semibold text-primary hover:opacity-80 transition-opacity">Gerenciar Todos</Link>
          </div>

          {data?.prescriptions?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.prescriptions.slice(0, 6).map((med) => {
                const pct = med.stock_total > 0 ? Math.round((med.stock_quantity / med.stock_total) * 100) : 0;
                const isCritical = pct < 20;
                return (
                  <div key={med.id} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isCritical ? 'bg-error-container/20 text-error' : 'bg-surface-container-high text-primary'}`}>
                        <span className="material-symbols-outlined text-3xl">{iconMap[med.icon] || 'pill'}</span>
                      </div>
                      <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tight ${isCritical ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'}`}>
                        {isCritical ? 'Repor Estoque' : 'Em Dia'}
                      </span>
                    </div>
                    <h5 className="font-bold text-on-surface text-lg">{med.name}</h5>
                    <p className="text-sm text-on-surface-variant mb-4">{med.dosage} • {med.frequency}</p>
                    <div className={`flex items-center gap-2 text-xs font-medium ${isCritical ? 'text-on-error-container font-bold' : 'text-on-surface-variant'}`}>
                      <span className="material-symbols-outlined text-sm">{isCritical ? 'warning' : 'inventory_2'}</span>
                      {med.stock_quantity} de {med.stock_total} restantes
                    </div>
                    <div className="mt-4 w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${isCritical ? 'bg-error' : 'bg-primary'}`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-surface-container-lowest rounded-xl border border-outline-variant/15">
              <span className="material-symbols-outlined text-5xl text-outline mb-4">medication</span>
              <h5 className="font-bold text-on-surface mb-2">Nenhum medicamento cadastrado</h5>
              <p className="text-on-surface-variant text-sm mb-6">Adicione seus medicamentos para começar o acompanhamento.</p>
              <Link to="/inventory" className="px-6 py-3 bg-primary text-on-primary rounded-full font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all">
                Adicionar Medicamento
              </Link>
            </div>
          )}
        </div>

        {/* Health Stats */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-surface-container p-6 rounded-xl flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-3xl">medication</span>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase">Medicamentos Ativos</p>
              <p className="text-xl font-bold">{data?.medications_total || 0}</p>
            </div>
          </div>
          <div className="bg-surface-container p-6 rounded-xl flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-3xl">check_circle</span>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase">Doses Hoje</p>
              <p className="text-xl font-bold">{today.taken} tomadas</p>
            </div>
          </div>
          <div className="bg-surface-container p-6 rounded-xl flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-3xl">warning</span>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase">Estoque Crítico</p>
              <p className="text-xl font-bold">{data?.critical_stock || 0} itens</p>
            </div>
          </div>
          <div className="bg-surface-container p-6 rounded-xl flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-3xl">trending_up</span>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase">Adesão de Hoje</p>
              <p className="text-xl font-bold">{today.progress}%</p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Dashboard;