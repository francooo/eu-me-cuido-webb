import React from 'react';

const Inventory = () => {
  return (
    <>
      {/* Family Member Switcher */}
      <div className="mb-10 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-outline">Gerenciar Membros da Família</span>
          <button className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
            <span className="material-symbols-outlined text-sm">person_add</span> Adicionar Novo
          </button>
        </div>
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {/* Maria Silva (Selected) */}
          <button className="flex flex-col items-center gap-2 group min-w-[80px]">
            <div className="w-14 h-14 rounded-full p-1 ring-2 ring-primary bg-white transition-all flex items-center justify-center bg-surface-container-high text-primary">
              <span className="material-symbols-outlined">person</span>
            </div>
            <span className="text-xs font-bold text-primary">Maria (Eu)</span>
          </button>

          {/* João Silva */}
          <button className="flex flex-col items-center gap-2 group min-w-[80px] opacity-60 hover:opacity-100 transition-opacity">
            <div className="w-14 h-14 rounded-full p-1 ring-0 group-hover:ring-2 ring-outline-variant bg-white transition-all flex items-center justify-center bg-surface-container-high">
              <span className="material-symbols-outlined">person</span>
            </div>
            <span className="text-xs font-medium text-on-surface-variant">João</span>
          </button>

          {/* Helena Silva */}
          <button className="flex flex-col items-center gap-2 group min-w-[80px] opacity-60 hover:opacity-100 transition-opacity">
            <div className="w-14 h-14 rounded-full p-1 ring-0 group-hover:ring-2 ring-outline-variant bg-white transition-all flex items-center justify-center bg-surface-container-high">
              <span className="material-symbols-outlined">person</span>
            </div>
            <span className="text-xs font-medium text-on-surface-variant">Helena</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 font-['Plus_Jakarta_Sans']">
        <div className="bg-surface-container-lowest p-6 rounded-xl flex flex-col gap-2 shadow-sm border border-primary/5">
          <span className="text-outline text-[10px] font-extrabold uppercase tracking-widest">Total de Itens (Maria)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-on-surface">14</span>
            <span className="text-primary font-bold text-sm">+2 este mês</span>
          </div>
        </div>
        <div className="bg-[#ffdad6] p-6 rounded-xl flex flex-col gap-2 shadow-sm border border-error/10">
          <span className="text-on-error-container text-[10px] font-extrabold uppercase tracking-widest">Estoque Crítico</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-on-error-container">03</span>
            <span className="text-on-error-container/70 font-semibold text-sm">Requer atenção</span>
          </div>
        </div>
        <div className="bg-primary-fixed p-6 rounded-xl flex flex-col gap-2 shadow-sm border border-primary/10">
          <span className="text-on-primary-fixed-variant text-[10px] font-extrabold uppercase tracking-widest">Próxima Dose</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-on-primary-fixed-variant">14:30</span>
            <span className="text-on-primary-fixed-variant/70 font-semibold text-sm">Amoxicilina</span>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex gap-2">
          <button className="px-5 py-2.5 bg-primary text-on-primary rounded-full text-xs font-bold shadow-md active:scale-95 transition-all">Todos</button>
          <button className="px-5 py-2.5 bg-surface-container-high text-primary rounded-full text-xs font-bold hover:bg-surface-container-highest transition-colors">Uso Contínuo</button>
          <button className="px-5 py-2.5 bg-surface-container-high text-primary rounded-full text-xs font-bold hover:bg-surface-container-highest transition-colors">Antibióticos</button>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-lg">filter_list</span>
            <span className="text-xs font-bold uppercase tracking-wider">Filtrar</span>
          </button>
          <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-lg">sort</span>
            <span className="text-xs font-bold uppercase tracking-wider">Ordenar</span>
          </button>
        </div>
      </div>

      {/* Medication Inventory List */}
      <div className="space-y-4">

        {/* Med Item 1: High Priority / Low Stock */}
        <div className="bg-surface-container-lowest p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:translate-x-1 transition-transform duration-200 shadow-sm border border-outline-variant/10">
          <div className="flex items-center gap-5 flex-1">
            <div className="w-14 h-14 bg-error-container rounded-xl flex items-center justify-center text-on-error-container">
              <span className="material-symbols-outlined text-3xl">pill</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">Amoxicilina 500mg</h3>
              <p className="text-on-surface-variant text-sm font-medium">1 comprimido • A cada 8 horas</p>
            </div>
          </div>
          <div className="flex flex-wrap md:flex-nowrap items-center gap-8 flex-[2]">
            <div className="flex flex-col">
              <span className="text-[10px] text-outline font-extrabold uppercase tracking-widest mb-1">Próxima Dose</span>
              <div className="flex items-center gap-2 text-primary font-bold">
                <span className="material-symbols-outlined text-sm">schedule</span>
                14:30 (Hoje)
              </div>
            </div>
            <div className="flex flex-col min-w-[120px]">
              <span className="text-[10px] text-outline font-extrabold uppercase tracking-widest mb-1">Estoque Restante</span>
              <div className="flex items-center gap-3">
                <div className="h-2 w-24 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-error w-[15%]"></div>
                </div>
                <span className="text-sm font-bold text-error">04 un.</span>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-error-container text-on-error-container text-[10px] font-extrabold rounded-full uppercase">Estoque Baixo</span>
              <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-extrabold rounded-full uppercase">Crítico</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined">edit</span></button>
            <button className="p-2 text-outline hover:text-error transition-colors"><span className="material-symbols-outlined">delete</span></button>
          </div>
        </div>

        {/* Med Item 2: Normal */}
        <div className="bg-surface-container-lowest p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:translate-x-1 transition-transform duration-200 shadow-sm border border-outline-variant/10">
          <div className="flex items-center gap-5 flex-1">
            <div className="w-14 h-14 bg-surface-container-low rounded-xl flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl">vaccines</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">Atorvastatina 20mg</h3>
              <p className="text-on-surface-variant text-sm font-medium">1 comprimido • Diário (Noite)</p>
            </div>
          </div>
          <div className="flex flex-wrap md:flex-nowrap items-center gap-8 flex-[2]">
            <div className="flex flex-col">
              <span className="text-[10px] text-outline font-extrabold uppercase tracking-widest mb-1">Próxima Dose</span>
              <div className="flex items-center gap-2 text-on-surface-variant font-bold">
                <span className="material-symbols-outlined text-sm">schedule</span>
                21:00 (Hoje)
              </div>
            </div>
            <div className="flex flex-col min-w-[120px]">
              <span className="text-[10px] text-outline font-extrabold uppercase tracking-widest mb-1">Estoque Restante</span>
              <div className="flex items-center gap-3">
                <div className="h-2 w-24 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[80%]"></div>
                </div>
                <span className="text-sm font-bold text-on-surface">24 un.</span>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-extrabold rounded-full uppercase">Estoque OK</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined">edit</span></button>
            <button className="p-2 text-outline hover:text-error transition-colors"><span className="material-symbols-outlined">delete</span></button>
          </div>
        </div>

        {/* Med Item 3: Normal */}
        <div className="bg-surface-container-lowest p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:translate-x-1 transition-transform duration-200 shadow-sm border border-outline-variant/10">
          <div className="flex items-center gap-5 flex-1">
            <div className="w-14 h-14 bg-surface-container-low rounded-xl flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl">medication</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">Vitamina D3 2000 UI</h3>
              <p className="text-on-surface-variant text-sm font-medium">1 cápsula • Diário (Manhã)</p>
            </div>
          </div>
          <div className="flex flex-wrap md:flex-nowrap items-center gap-8 flex-[2]">
            <div className="flex flex-col">
              <span className="text-[10px] text-outline font-extrabold uppercase tracking-widest mb-1">Próxima Dose</span>
              <div className="flex items-center gap-2 text-on-surface-variant font-bold">
                <span className="material-symbols-outlined text-sm">schedule</span>
                08:00 (Amanhã)
              </div>
            </div>
            <div className="flex flex-col min-w-[120px]">
              <span className="text-[10px] text-outline font-extrabold uppercase tracking-widest mb-1">Estoque Restante</span>
              <div className="flex items-center gap-3">
                <div className="h-2 w-24 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[60%]"></div>
                </div>
                <span className="text-sm font-bold text-on-surface">18 un.</span>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-extrabold rounded-full uppercase">Estoque OK</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined">edit</span></button>
            <button className="p-2 text-outline hover:text-error transition-colors"><span className="material-symbols-outlined">delete</span></button>
          </div>
        </div>

      </div>
    </>
  );
};

export default Inventory;