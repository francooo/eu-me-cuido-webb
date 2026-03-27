import React from 'react';

const Agenda = () => {
  return (
    <div className="space-y-8">
      {/* Editorial Hero Header & Global WhatsApp Toggle */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
        <div>
          <p className="text-primary font-semibold tracking-wide uppercase text-xs mb-2">Resumo Semanal</p>
          <h2 className="text-4xl font-extrabold text-on-surface">Maio, 2024</h2>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* WhatsApp Global Quick Control */}
          <div className="flex items-center gap-3 px-5 py-2.5 bg-whatsapp/10 border border-whatsapp/20 rounded-2xl">
            <svg className="w-5 h-5 text-whatsapp" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path>
            </svg>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-whatsapp uppercase leading-none mb-1">Lembretes WhatsApp</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-on-surface">Ativado para todos</span>
                <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-whatsapp transition-colors focus:outline-none">
                  <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform translate-x-5"></span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2 p-1 bg-surface-container-low rounded-full">
            <button className="px-6 py-2 bg-white shadow-sm rounded-full text-sm font-semibold text-primary">Semana</button>
            <button className="px-6 py-2 text-on-surface-variant text-sm font-medium hover:bg-white/50 rounded-full">Mês</button>
          </div>
        </div>
      </div>

      {/* Bento Grid Calendar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Day 1 (Past) */}
        <div className="flex flex-col gap-4">
          <div className="text-center pb-4 border-b border-outline-variant/15">
            <span className="block text-xs font-bold text-on-surface-variant uppercase">Seg</span>
            <span className="text-xl font-extrabold text-on-surface">13</span>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-secondary-container rounded-xl flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow relative group">
              <span className="text-[10px] font-bold text-on-secondary-container uppercase">Tomado</span>
              <h4 className="font-bold text-sm text-on-secondary-container leading-tight">Atorvastatina</h4>
              <p className="text-[11px] text-on-secondary-container/80">08:00 • 20mg</p>
              <span className="material-symbols-outlined absolute top-4 right-4 text-whatsapp text-sm opacity-60 group-hover:opacity-100 transition-opacity" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
            </div>
            <div className="p-4 bg-secondary-container rounded-xl flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow">
              <span className="text-[10px] font-bold text-on-secondary-container uppercase">Tomado</span>
              <h4 className="font-bold text-sm text-on-secondary-container leading-tight">Vitamina D3</h4>
              <p className="text-[11px] text-on-secondary-container/80">12:00 • 2000UI</p>
            </div>
          </div>
        </div>

        {/* Day 2 (Past) */}
        <div className="flex flex-col gap-4">
          <div className="text-center pb-4 border-b border-outline-variant/15">
            <span className="block text-xs font-bold text-on-surface-variant uppercase">Ter</span>
            <span className="text-xl font-extrabold text-on-surface">14</span>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-secondary-container rounded-xl flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow">
              <span className="text-[10px] font-bold text-on-secondary-container uppercase">Tomado</span>
              <h4 className="font-bold text-sm text-on-secondary-container leading-tight">Atorvastatina</h4>
              <p className="text-[11px] text-on-secondary-container/80">08:00 • 20mg</p>
            </div>
            <div className="p-4 bg-error-container rounded-xl flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow">
              <span className="text-[10px] font-bold text-on-error-container uppercase">Perdido</span>
              <h4 className="font-bold text-sm text-on-error-container leading-tight">Metformina</h4>
              <p className="text-[11px] text-on-error-container/80">14:00 • 500mg</p>
            </div>
          </div>
        </div>

        {/* Day 3 (Current) */}
        <div className="flex flex-col gap-4 bg-primary-fixed/30 rounded-2xl p-2 -m-2">
          <div className="text-center pb-4 border-b border-primary/20 bg-primary rounded-t-xl py-2">
            <span className="block text-xs font-bold text-on-primary uppercase">Qua</span>
            <span className="text-xl font-extrabold text-on-primary">15</span>
          </div>
          <div className="space-y-3 px-2">
            <div className="p-4 bg-secondary-container rounded-xl flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow">
              <span className="text-[10px] font-bold text-on-secondary-container uppercase">Tomado</span>
              <h4 className="font-bold text-sm text-on-secondary-container leading-tight">Atorvastatina</h4>
              <p className="text-[11px] text-on-secondary-container/80">08:00 • 20mg</p>
            </div>

            {/* Glassmorphism "Next Up" Card */}
            <div className="p-4 bg-primary-container/90 backdrop-blur-md rounded-xl flex flex-col gap-2 cursor-pointer shadow-lg border border-white/20 transform scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2">
                <svg className="w-4 h-4 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path>
                </svg>
              </div>
              <span className="text-[10px] font-bold text-on-primary-container uppercase flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span> Próximo: Agora
              </span>
              <h4 className="font-bold text-sm text-on-primary-container leading-tight">Ibuprofeno</h4>
              <p className="text-[11px] text-on-primary-container/80">16:30 • 400mg</p>
              <button className="mt-2 py-1.5 bg-white text-primary text-xs font-bold rounded-full">Confirmar</button>
            </div>

            <div className="p-4 bg-surface-container-highest rounded-xl flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow border-none">
              <span className="text-[10px] font-bold text-primary uppercase">Pendente</span>
              <h4 className="font-bold text-sm text-on-surface leading-tight">Melatonina</h4>
              <p className="text-[11px] text-on-surface-variant">22:00 • 3mg</p>
            </div>
          </div>
        </div>

        {/* Day 4 (Future) */}
        <div className="flex flex-col gap-4 opacity-75">
          <div className="text-center pb-4 border-b border-outline-variant/15">
            <span className="block text-xs font-bold text-on-surface-variant uppercase">Qui</span>
            <span className="text-xl font-extrabold text-on-surface">16</span>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-surface-container-highest rounded-xl flex flex-col gap-2 border-none">
              <h4 className="font-bold text-sm text-on-surface leading-tight">Atorvastatina</h4>
              <p className="text-[11px] text-on-surface-variant">08:00 • 20mg</p>
            </div>
            <div className="p-4 bg-surface-container-highest rounded-xl flex flex-col gap-2 border-none">
              <h4 className="font-bold text-sm text-on-surface leading-tight">Vitamina D3</h4>
              <p className="text-[11px] text-on-surface-variant">12:00 • 2000UI</p>
            </div>
          </div>
        </div>

        {/* Day 5 (Future) */}
        <div className="flex flex-col gap-4 opacity-60">
          <div className="text-center pb-4 border-b border-outline-variant/15">
            <span className="block text-xs font-bold text-on-surface-variant uppercase">Sex</span>
            <span className="text-xl font-extrabold text-on-surface">17</span>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-surface-container-highest rounded-xl flex flex-col gap-2 border-none">
              <h4 className="font-bold text-sm text-on-surface leading-tight">Atorvastatina</h4>
              <p className="text-[11px] text-on-surface-variant">08:00 • 20mg</p>
            </div>
          </div>
        </div>

        {/* Day 6 (Future) */}
        <div className="flex flex-col gap-4 opacity-40">
          <div className="text-center pb-4 border-b border-outline-variant/15">
            <span className="block text-xs font-bold text-on-surface-variant uppercase">Sáb</span>
            <span className="text-xl font-extrabold text-on-surface">18</span>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-surface-container-highest rounded-xl flex flex-col gap-2 border-none">
              <h4 className="font-bold text-sm text-on-surface leading-tight">Vitamina C</h4>
              <p className="text-[11px] text-on-surface-variant">09:00 • 1g</p>
            </div>
          </div>
        </div>

        {/* Day 7 (Future) */}
        <div className="flex flex-col gap-4 opacity-20">
          <div className="text-center pb-4 border-b border-outline-variant/15">
            <span className="block text-xs font-bold text-on-surface-variant uppercase">Dom</span>
            <span className="text-xl font-extrabold text-on-surface">19</span>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-surface-container-highest rounded-xl flex flex-col gap-2 border-none">
              <h4 className="font-bold text-sm text-on-surface leading-tight">Vitamina C</h4>
              <p className="text-[11px] text-on-surface-variant">09:00 • 1g</p>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Feature Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 p-8 bg-white rounded-3xl flex flex-col md:flex-row items-center gap-8 shadow-sm border border-outline-variant/10">
          <div className="flex-shrink-0 w-20 h-20 bg-whatsapp/10 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-whatsapp" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path>
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-on-surface mb-2">Lembretes pelo WhatsApp</h3>
            <p className="text-on-surface-variant text-sm mb-4">Receba notificações instantâneas no seu celular nos horários agendados. Nunca mais perca uma dose.</p>
            <button className="px-6 py-2.5 bg-whatsapp text-white rounded-full text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
              Configurar Lembretes WhatsApp
            </button>
          </div>
        </div>

        <div className="p-8 bg-surface-container-low rounded-3xl flex flex-col md:flex-row items-center gap-6 border-none">
          <div className="relative h-20 w-20 flex-shrink-0">
            <svg className="h-full w-full" viewBox="0 0 36 36">
              <path className="text-outline-variant/20" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="100, 100" strokeWidth="3"></path>
              <path className="text-secondary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="85, 100" strokeWidth="3"></path>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-on-surface">85%</span>
            </div>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-on-surface">Adesão Semanal</h3>
            <p className="text-on-surface-variant text-xs">Excelente desempenho!</p>
          </div>
        </div>

        <div className="p-8 bg-primary-fixed text-on-primary-fixed rounded-3xl flex flex-col justify-between border-none">
          <span className="material-symbols-outlined text-3xl">medical_information</span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider mb-1">Reabastecimento</p>
            <h4 className="text-2xl font-bold">Em 4 dias</h4>
            <p className="text-[11px] mt-1 opacity-70">Atorvastatina (12 rest.)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agenda;