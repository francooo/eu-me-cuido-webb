import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi, doseLogsApi, healthMetricsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const iconMap = { pill: 'pill', vaccines: 'vaccines', medication: 'medication' };

const Dashboard = () => {
  const { user, selectedMember } = useAuth();
  const [data, setData] = useState(null);
  const [metrics, setMetrics] = useState({ water: 0, steps: 0, sleep: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const params = selectedMember ? { family_member_id: selectedMember.id } : {};
      const todayDate = new Date().toISOString().split('T')[0];
      
      const [dashboardData, metricsData] = await Promise.all([
        dashboardApi.get(params),
        healthMetricsApi.list({ ...params, date: todayDate })
      ]);

      setData(dashboardData);
      
      // Map metrics from API
      const newMetrics = { water: 0, steps: 0, sleep: 0 };
      metricsData.forEach(m => {
        if (m.metric_type === 'water') newMetrics.water = parseFloat(m.value);
        if (m.metric_type === 'steps') newMetrics.steps = parseFloat(m.value);
        if (m.metric_type === 'sleep') newMetrics.sleep = parseFloat(m.value);
      });
      setMetrics(newMetrics);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadDashboard();
  }, [user, selectedMember]);

  const updateMetric = async (type, value) => {
    try {
      const todayDate = new Date().toISOString().split('T')[0];
      await healthMetricsApi.update({
        family_member_id: selectedMember?.id,
        metric_type: type,
        value: value,
        unit: type === 'water' ? 'ml' : type === 'steps' ? 'steps' : 'hours',
        date: todayDate
      });
      setMetrics(prev => ({ ...prev, [type]: value }));
    } catch (err) {
      console.error('Error updating metric:', err);
    }
  };

  const handleTakeDose = async (med) => {
    try {
      await doseLogsApi.create({
        medication_id: med.id,
        status: 'taken',
        scheduled_at: new Date().toISOString(),
      });
      loadDashboard();
    } catch (err) {
      alert('Erro ao registrar dose: ' + err.message);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-on-surface-variant font-bold text-sm uppercase tracking-widest animate-pulse">Sincronizando Dados...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 max-w-md mx-auto text-center">
      <div className="w-20 h-20 bg-error-container/20 rounded-full flex items-center justify-center text-error mb-4">
        <span className="material-symbols-outlined text-5xl">report</span>
      </div>
      <h3 className="text-2xl font-black text-on-surface tracking-tight">Falha na Sincronização</h3>
      <p className="text-on-surface-variant text-sm leading-relaxed">{error}</p>
      <button onClick={loadDashboard} className="mt-4 px-8 py-3 bg-surface-container-high hover:bg-surface-container-highest rounded-2xl font-bold transition-all active:scale-95">Tentar Novamente</button>
    </div>
  );

  const today = data?.today || { taken: 0, missed: 0, total: 0, progress: 0 };
  const memberName = selectedMember ? selectedMember.name.split(' ')[0] : (user?.name?.split(' ')[0] || 'você');

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 pb-20">
      {/* Premium Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-primary font-black text-xs uppercase tracking-[0.3em]">Painel de Controle</span>
            <div className="h-px w-12 bg-primary/20"></div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-on-surface tracking-tighter leading-none">
            Olá, <span className="text-primary">{memberName}</span>.
          </h1>
          <p className="text-on-surface-variant text-base md:text-lg max-w-2xl font-medium">
            {today.total > 0
              ? `Progresso de hoje: ${today.progress}% das metas diárias concluídas.`
              : 'Seu concierge de saúde está pronto. Comece configurando sua rotina.'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl px-6 py-3 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-full premium-gradient flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-xl">calendar_today</span>
            </div>
            <div>
              <p className="text-xs font-black text-outline uppercase tracking-widest">Hoje</p>
              <p className="text-sm font-bold text-on-surface">{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-auto gap-6 mt-8">
        
        {/* Medication Summary - Main Bento Piece */}
        <div className="md:col-span-8 bg-white/60 backdrop-blur-xl p-6 sm:p-8 rounded-[2.5rem] border border-outline-variant/15 shadow-2xl shadow-primary/5 flex flex-col md:flex-row gap-10 items-center overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"></div>
          
          <div className="relative h-56 w-56 flex-shrink-0 group">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-surface-container-high" cx="112" cy="112" fill="transparent" r="96" stroke="currentColor" strokeWidth="16"></circle>
              <circle className="text-primary" cx="112" cy="112" fill="transparent" r="96" stroke="currentColor"
                strokeDasharray="603" strokeDashoffset={603 - (603 * today.progress) / 100} strokeWidth="16"
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
              </circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center transition-transform group-hover:scale-110 duration-500">
              <span className="text-5xl font-black text-on-surface tracking-tighter">{today.progress}%</span>
              <span className="text-xs text-outline font-black uppercase tracking-[0.2em] mt-1">Concluído</span>
            </div>
          </div>

          <div className="flex-1 space-y-8 relative z-10">
            <div>
              <h4 className="text-2xl font-black text-on-surface tracking-tight mb-2">Visão Geral de Doses</h4>
              <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                {today.total === 0
                  ? 'Nenhum agendamento ativo. Adicione medicamentos ao seu inventário para começar o monitoramento inteligente.'
                  : today.progress === 100 
                    ? 'Parabéns! Todas as doses de hoje foram registradas com sucesso.'
                    : `Você completou ${today.taken} de ${today.total} doses. Mantenha o foco para garantir sua adesão terapêutica.`}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 hover:bg-primary/10 transition-colors">
                <span className="text-xs font-black text-primary uppercase tracking-widest block mb-2">Concluídas</span>
                <div className="flex items-end gap-1">
                  <p className="text-4xl font-black text-on-surface">{String(today.taken).padStart(2, '0')}</p>
                  <p className="text-sm font-bold text-outline mb-1.5">/ {today.total}</p>
                </div>
              </div>
              <div className="bg-error/5 p-6 rounded-3xl border border-error/10 hover:bg-error/10 transition-colors">
                <span className="text-xs font-black text-error uppercase tracking-widest block mb-2">Perdidas</span>
                <p className="text-4xl font-black text-on-surface">{String(today.missed).padStart(2, '0')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Timeline - Bento Piece 2 */}
        <div className="md:col-span-4 bg-surface-container-high/40 backdrop-blur-md p-6 sm:p-8 rounded-[2.5rem] border border-outline-variant/15 relative overflow-hidden flex flex-col">
          <div className="relative z-10 flex flex-col h-full">
            <h4 className="text-xl font-black text-on-surface tracking-tight mb-8 flex items-center justify-between">
              Próximas Doses
              <span className="material-symbols-outlined text-primary text-2xl font-black">schedule</span>
            </h4>
            
            {data?.next_doses?.length > 0 ? (
              <div className="space-y-8 flex-1">
                {data.next_doses.map((dose, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-primary ring-8 ring-primary/10 transition-all group-hover:scale-125 group-hover:ring-primary/20 z-10"></div>
                      {i < data.next_doses.length - 1 && <div className="w-0.5 h-16 bg-gradient-to-b from-primary/30 to-transparent mt-2"></div>}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">{dose.scheduled_time?.slice(0, 5)} — Hoje</p>
                      <p className="font-black text-on-surface text-lg tracking-tight">{dose.name}</p>
                      <div className="flex items-center gap-4 text-xs font-bold text-on-surface-variant/60">
                         <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">medication</span> {dose.dosage}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center text-outline-variant">
                  <span className="material-symbols-outlined text-3xl">event_available</span>
                </div>
                <p className="text-sm font-bold text-outline uppercase tracking-widest">Sem pendências</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">Você está em dia com todas as suas medicações no momento.</p>
              </div>
            )}
            
            <Link to="/agenda" className="mt-8 py-4 bg-surface-container-low hover:bg-surface-container-high text-on-surface text-center rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 border border-outline-variant/5">
              Ver Agenda Completa
            </Link>
          </div>
        </div>

        {/* Health Metrics - 3 Small Bento Pieces */}
        {/* Water Metric */}
        <div className="md:col-span-3 bg-white/60 backdrop-blur-lg p-6 rounded-[2.5rem] border border-outline-variant/15 shadow-xl hover:shadow-2xl transition-all group overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl font-black">water_drop</span>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-outline uppercase tracking-widest">Hidratação</p>
              <p className="text-2xl font-black text-on-surface">{metrics.water}ml</p>
            </div>
          </div>
          <div className="space-y-4">
             <div className="w-full bg-blue-500/5 h-12 rounded-2xl overflow-hidden relative">
                <div className="absolute inset-y-0 left-0 bg-blue-500/20 transition-all duration-1000" style={{ width: `${Math.min((metrics.water / 2500) * 100, 100)}%` }}></div>
                <div className="absolute inset-x-0 bottom-0 text-xs font-black text-blue-500/50 uppercase text-center pb-1">Meta: 2.5L</div>
             </div>
             <div className="flex gap-2">
                <button onClick={() => updateMetric('water', metrics.water + 250)} className="flex-1 py-3 bg-blue-500 text-white rounded-xl text-xs font-black hover:bg-blue-600 transition-all active:scale-90 shadow-lg shadow-blue-500/20">
                  +250ml
                </button>
                <button onClick={() => updateMetric('water', Math.max(0, metrics.water - 250))} className="p-3 bg-surface-container-high text-on-surface-variant rounded-xl hover:bg-error/10 hover:text-error transition-all active:scale-90">
                  <span className="material-symbols-outlined text-sm">remove</span>
                </button>
             </div>
          </div>
        </div>

        {/* Steps Metric */}
        <div className="md:col-span-3 bg-white/60 backdrop-blur-lg p-6 rounded-[2.5rem] border border-outline-variant/15 shadow-xl hover:shadow-2xl transition-all group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl font-black">directions_run</span>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-outline uppercase tracking-widest">Atividade</p>
              <p className="text-2xl font-black text-on-surface">{metrics.steps.toLocaleString()}</p>
            </div>
          </div>
          <div className="space-y-4">
             <div className="w-full bg-orange-500/5 h-12 rounded-2xl overflow-hidden relative">
                <div className="absolute inset-y-0 left-0 bg-orange-500/20 transition-all duration-1000" style={{ width: `${Math.min((metrics.steps / 10000) * 100, 100)}%` }}></div>
                <div className="absolute inset-x-0 bottom-0 text-xs font-black text-orange-500/50 uppercase text-center pb-1">Meta: 10k</div>
             </div>
             <div className="flex gap-2">
                <button onClick={() => updateMetric('steps', metrics.steps + 500)} className="flex-1 py-3 bg-orange-500 text-white rounded-xl text-xs font-black hover:bg-orange-600 transition-all active:scale-90 shadow-lg shadow-orange-500/20 text-center">
                  Caminhada
                </button>
             </div>
          </div>
        </div>

        {/* Sleep Metric */}
        <div className="md:col-span-3 bg-white/60 backdrop-blur-lg p-6 rounded-[2.5rem] border border-outline-variant/15 shadow-xl hover:shadow-2xl transition-all group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl font-black">bedtime</span>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-outline uppercase tracking-widest">Repouso</p>
              <p className="text-2xl font-black text-on-surface">{metrics.sleep}h</p>
            </div>
          </div>
          <div className="space-y-4">
             <div className="w-full bg-indigo-500/5 h-12 rounded-2xl overflow-hidden relative">
                <div className="absolute inset-y-0 left-0 bg-indigo-500/20 transition-all duration-1000" style={{ width: `${Math.min((metrics.sleep / 8) * 100, 100)}%` }}></div>
                <div className="absolute inset-x-0 bottom-0 text-xs font-black text-indigo-500/50 uppercase text-center pb-1">Meta: 8h</div>
             </div>
             <div className="grid grid-cols-2 gap-2">
                <button onClick={() => updateMetric('sleep', Math.min(24, metrics.sleep + 0.5))} className="py-3 bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-90 shadow-lg shadow-indigo-500/20">
                  +0.5h
                </button>
                <button onClick={() => updateMetric('sleep', Math.max(0, metrics.sleep - 0.5))} className="py-3 bg-surface-container-high text-on-surface-variant rounded-xl text-xs font-black uppercase tracking-widest hover:bg-error/10 hover:text-error transition-all active:scale-90">
                  -0.5h
                </button>
             </div>
          </div>
        </div>

        {/* Quick Actions / Critical Stock - Small Bento Piece */}
        <div className="md:col-span-3 bg-error/5 border border-error/10 p-6 rounded-[2.5rem] flex flex-col justify-between hover:bg-error/10 transition-all group">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center text-error group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-xl font-black">warning</span>
              </div>
              <p className="text-xs font-black text-error uppercase tracking-[0.2em]">Reposição</p>
            </div>
            <h4 className="text-xl font-black text-on-surface tracking-tight">Estoque Crítico</h4>
            <div className="flex items-end gap-2">
              <p className="text-4xl font-black text-error">{data?.critical_stock || 0}</p>
              <p className="text-xs font-bold text-outline-variant mb-1.5 uppercase tracking-widest tracking-tighter">Itens para revisar</p>
            </div>
          </div>
          <Link to="/inventory" className="mt-6 flex items-center justify-center gap-2 text-xs font-black text-error uppercase tracking-widest group-hover:translate-x-2 transition-transform">
            Resolver Agora <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </Link>
        </div>

        {/* Active Prescriptions - Full Width Bento Piece */}
        <div className="md:col-span-12 mt-10">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h4 className="text-3xl font-black text-on-surface tracking-tighter">Prescrições Ativas</h4>
              <p className="text-xs font-bold text-outline uppercase tracking-widest">Seu tratamento em curso</p>
            </div>
            <Link to="/inventory" className="px-6 py-3 bg-surface-container-low hover:bg-surface-container-high rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
              Gerenciar Tudo
            </Link>
          </div>

          {data?.prescriptions?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.prescriptions.slice(0, 6).map((med) => {
                const pct = med.stock_total > 0 ? Math.round((med.stock_quantity / med.stock_total) * 100) : 0;
                const isCritical = pct < 20;
                return (
                  <div key={med.id} className="bg-white/40 backdrop-blur-xl p-6 sm:p-8 rounded-[2.5rem] border border-outline-variant/15 hover:shadow-2xl transition-all group relative overflow-hidden">
                    {isCritical && <div className="absolute top-0 right-0 w-32 h-32 bg-error/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>}
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6 ${isCritical ? 'bg-error/10 text-error shadow-xl shadow-error/10' : 'bg-primary/10 text-primary shadow-xl shadow-primary/10'}`}>
                        <span className="material-symbols-outlined text-3xl font-black">{iconMap[med.icon] || 'pill'}</span>
                      </div>
                      <span className={`px-4 py-1.5 text-xs font-black rounded-full uppercase tracking-widest shadow-sm ${isCritical ? 'bg-error text-on-error' : 'bg-primary/20 text-primary'}`}>
                        {isCritical ? 'Baixo Estoque' : 'Estável'}
                      </span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-black text-on-surface text-xl tracking-tight leading-none mb-1">{med.name}</h5>
                        <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest">{med.dosage} • {med.frequency}</p>
                      </div>
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-1 items-end">
                           <span className="text-outline">Disponível</span>
                           <span className={isCritical ? 'text-error animate-pulse' : 'text-primary'}>{med.stock_quantity} doses</span>
                        </div>
                        <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-1000 ${isCritical ? 'bg-error' : 'premium-gradient'}`} style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-surface-container-low/30 backdrop-blur-sm rounded-[3rem] border border-dashed border-outline-variant/30 flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center text-outline-variant grayscale">
                <span className="material-symbols-outlined text-5xl">medication_liquid</span>
              </div>
              <div>
                <h5 className="font-black text-on-surface text-2xl tracking-tight mb-2">Plano de Cuidado Vazio</h5>
                <p className="text-on-surface-variant font-medium text-sm max-w-sm mx-auto">Adicione seus medicamentos e agende suas doses para que o Clinical Sanctuary possa monitorar sua saúde.</p>
              </div>
              <Link to="/inventory" className="mt-4 px-10 py-5 premium-gradient text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:-translate-y-1 active:scale-95 transition-all">
                Configurar Tratamento
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;