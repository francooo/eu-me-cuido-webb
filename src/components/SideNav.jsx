import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { familyApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SideNav = ({ isOpen, setIsOpen }) => {
  const { user, selectedMember, setSelectedMember, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    name: '',
    birth_date: '',
    relation: 'Filho(a)',
    gender: 'Outro',
    avatar: null
  });

  const loadFamily = async () => {
    try {
      const data = await familyApi.list();
      setFamilyMembers(data);
      if (!selectedMember && data.length > 0) {
        const selfMember = data.find(m => m.is_self) || data[0];
        setSelectedMember(selfMember);
      }
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
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('relation', form.relation);
      formData.append('birth_date', form.birth_date);
      formData.append('gender', form.gender);
      if (form.avatar) formData.append('avatar', form.avatar);

      await familyApi.create(formData);
      setShowModal(false);
      setForm({ name: '', birth_date: '', relation: 'Filho(a)', gender: 'Outro', avatar: null });
      setPreview(null);
      loadFamily();
    } catch (err) {
      setError(err.message || 'Erro ao adicionar membro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMember = (m) => {
    setSelectedMember(m);
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

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <>
      <aside className={sidebarClasses}>
        <div className="flex flex-col gap-1 mb-10 px-8">
          <h1 className="text-2xl font-black text-primary tracking-tighter leading-none">Eu me cuido</h1>
          <p className="text-[10px] font-black text-outline-variant uppercase tracking-[0.3em]">Health Concierge</p>
        </div>

        {/* Global Profile Switcher */}
        <div className="px-8 mb-8 overflow-hidden">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-50 mb-4">Sua Rede de Cuidado</p>
          <div className="flex items-center gap-4 overflow-x-auto pb-4 custom-scrollbar">
            {familyMembers.map((m) => {
              const isActive = selectedMember?.id === m.id;
              return (
                <button 
                  key={m.id} 
                  title={m.name} 
                  onClick={() => handleSelectMember(m)}
                  className="relative group shrink-0 flex-none"
                >
                  <div className={`
                    w-16 h-16 rounded-full border-2 transition-all duration-500 flex items-center justify-center p-1
                    ${isActive ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-transparent bg-surface-container-high'}
                  `}>
                    <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-surface-container-low shadow-inner">
                      {m.avatar_url ? (
                        <img src={m.avatar_url} alt={m.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-on-surface-variant text-2xl">person</span>
                      )}
                    </div>
                  </div>
                  
                  {m.is_self && !isActive && (
                    <span className="absolute bottom-0 -right-0.5 w-4 h-4 bg-primary rounded-full border-2 border-surface-container-low shadow-sm z-10 transition-transform group-hover:scale-110"></span>
                  )}
                  
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-xl ring-2 ring-surface z-20 animate-in zoom-in-50 duration-300">
                      <span className="material-symbols-outlined text-[14px] font-black">check</span>
                    </div>
                  )}
                </button>
              );
            })}

            <button
              onClick={() => { setShowModal(true); setError(''); }}
              className="w-16 h-16 shrink-0 flex-none rounded-full bg-surface-container-high border-2 border-dashed border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest hover:border-primary hover:text-primary transition-all active:scale-90"
            >
              <span className="material-symbols-outlined text-xl">add</span>
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'premium-gradient text-white shadow-xl shadow-primary/20 scale-105 z-10' 
                    : 'text-on-surface-variant hover:bg-white/50 hover:text-primary'
                }`}
              >
                <span className={`material-symbols-outlined text-2xl transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:rotate-12'}`}>
                  {item.icon}
                </span>
                <span className="font-headline text-sm font-bold tracking-tight">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-6 mt-auto space-y-2 pt-6 border-t border-outline-variant/10">
          <button className="w-full premium-gradient text-white font-bold py-4 px-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] mb-4 shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95">
            Agendar Consulta
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-error transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            <span>Sair da Conta</span>
          </button>
        </div>
      </aside>

      {/* Modal Novo Membro */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-surface-container-lowest rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 sm:p-10 border border-outline-variant/15 flex flex-col gap-6 scale-95 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-on-surface tracking-tighter">Novo Membro</h3>
                <p className="text-[11px] uppercase font-bold text-on-surface-variant tracking-widest mt-1">Sua rede de cuidado</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-all text-on-surface-variant active:scale-90">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {error && (
              <div className="p-4 bg-error-container text-on-error-container rounded-2xl text-[12px] font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}

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
                  <select value={form.relation} onChange={e => setForm({ ...form, relation: e.target.value })}
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
                  className="flex-1 py-4 px-4 rounded-2xl border border-outline-variant text-[13px] font-black uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-low transition-all active:scale-95">
                  Fechar
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-4 px-4 rounded-2xl bg-primary text-on-primary text-[13px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50">
                  {loading ? 'Salvando...' : 'Salvar'}
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