import React, { useState, useEffect } from 'react';
import { schedulesApi, doseLogsApi } from '../services/api';

const Agenda = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState(null);

  useEffect(() => {
    schedulesApi.list()
      .then(setSchedules)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleConfirm = async (schedule) => {
    setConfirmingId(schedule.id);
    try {
      await doseLogsApi.create({
        medication_id: schedule.medication_id,
        schedule_id: schedule.id,
        status: 'taken',
        scheduled_at: new Date().toISOString(),
      });
      alert(`✅ Dose de ${schedule.medication_name} registrada!`);
    } catch (err) {
      alert('Erro ao registrar: ' + err.message);
    } finally {
      setConfirmingId(null);
    }
  };

  // Organizar por horário
  const now = new Date();
  const nowTime = now.getHours() * 60 + now.getMinutes();
  const past = schedules.filter(s => {
    const [h, m] = s.scheduled_time.split(':').map(Number);
    return h * 60 + m < nowTime - 30;
  });
  const upcoming = schedules.filter(s => {
    const [h, m] = s.scheduled_time.split(':').map(Number);
    return h * 60 + m >= nowTime - 30;
  });
  const nextUp = upcoming[0];

  // Dias da semana
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const today = now.getDay();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
        <div>
          <p className="text-primary font-semibold tracking-wide uppercase text-xs mb-2">Agenda do Dia</p>
          <h2 className="text-4xl font-extrabold text-on-surface">
            {now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-5 py-2.5 bg-whatsapp/10 border border-whatsapp/20 rounded-2xl">
            <svg className="w-5 h-5 text-whatsapp" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-whatsapp uppercase leading-none mb-1">Lembretes WhatsApp</span>
              <span className="text-xs font-semibold text-on-surface">Em breve</span>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-4 flex-col">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-on-surface-variant text-sm">Carregando agenda...</p>
        </div>
      ) : schedules.length === 0 ? (
        <div className="text-center py-24 bg-surface-container-lowest rounded-2xl border border-outline-variant/15">
          <span className="material-symbols-outlined text-6xl text-outline mb-4">event_note</span>
          <h4 className="font-bold text-on-surface text-xl mb-2">Nenhum agendamento</h4>
          <p className="text-on-surface-variant text-sm">Adicione medicamentos com horário no Inventário para ver a agenda aqui.</p>
        </div>
      ) : (
        <>
          {/* Weekly Overview Strip */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, idx) => (
              <div key={idx} className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${idx === today ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'}`}>
                <span className="text-[10px] font-bold uppercase">{day}</span>
                <span className={`text-lg font-extrabold ${idx === today ? 'text-on-primary' : 'text-on-surface'}`}>
                  {new Date(now.getFullYear(), now.getMonth(), now.getDate() - today + idx).getDate()}
                </span>
                {schedules.length > 0 && (
                  <div className={`w-1.5 h-1.5 rounded-full ${idx === today ? 'bg-white' : 'bg-primary/40'}`}></div>
                )}
              </div>
            ))}
          </div>

          {/* Today's Schedule */}
          <div className="space-y-6">
            {/* Upcoming */}
            {upcoming.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Próximas</h3>
                <div className="space-y-4">
                  {upcoming.map((s) => {
                    const isNext = s === nextUp;
                    return (
                      <div key={s.id} className={`p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 transition-all ${isNext ? 'bg-primary-container/90 backdrop-blur-md shadow-lg border border-white/20 scale-[1.01]' : 'bg-surface-container-lowest border border-outline-variant/15 hover:shadow-md'}`}>
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${isNext ? 'bg-white/20 text-on-primary-container' : 'bg-surface-container-low text-primary'}`}>
                          <span className="material-symbols-outlined text-3xl">{s.icon || 'pill'}</span>
                        </div>
                        <div className="flex-1">
                          {isNext && <span className="text-[10px] font-bold text-on-primary-container uppercase flex items-center gap-1 mb-1"><span className="w-2 h-2 rounded-full bg-white animate-pulse"></span> Próximo: Agora</span>}
                          <h4 className={`font-bold text-lg ${isNext ? 'text-on-primary-container' : 'text-on-surface'}`}>{s.medication_name}</h4>
                          <p className={`text-sm ${isNext ? 'text-on-primary-container/80' : 'text-on-surface-variant'}`}>{s.scheduled_time?.slice(0, 5)} • {s.dosage}</p>
                          {s.instructions && <p className={`text-xs mt-1 ${isNext ? 'text-on-primary-container/70' : 'text-outline'}`}>{s.instructions}</p>}
                        </div>
                        <button
                          onClick={() => handleConfirm(s)}
                          disabled={confirmingId === s.id}
                          className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${isNext ? 'bg-white text-primary hover:bg-white/90' : 'bg-primary text-on-primary hover:shadow-md'} disabled:opacity-50`}>
                          {confirmingId === s.id ? 'Registrando...' : 'Confirmar'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Past */}
            {past.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Anteriores</h3>
                <div className="space-y-3 opacity-70">
                  {past.map((s) => (
                    <div key={s.id} className="p-5 rounded-xl bg-secondary-container/30 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
                        <span className="material-symbols-outlined text-xl">{s.icon || 'pill'}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-on-secondary-container text-sm">{s.medication_name}</h4>
                        <p className="text-[11px] text-on-secondary-container/80">{s.scheduled_time?.slice(0, 5)} • {s.dosage}</p>
                      </div>
                      <span className="material-symbols-outlined text-whatsapp" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stats Footer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 p-6 bg-surface-container-low rounded-3xl flex items-center gap-4">
              <div className="relative h-16 w-16 flex-shrink-0">
                <svg className="h-full w-full" viewBox="0 0 36 36">
                  <path className="text-outline-variant/20" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="100, 100" strokeWidth="3"></path>
                  <path className="text-secondary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor"
                    strokeDasharray={`${schedules.length > 0 ? Math.round((past.length / schedules.length) * 100) : 0}, 100`} strokeWidth="3"></path>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-on-surface">
                    {schedules.length > 0 ? Math.round((past.length / schedules.length) * 100) : 0}%
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-on-surface">Progresso de Hoje</h3>
                <p className="text-on-surface-variant text-xs">{past.length} de {schedules.length} doses</p>
              </div>
            </div>

            <div className="p-6 bg-primary-fixed text-on-primary-fixed rounded-3xl flex flex-col justify-between">
              <span className="material-symbols-outlined text-3xl">medical_information</span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider mb-1">Próxima Dose</p>
                <h4 className="text-2xl font-bold">{nextUp?.scheduled_time?.slice(0, 5) || '--:--'}</h4>
                <p className="text-[11px] mt-1 opacity-70">{nextUp?.medication_name || 'Nenhuma pendente'}</p>
              </div>
            </div>

            <div className="p-6 bg-surface-container-lowest rounded-3xl flex flex-col justify-between border border-outline-variant/15">
              <span className="material-symbols-outlined text-primary text-3xl">schedule</span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider mb-1 text-on-surface-variant">Total de Doses</p>
                <h4 className="text-2xl font-bold text-on-surface">{schedules.length} hoje</h4>
                <p className="text-[11px] mt-1 text-on-surface-variant">{upcoming.length} pendentes</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Agenda;