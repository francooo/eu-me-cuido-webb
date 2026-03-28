import React, { useState, useEffect } from 'react';
import { doseLogsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusConfig = {
  taken: { label: 'No horário', bg: 'bg-primary-fixed/30', text: 'text-primary', icon: 'check_circle', iconBg: 'bg-primary/10 text-primary' },
  missed: { label: 'Perdida', bg: 'bg-error-container/30', text: 'text-error', icon: 'error', iconBg: 'bg-error/10 text-error' },
  late: { label: 'Atrasada', bg: 'bg-tertiary-fixed/40', text: 'text-on-tertiary-container', icon: 'schedule', iconBg: 'bg-tertiary-container/20 text-on-tertiary-container' },
};

function groupByDate(logs) {
  return logs.reduce((acc, log) => {
    const date = new Date(log.scheduled_at).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {});
}

const History = () => {
  const { user, selectedMember } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [days, setDays] = useState(7);

  const loadLogs = async (d) => {
    try {
      setLoading(true);
      const params = { days: d };
      if (selectedMember) params.family_member_id = selectedMember.id;
      const data = await doseLogsApi.list(params);
      setLogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (user) loadLogs(days); 
  }, [user, days, selectedMember]);

  const totalTaken = logs.filter(l => l.status === 'taken').length;
  const totalMissed = logs.filter(l => l.status === 'missed').length;
  const adherence = logs.length > 0 ? Math.round((totalTaken / logs.length) * 100) : 0;

  const grouped = groupByDate(logs);

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">Histórico</h2>
          <p className="text-on-surface-variant text-lg">Acompanhe sua jornada de cuidado e consistência.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-surface-container-low p-1 rounded-xl">
            {[7, 30].map(d => (
              <button key={d} onClick={() => setDays(d)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${days === d ? 'text-on-primary-fixed bg-primary-fixed shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}>
                {d} dias
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-4 flex-col">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-on-surface-variant text-sm">Carregando histórico...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-error">{error}</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-20 bg-surface-container-lowest rounded-xl border border-outline-variant/15">
              <span className="material-symbols-outlined text-5xl text-outline mb-4">history</span>
              <h4 className="font-bold text-on-surface mb-2">Nenhum registro ainda</h4>
              <p className="text-on-surface-variant text-sm">Confirme doses no dashboard para ver seu histórico aqui.</p>
            </div>
          ) : Object.entries(grouped).map(([date, dayLogs]) => (
            <div key={date}>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px flex-1 bg-outline-variant/20"></div>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest capitalize">{date}</span>
                <div className="h-px flex-1 bg-outline-variant/20"></div>
              </div>
              <div className="space-y-3">
                {dayLogs.map((log) => {
                  const cfg = statusConfig[log.status] || statusConfig.taken;
                  return (
                    <div key={log.id} className="bg-surface-container-lowest rounded-xl p-5 flex items-center gap-6 hover:bg-surface-container-high transition-all group cursor-pointer">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${cfg.iconBg}`}>
                        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{cfg.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-lg text-on-surface">{log.medication_name} {log.dosage}</h3>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                        </div>
                        <p className="text-sm text-on-surface-variant">
                          {log.taken_at ? `Tomada às ${new Date(log.taken_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` : 'Não registrada'}
                          {' • '}
                          <span className="font-medium">Agendado: {new Date(log.scheduled_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant opacity-30">chevron_right</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-primary p-8 rounded-[2rem] text-on-primary relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-container/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <span className="material-symbols-outlined text-4xl mb-6">description</span>
              <h3 className="text-2xl font-bold mb-3 leading-tight">Relatório de Adesão</h3>
              <p className="text-primary-fixed/80 text-sm mb-8 leading-relaxed">
                Gere um documento com seus dados de medicação para sua próxima consulta.
              </p>
              <button className="w-full py-4 bg-primary-container text-on-primary-container font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
                <span className="material-symbols-outlined">download</span>
                Baixar PDF
              </button>
            </div>
          </div>

          <div className="bg-surface-container-low p-6 rounded-[2rem]">
            <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-6">Resumo ({days} dias)</h4>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-3xl font-extrabold text-primary">{adherence}%</p>
                  <p className="text-xs font-medium text-on-surface-variant">Adesão Total</p>
                </div>
                <div className="w-24 h-1.5 bg-outline-variant/20 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${adherence}%` }}></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-lowest p-4 rounded-2xl">
                  <p className="text-xl font-bold text-on-surface">{totalTaken}</p>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase">Doses Tomadas</p>
                </div>
                <div className="bg-surface-container-lowest p-4 rounded-2xl">
                  <p className="text-xl font-bold text-error">{totalMissed}</p>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase">Doses Perdidas</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default History;