import React from 'react';

const History = () => {
  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">Histórico</h2>
          <p className="text-on-surface-variant text-lg">Acompanhe sua jornada de cuidado e consistência.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-surface-container-low p-1 rounded-xl">
            <button className="px-4 py-2 text-sm font-semibold text-on-primary-fixed bg-primary-fixed rounded-lg shadow-sm">7 dias</button>
            <button className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">30 dias</button>
            <button className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Personalizado</button>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-lowest text-on-surface-variant rounded-xl text-sm font-semibold border border-outline-variant/10 hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-lg">filter_list</span>
            Filtros
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-outline-variant/20"></div>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Hoje, 24 de Maio</span>
            <div className="h-px flex-1 bg-outline-variant/20"></div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-5 flex items-center gap-6 hover:bg-surface-container-high transition-all group cursor-pointer">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-lg text-on-surface">Atorvastatina 20mg</h3>
                <span className="text-xs font-bold text-primary bg-primary-fixed/30 px-3 py-1 rounded-full uppercase">No horário</span>
              </div>
              <p className="text-sm text-on-surface-variant">Dose tomada às 08:02 • <span className="font-medium">Prescrito: 08:00</span></p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant opacity-30">chevron_right</span>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-5 flex items-center gap-6 hover:bg-surface-container-high transition-all group cursor-pointer">
            <div className="w-14 h-14 rounded-full bg-error/10 flex items-center justify-center text-error group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">error</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-lg text-on-surface">Vitamina D3</h3>
                <span className="text-xs font-bold text-error bg-error-container/30 px-3 py-1 rounded-full uppercase">Perdida</span>
              </div>
              <p className="text-sm text-on-surface-variant">Nenhuma ação registrada • <span className="font-medium">Agendado: 12:00</span></p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant opacity-30">chevron_right</span>
          </div>

          <div className="flex items-center gap-4 my-8">
            <div className="h-px flex-1 bg-outline-variant/20"></div>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Ontem, 23 de Maio</span>
            <div className="h-px flex-1 bg-outline-variant/20"></div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-5 flex items-center gap-6 hover:bg-surface-container-high transition-all group cursor-pointer">
            <div className="w-14 h-14 rounded-full bg-tertiary-container/20 flex items-center justify-center text-on-tertiary-container group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">schedule</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-lg text-on-surface">Metformina 500mg</h3>
                <span className="text-xs font-bold text-on-tertiary-container bg-tertiary-fixed/40 px-3 py-1 rounded-full uppercase">Atrasada</span>
              </div>
              <p className="text-sm text-on-surface-variant">Tomada às 21:45 • <span className="font-medium">Prescrito: 20:00</span></p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant opacity-30">chevron_right</span>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-5 flex items-center gap-6 hover:bg-surface-container-high transition-all group cursor-pointer">
            <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">inventory_2</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-lg text-on-surface">Estoque Atualizado</h3>
                <span className="text-xs font-bold text-on-secondary-container bg-secondary-fixed/50 px-3 py-1 rounded-full uppercase">Reposição</span>
              </div>
              <p className="text-sm text-on-surface-variant">Adicionado 30 comprimidos de <span className="font-medium">Losartana Potássica</span></p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant opacity-30">chevron_right</span>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-5 flex items-center gap-6 hover:bg-surface-container-high transition-all group cursor-pointer">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-lg text-on-surface">Omega 3</h3>
                <span className="text-xs font-bold text-primary bg-primary-fixed/30 px-3 py-1 rounded-full uppercase">No horário</span>
              </div>
              <p className="text-sm text-on-surface-variant">Dose tomada às 12:05 • <span className="font-medium">Prescrito: 12:00</span></p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant opacity-30">chevron_right</span>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-primary p-8 rounded-[2rem] text-on-primary ambient-shadow relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-container/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <span className="material-symbols-outlined text-4xl mb-6">description</span>
              <h3 className="text-2xl font-bold mb-3 leading-tight">Relatório de Adesão</h3>
              <p className="text-primary-fixed/80 text-sm mb-8 leading-relaxed">Gere um documento PDF completo com seus dados de medicação para levar na sua próxima consulta médica.</p>
              <button className="w-full py-4 bg-primary-container text-on-primary-container font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
                <span className="material-symbols-outlined">download</span>
                Baixar PDF (Maio)
              </button>
            </div>
          </div>

          <div className="bg-surface-container-low p-6 rounded-[2rem]">
            <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-6">Resumo Mensal</h4>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-3xl font-extrabold text-primary">92%</p>
                  <p className="text-xs font-medium text-on-surface-variant">Adesão Total</p>
                </div>
                <div className="w-24 h-1.5 bg-outline-variant/20 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[92%]"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-lowest p-4 rounded-2xl">
                  <p className="text-xl font-bold text-on-surface">124</p>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase">Doses Tomadas</p>
                </div>
                <div className="bg-surface-container-lowest p-4 rounded-2xl">
                  <p className="text-xl font-bold text-error">3</p>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase">Doses Perdidas</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden relative h-48 group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBX8vGXHl58IcNNBuAdvAYwZpB2oLAv54UnJ1iCLKnSRxL0UgB3kjsxHtQutyuioyujdmECkErTU9EXydK332slC-c6qEf_l78wgEFVdp_aIgPBz69nrSBMy6bgvFtiRU46YApARydz-FkZb9wklU5JEwlx6nrXWpCjGcB5FQhT_BkbLjAXTFS2W6-R-GHu_n0iCwc1WyBKI8HTWpQfDAq8pxDnjjTRYiX4d57XVU75EH7jDIDCVcVN7ARgXcjX4J4ukwqp_Hyji_Mk"
              alt="Cuidado"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-6">
              <p className="text-white font-medium text-sm">"A consistência é o primeiro passo para o bem-estar duradouro."</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default History;