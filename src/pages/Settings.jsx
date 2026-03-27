import React from 'react';

const Settings = () => {
  return (
    <>
      <header className="max-w-5xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">Configurações do Sistema</h1>
        <p className="text-on-surface-variant text-lg">Gerencie integrações, preferências de notificação e seu perfil de curador.</p>
      </header>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Bento Grid Section: WhatsApp & Profile */}
        <div className="lg:col-span-7 space-y-8">

          {/* Section: Integração WhatsApp */}
          <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-6xl">chat</span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-secondary-container flex items-center justify-center rounded-lg">
                <span className="material-symbols-outlined text-on-secondary-container">chat</span>
              </div>
              <h2 className="text-xl font-bold">Integração WhatsApp</h2>
            </div>
            <div className="space-y-5">
              <div className="group">
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Chave da API do WhatsApp</label>
                <div className="relative">
                  <input type="password" value="••••••••••••••••" readOnly className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all outline-none" />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                    <span className="material-symbols-outlined">visibility_off</span>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Número de Telefone</label>
                <input type="text" defaultValue="(11) 98765-4321" className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all outline-none" />
              </div>
              <div className="pt-2">
                <button className="flex items-center justify-center gap-2 bg-surface-container-high text-primary font-bold px-6 py-3 rounded-full hover:bg-primary-fixed transition-all active:scale-95">
                  <span className="material-symbols-outlined">sync</span>
                  Testar Conexão
                </button>
              </div>
            </div>
          </section>

          {/* Section: Perfil do Administrador */}
          <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-surface-container-high flex items-center justify-center rounded-lg">
                <span className="material-symbols-outlined text-primary">person</span>
              </div>
              <h2 className="text-xl font-bold">Perfil do Administrador</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Nome Completo</label>
                <input type="text" defaultValue="Dr. Ricardo Souza" className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">E-mail</label>
                <input type="email" defaultValue="ricardo.souza@eumecuido.com.br" className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all outline-none" />
              </div>
            </div>
          </section>

        </div>

        {/* Bento Grid Section: Notifications & Actions */}
        <div className="lg:col-span-5 space-y-8">

          {/* Section: Preferências de Notificação */}
          <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm h-fit">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary-fixed flex items-center justify-center rounded-lg">
                <span className="material-symbols-outlined text-primary">notifications</span>
              </div>
              <h2 className="text-xl font-bold">Preferências de Notificação</h2>
            </div>

            <div className="space-y-6">
              {/* Custom Toggles */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-on-surface">Lembretes de Medicamentos</p>
                  <p className="text-xs text-on-surface-variant">Alertas automáticos para pacientes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-on-surface">Alertas de Estoque Baixo</p>
                  <p className="text-xs text-on-surface-variant">Notificar quando as doses acabarem</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-on-surface">Relatórios Semanais</p>
                  <p className="text-xs text-on-surface-variant">Resumo de adesão terapêutica</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>

              {/* Quiet Hours */}
              <div className="pt-4 border-t border-surface-variant/30">
                <p className="font-semibold text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">do_not_disturb_on</span>
                  Horário de Silêncio
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1 block">Das</label>
                    <input type="time" defaultValue="22:00" className="w-full bg-surface-container-highest border-none rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1 block">Até as</label>
                    <input type="time" defaultValue="07:00" className="w-full bg-surface-container-highest border-none rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all outline-none" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Save Action */}
          <div className="flex flex-col gap-4">
            <button className="w-full py-5 rounded-full bg-gradient-to-r from-secondary to-secondary-fixed-dim text-white font-bold text-lg shadow-lg shadow-secondary/20 hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3">
              <span className="material-symbols-outlined">save</span>
              Salvar Alterações
            </button>
            <p className="text-center text-xs text-on-surface-variant italic px-4">
              Ao salvar, as alterações serão aplicadas instantaneamente a todos os dispositivos conectados.
            </p>
          </div>

        </div>
      </div>

      {/* Decorative Background Element */}
      <div className="fixed bottom-0 right-0 -z-10 w-1/3 h-1/3 opacity-5 pointer-events-none overflow-hidden">
        <span className="material-symbols-outlined text-[300px] translate-x-1/4 translate-y-1/4">medical_information</span>
      </div>
    </>
  );
};

export default Settings;