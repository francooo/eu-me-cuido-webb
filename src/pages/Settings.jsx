import React from 'react';

const Settings = () => {
  return (
    <div className="pb-32 sm:pb-12">
      <header className="max-w-5xl mx-auto mb-10 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-black text-on-surface tracking-tighter mb-2">Configurações do Sistema</h1>
        <p className="text-on-surface-variant text-sm sm:text-lg font-medium opacity-60 italic">Personalize sua experiência de cuidado e conectividade.</p>
      </header>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

          {/* Section: Integração WhatsApp */}
          <section className="bg-surface-container-lowest p-6 sm:p-10 rounded-[2rem] border border-outline-variant/15 shadow-sm hover:shadow-lg transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-secondary-container flex items-center justify-center rounded-2xl ring-4 ring-secondary/10">
                <span className="material-symbols-outlined text-on-secondary-container text-2xl font-bold">chat</span>
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight">Integração WhatsApp</h2>
                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Sincronização Ativa</span>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="group">
                <label className="block text-[11px] font-black uppercase text-on-surface-variant mb-2 tracking-wider ml-1">Chave da API</label>
                <div className="relative">
                  <input type="password" value="••••••••••••••••" readOnly className="w-full bg-surface-container-high border-none rounded-2xl px-5 h-14 text-on-surface font-medium focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-primary transition-colors h-10 w-10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">visibility_off</span>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-[11px] font-black uppercase text-on-surface-variant mb-2 tracking-wider ml-1">Número de Telefone</label>
                <input type="text" defaultValue="(11) 98765-4321" className="w-full bg-surface-container-high border-none rounded-2xl px-5 h-14 text-on-surface font-medium focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
              </div>
              
              <div className="pt-2">
                <button className="w-full sm:w-auto h-12 flex items-center justify-center gap-3 bg-primary/10 text-primary font-black uppercase text-[11px] tracking-widest px-8 rounded-full hover:bg-primary transition-all hover:text-white active:scale-95 shadow-sm">
                  <span className="material-symbols-outlined text-base">sync</span>
                  Testar Conexão
                </button>
              </div>
            </div>
          </section>

          {/* Section: Preferências de Notificação */}
          <section className="bg-surface-container-lowest p-6 sm:p-10 rounded-[2rem] border border-outline-variant/15 shadow-sm flex flex-col">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-primary-fixed flex items-center justify-center rounded-2xl ring-4 ring-primary/10">
                <span className="material-symbols-outlined text-primary text-2xl font-bold">notifications</span>
              </div>
              <h2 className="text-lg font-black tracking-tight">Notificações</h2>
            </div>

            <div className="space-y-7 flex-1">
              {[
                { label: 'Lembretes de Medicação', sub: 'Alertas automáticos em tempo real', checked: true },
                { label: 'Relatórios Semanais', sub: 'Resumo de adesão detalhado', checked: false },
                { label: 'Alertas de Estoque', sub: 'Notificar quando houver poucas unidades', checked: true }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer">
                  <div className="flex-1">
                    <p className="font-bold text-on-surface group-hover:text-primary transition-colors">{item.label}</p>
                    <p className="text-[11px] font-medium text-on-surface-variant opacity-60 leading-tight">{item.sub}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 h-11 w-11 justify-end">
                    <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                    <div className="w-12 h-7 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[1.35rem] after:w-[1.35rem] after:transition-all peer-checked:bg-primary border-2 border-transparent transition-all"></div>
                  </label>
                </div>
              ))}

              {/* Quiet Hours */}
              <div className="pt-8 border-t border-outline-variant/10">
                <p className="text-[11px] font-black uppercase text-on-surface-variant mb-4 flex items-center gap-2 opacity-50">
                  <span className="material-symbols-outlined text-sm">do_not_disturb_on</span>
                  Intervalo de Silêncio
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] uppercase tracking-widest font-black text-on-surface-variant/40 mb-1.5 block ml-1">Início</label>
                    <input type="time" defaultValue="22:00" className="w-full bg-surface-container-high border-none rounded-2xl px-4 h-12 text-on-surface font-black text-sm transition-all outline-none hover:ring-2 hover:ring-primary/10" />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-widest font-black text-on-surface-variant/40 mb-1.5 block ml-1">Fim</label>
                    <input type="time" defaultValue="07:00" className="w-full bg-surface-container-high border-none rounded-2xl px-4 h-12 text-on-surface font-black text-sm transition-all outline-none hover:ring-2 hover:ring-primary/10" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Perfil Curador */}
          <section className="bg-surface-container-lowest p-6 sm:p-10 rounded-[2rem] border border-outline-variant/15 md:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface-container-high flex items-center justify-center rounded-2xl group transition-all">
                  <span className="material-symbols-outlined text-primary text-2xl font-bold group-hover:scale-110">shield_person</span>
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tight">Perfil de Curador</h2>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/30 italic">Administrador do Sistema</span>
                </div>
              </div>
              <div className="flex -space-x-3 hover:space-x-1 transition-all">
                {[1,2,3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-surface bg-surface-container-high flex items-center justify-center text-on-surface-variant/40 hover:z-10 cursor-pointer">
                    <span className="material-symbols-outlined text-sm">person</span>
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-surface bg-primary/10 flex items-center justify-center text-primary font-black text-[10px] cursor-pointer">+3</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1 px-1">
                <label className="block text-[11px] font-black uppercase text-on-surface-variant mb-1 ml-1 tracking-wider opacity-60">Nome Completo</label>
                <input type="text" defaultValue="Ricardo Souza" className="w-full bg-surface-container-high/40 border-none rounded-2xl px-6 h-14 text-on-surface font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
              </div>
              <div className="space-y-1 px-1">
                <label className="block text-[11px] font-black uppercase text-on-surface-variant mb-1 ml-1 tracking-wider opacity-60">E-mail de Acesso</label>
                <input type="email" defaultValue="ricardo.souza@eumecuido.com" className="w-full bg-surface-container-high/40 border-none rounded-2xl px-6 h-14 text-on-surface font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* FIXED Bottom Bar for Mobile (Problem 4.3) */}
      <div className="md:hidden fixed bottom-[72px] left-0 right-0 p-4 bg-gradient-to-t from-surface to-transparent pointer-events-none pb-12">
        <button className="w-full h-16 bg-gradient-to-br from-primary to-primary-container text-on-primary font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 pointer-events-auto active:scale-95 transition-all">
          <span className="material-symbols-outlined font-bold">save</span>
          Salvar Alterações
        </button>
      </div>

      {/* Desktop Save Button */}
      <div className="hidden md:flex max-w-5xl mx-auto mt-12 justify-center">
        <button className="px-16 py-6 rounded-3xl bg-on-surface text-surface font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
          <span className="material-symbols-outlined font-bold">save</span>
          Sincronizar dados do Sistema
        </button>
      </div>
    </div>
  );
};

export default Settings;