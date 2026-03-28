import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { familyApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SideNav = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    name: '',
    birth_date: '',
    relationship: 'Filho(a)',
    gender: 'Outro',
    avatar: null
  });

  const loadFamily = async () => {
    try {
      const data = await familyApi.list();
      setFamilyMembers(data);
    } catch (err) {
      console.error('Erro ao carregar família:', err);
    }
  };

  useEffect(() => {
    if (user) loadFamily();
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, avatar: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('relationship', form.relationship);
      formData.append('birth_date', form.birth_date);
      formData.append('gender', form.gender);
      if (form.avatar) formData.append('avatar', form.avatar);

      await familyApi.create(formData);
      setShowModal(false);
      setForm({ name: '', birth_date: '', relationship: 'Filho(a)', gender: 'Outro', avatar: null });
      setPreview(null);
      loadFamily();
    } catch (err) {
      alert('Erro ao adicionar membro: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { to: '/dashboard', icon: 'dashboard', label: 'Painel' },
    { to: '/inventory', icon: 'medical_services', label: 'Medicamentos' },
    { to: '/agenda', icon: 'event_note', label: 'Agenda' },
    { to: '/history', icon: 'history', label: 'Histórico' },
    { to: '/settings', icon: 'settings', label: 'Configurações' },
  ];

  const sidebarClasses = `h-screen w-72 md:w-64 fixed left-0 top-0 overflow-y-auto bg-surface-container-low flex flex-col py-8 gap-6 z-[40] border-r border-outline-variant/10 shadow-2xl transition-all duration-300 md:translate-x-0 ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  }`;

  return (
    <>
      <aside className={sidebarClasses}>
        <div className="px-7 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-on-surface tracking-tighter bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Eu me cuido</h1>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest opacity-60">Health Concierge</p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-high text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Family Profile Switcher */}
        <div className="px-7 space-y-4">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-50">Sua Rede de Cuidado</p>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide flex-nowrap">
            {familyMembers.map((m) => (
              <div key={m.id} className="relative group shrink-0">
                <div className={`w-9 h-9 rounded-full overflow-hidden ring-2 ${m.is_self ? 'ring-primary' : 'ring-outline-variant'} ring-offset-2 ring-offset-surface-container-low transition-all bg-surface-container-high flex items-center justify-center`}>
                  {m.avatar_url ? (
                    <img src={m.avatar_url} alt={m.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-on-surface-variant text-base">person</span>
                  )}
                </div>
                {m.is_self && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-surface-container-low"></span>}
              </div>
            ))}

            <button
              onClick={() => setShowModal(true)}
              className="w-9 h-9 shrink-0 rounded-full bg-surface-container-high border border-dashed border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest hover:border-primary hover:text-primary transition-all active:scale-90"
            >
              <span className="material-symbols-outlined text-base">add</span>
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-5 py-3.5 rounded-2xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-xl shadow-primary/20'
                    : 'text-on-surface-variant hover:bg-surface-container-highest/60'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`material-symbols-outlined text-2xl transition-transform group-hover:scale-110 ${isActive ? 'text-on-primary' : 'text-primary'}`}
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  <span className={`text-[13px] tracking-tight ${isActive ? 'font-bold underline decoration-2 underline-offset-4' : 'font-medium'}`}>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 mt-auto">
          <div className="bg-surface-container-high p-4 rounded-3xl mb-4 border border-outline-variant/5">
            <h4 className="text-[10px] font-black uppercase text-primary/60 tracking-widest mb-2">Suporte 24/7</h4>
            <p className="text-[11px] text-on-surface-variant/80 font-medium leading-relaxed">Sua jornada de saúde é nossa prioridade absoluta.</p>
          </div>
          <button 
            onClick={() => { navigate('/inventory?new=true'); setIsOpen(false); }}
            className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-xl">add_circle</span>
            <span className="text-xs uppercase tracking-widest">Adicionar</span>
          </button>
        </div>
      </aside>

      {/* Modal Novo Membro */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-surface-container-lowest rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 sm:p-10 border border-outline-variant/15 flex flex-col gap-6 scale-95 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-on-surface tracking-tighter">Novo Membro</h3>
                <p className="text-[11px] uppercase font-bold text-on-surface-variant tracking-widest mt-1">Sua rede de cuidado</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-all text-on-surface-variant active:scale-90">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-input').click()}>
                  <div className="w-28 h-28 rounded-full bg-surface-container-high border-4 border-surface ring-4 ring-primary/10 overflow-hidden flex items-center justify-center transition-all group-hover:scale-105 group-hover:ring-primary/20">
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant/20">add_a_photo</span>
                    )}
                  </div>
                  <div className="absolute inset-2 bg-on-surface/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
                    <span className="material-symbols-outlined text-white text-3xl">edit</span>
                  </div>
                </div>
                <input id="avatar-input" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Foto de Perfil</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5 px-1">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.1em] ml-1">Nome Completo</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Ex: Dra. Ana Paula"
                    className="w-full bg-surface-container-high/60 border-none rounded-2xl px-6 py-4 text-on-surface font-medium placeholder:opacity-30 focus:ring-4 focus:ring-primary/10 hover:bg-surface-container-high transition-all outline-none" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 px-1">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.1em] ml-1">Nascimento</label>
                    <input type="date" required value={form.birth_date} onChange={e => setForm({ ...form, birth_date: e.target.value })}
                      className="w-full bg-surface-container-high/60 border-none rounded-2xl px-6 py-4 text-on-surface font-medium focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
                  </div>
                  <div className="space-y-1.5 px-1">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.1em] ml-1">Gênero</label>
                    <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}
                      className="w-full bg-surface-container-high/60 border-none rounded-2xl px-6 py-4 text-on-surface font-medium focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none">
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 px-1">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.1em] ml-1">Parentesco</label>
                  <select value={form.relationship} onChange={e => setForm({ ...form, relationship: e.target.value })}
                    className="w-full bg-surface-container-high/60 border-none rounded-2xl px-6 py-4 text-on-surface font-medium focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none">
                    <option value="Cônjuge">Cônjuge</option>
                    <option value="Filho(a)">Filho(a)</option>
                    <option value="Pai">Pai</option>
                    <option value="Mãe">Mãe</option>
                    <option value="Avô/Avó">Avô/Avó</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-4.5 rounded-2xl border border-outline-variant text-[13px] font-black uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-low transition-all active:scale-95">
                  Fecar
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-4.5 rounded-2xl bg-primary text-on-primary text-[13px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50">
                  {loading ? 'Sincronizando' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SideNav;