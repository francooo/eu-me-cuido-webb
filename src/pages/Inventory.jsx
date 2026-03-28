import React, { useState, useEffect } from 'react';
import { medicationsApi, familyApi, aiApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Modal de Insights da IA
const AiInsightsModal = ({ isOpen, onClose, summary, medName, loading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div className="bg-surface-container-lowest rounded-[2.5rem] shadow-2xl w-full max-w-lg p-8 sm:p-10 border border-primary/20 flex flex-col gap-6 scale-95 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <span className="material-symbols-outlined text-3xl">smart_toy</span>
            </div>
            <div>
              <h3 className="text-2xl font-black text-on-surface tracking-tighter">AI Insight</h3>
              <p className="text-[11px] uppercase font-bold text-primary tracking-widest mt-1">{medName}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-all text-on-surface-variant">
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 min-h-[200px] flex flex-col">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 py-10">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-primary font-bold text-sm animate-pulse tracking-wide">Analisando medicamento...</p>
            </div>
          ) : (
            <div className="prose prose-sm prose-primary max-w-none prose-p:text-on-surface-variant prose-p:leading-relaxed prose-headings:text-on-surface prose-headings:font-black">
              <div className="text-on-surface-variant whitespace-pre-line leading-relaxed text-sm font-medium">
                {summary}
              </div>
            </div>
          )}
        </div>

        {!loading && (
          <button onClick={onClose} className="w-full py-4 rounded-2xl bg-primary text-on-primary text-[13px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-95">
            Entendido
          </button>
        )}
      </div>
    </div>
  );
};

const ICONS = ['pill', 'vaccines', 'medication'];

const Inventory = () => {
  const { user, selectedMember: globalMember } = useAuth();
  const [medications, setMedications] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMed, setEditMed] = useState(null);
  const [form, setForm] = useState({
    name: '', dosage: '', frequency: 'daily',
    stock_quantity: 30, stock_total: 30,
    icon: 'pill', scheduled_time: '', instructions: '',
    family_member_id: ''
  });
  const [saving, setSaving] = useState(false);
  const [aiInsight, setAiInsight] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [currentMedName, setCurrentMedName] = useState('');

  const handleAiSummary = async (med) => {
    setCurrentMedName(med.name);
    setShowAiModal(true);
    setAiLoading(true);
    try {
      const { summary } = await aiApi.getMedicationSummary({
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        instructions: med.instructions
      });
      setAiInsight(summary);
    } catch (err) {
      setAiInsight('❌ Não foi possível gerar o resumo agora. Tente novamente mais tarde.');
    } finally {
      setAiLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const params = globalMember ? { family_member_id: globalMember.id } : {};
      const [meds, family] = await Promise.all([
        medicationsApi.list(params),
        familyApi.list(),
      ]);
      setMedications(meds);
      setFamilyMembers(family);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (user) loadData(); 
  }, [user, globalMember]);

  const openModal = (med = null) => {
    if (med) {
      setForm({
        name: med.name, dosage: med.dosage || '',
        frequency: med.frequency || 'daily',
        stock_quantity: med.stock_quantity, stock_total: med.stock_total,
        icon: med.icon || 'pill', scheduled_time: med.next_dose_time?.slice(0, 5) || '',
        instructions: med.instructions || '', family_member_id: med.family_member_id || '',
      });
      setEditMed(med);
    } else {
      setForm({ 
        name: '', dosage: '', frequency: 'daily', stock_quantity: 30, stock_total: 30, icon: 'pill', scheduled_time: '', instructions: '', 
        family_member_id: globalMember?.id || familyMembers[0]?.id || '' 
      });
      setEditMed(null);
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editMed) {
        await medicationsApi.update(editMed.id, form);
      } else {
        await medicationsApi.create(form);
      }
      setShowModal(false);
      await loadData();
    } catch (err) {
      alert('Erro ao salvar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja remover este medicamento?')) return;
    try {
      await medicationsApi.remove(id);
      await loadData();
    } catch (err) {
      alert('Erro ao remover: ' + err.message);
    }
  };

  const criticalCount = medications.filter(m => m.stock_quantity < m.stock_total * 0.2).length;
  const nextDose = medications.reduce((acc, m) => {
    if (!acc && m.next_dose_time) return m;
    return acc;
  }, null);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] gap-4 flex-col">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-on-surface-variant text-sm">Carregando inventário...</p>
    </div>
  );

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tighter">Inventário</h2>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] opacity-50 mt-1">
            {globalMember ? `Medicamentos de ${globalMember.name}` : 'Todos os medicamentos'}
          </p>
        </div>
        <button onClick={() => openModal()} className="px-6 py-3.5 bg-primary text-on-primary rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">add</span>
          Novo Medicamento
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-xl flex flex-col gap-2 shadow-sm border border-primary/5">
          <span className="text-outline text-[10px] font-extrabold uppercase tracking-widest">Total de Itens</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-on-surface">{medications.length}</span>
            <span className="text-primary font-bold text-sm">medicamentos</span>
          </div>
        </div>
        <div className={`${criticalCount > 0 ? 'bg-[#ffdad6]' : 'bg-secondary-container/20'} p-6 rounded-xl flex flex-col gap-2 shadow-sm`}>
          <span className={`text-[10px] font-extrabold uppercase tracking-widest ${criticalCount > 0 ? 'text-on-error-container' : 'text-on-surface-variant'}`}>Estoque Crítico</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-extrabold ${criticalCount > 0 ? 'text-on-error-container' : 'text-on-surface'}`}>{String(criticalCount).padStart(2, '0')}</span>
            <span className={`font-semibold text-sm ${criticalCount > 0 ? 'text-on-error-container/70' : 'text-on-surface-variant'}`}>{criticalCount > 0 ? 'Requer atenção' : 'Tudo OK'}</span>
          </div>
        </div>
        <div className="bg-primary-fixed p-6 rounded-xl flex flex-col gap-2 shadow-sm">
          <span className="text-on-primary-fixed-variant text-[10px] font-extrabold uppercase tracking-widest">Próxima Dose</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-on-primary-fixed-variant">{nextDose?.next_dose_time?.slice(0, 5) || '--:--'}</span>
            <span className="text-on-primary-fixed-variant/70 font-semibold text-sm truncate">{nextDose?.name || 'Sem dose agendada'}</span>
          </div>
        </div>
      </div>

      {/* Medication List */}
      {error && <p className="text-error text-sm mb-4">{error}</p>}
      <div className="space-y-4">
        {medications.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-lowest rounded-xl border border-outline-variant/15">
            <span className="material-symbols-outlined text-5xl text-outline mb-4">inventory_2</span>
            <h4 className="font-bold text-on-surface mb-2">Nenhum medicamento cadastrado</h4>
            <p className="text-on-surface-variant text-sm mb-6">Adicione seus medicamentos para começar o controle.</p>
            <button onClick={() => openModal()} className="px-6 py-3 bg-primary text-on-primary rounded-full font-bold text-sm shadow-md">
              Adicionar Primeiro Medicamento
            </button>
          </div>
        ) : medications.map((med) => {
          const pct = med.stock_total > 0 ? Math.round((med.stock_quantity / med.stock_total) * 100) : 0;
          const isCritical = pct < 20;
          return (
            <div key={med.id} className="bg-surface-container-lowest p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:translate-x-1 transition-transform duration-200 shadow-sm border border-outline-variant/10">
              <div className="flex items-center gap-5 flex-1">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${isCritical ? 'bg-error-container text-on-error-container' : 'bg-surface-container-low text-primary'}`}>
                  <span className="material-symbols-outlined text-3xl">{med.icon || 'pill'}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface">{med.name}</h3>
                  <p className="text-on-surface-variant text-sm font-medium">{med.dosage} • {med.frequency}</p>
                  {med.family_member_name && <p className="text-xs text-primary font-medium mt-0.5">{med.family_member_name}</p>}
                </div>
              </div>
              <div className="flex flex-wrap md:flex-nowrap items-center gap-8 flex-[2]">
                {med.next_dose_time && (
                  <div className="flex flex-col">
                    <span className="text-[10px] text-outline font-extrabold uppercase tracking-widest mb-1">Próxima Dose</span>
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      {med.next_dose_time?.slice(0, 5)} (Hoje)
                    </div>
                  </div>
                )}
                <div className="flex flex-col min-w-[120px]">
                  <span className="text-[10px] text-outline font-extrabold uppercase tracking-widest mb-1">Estoque Restante</span>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-24 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className={`h-full ${isCritical ? 'bg-error' : 'bg-primary'}`} style={{ width: `${pct}%` }}></div>
                    </div>
                    <span className={`text-sm font-bold ${isCritical ? 'text-error' : 'text-on-surface'}`}>{med.stock_quantity} un.</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 text-[10px] font-extrabold rounded-full uppercase ${isCritical ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'}`}>
                    {isCritical ? 'Estoque Baixo' : 'Estoque OK'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleAiSummary(med)}
                  title="Resumo da IA"
                  className="p-2.5 bg-primary/5 text-primary rounded-xl hover:bg-primary/10 transition-all group"
                >
                  <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">smart_toy</span>
                </button>
                <button onClick={() => openModal(med)} className="p-2 text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined">edit</span></button>
                <button onClick={() => handleDelete(med.id)} className="p-2 text-outline hover:text-error transition-colors"><span className="material-symbols-outlined">delete</span></button>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Insights Modal */}
      <AiInsightsModal 
        isOpen={showAiModal} 
        onClose={() => setShowAiModal(false)} 
        summary={aiInsight} 
        medName={currentMedName} 
        loading={aiLoading} 
      />

      {/* Modal de Adicionar/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-on-surface">{editMed ? 'Editar Medicamento' : 'Novo Medicamento'}</h3>
              <button onClick={() => setShowModal(false)} className="text-outline hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-on-surface-variant mb-1 block">Nome do Medicamento *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Ex: Amoxicilina 500mg"
                    className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/40 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant mb-1 block">Dosagem</label>
                  <input value={form.dosage} onChange={e => setForm({ ...form, dosage: e.target.value })}
                    placeholder="Ex: 500mg"
                    className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/40 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant mb-1 block">Frequência</label>
                  <select value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })}
                    className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/40 outline-none">
                    <option value="daily">Diário</option>
                    <option value="twice_daily">2x ao dia</option>
                    <option value="three_times">3x ao dia</option>
                    <option value="weekly">Semanal</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant mb-1 block">Quantidade em Estoque</label>
                  <input type="number" min="0" value={form.stock_quantity} onChange={e => setForm({ ...form, stock_quantity: parseInt(e.target.value) })}
                    className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/40 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant mb-1 block">Total da Embalagem</label>
                  <input type="number" min="1" value={form.stock_total} onChange={e => setForm({ ...form, stock_total: parseInt(e.target.value) })}
                    className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/40 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant mb-1 block">Horário da Dose</label>
                  <input type="time" value={form.scheduled_time} onChange={e => setForm({ ...form, scheduled_time: e.target.value })}
                    className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/40 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant mb-1 block">Ícone</label>
                  <select value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })}
                    className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/40 outline-none">
                    <option value="pill">Comprimido</option>
                    <option value="vaccines">Injeção/Cápsula</option>
                    <option value="medication">Medicamento</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-on-surface-variant mb-1 block">Instruções de Uso (Ex: Tomar em jejum)</label>
                  <textarea value={form.instructions} onChange={e => setForm({ ...form, instructions: e.target.value })}
                    placeholder="Ex: Não mastigar, tomar com bastante água..."
                    rows="2"
                    className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/40 outline-none resize-none" />
                </div>
                {familyMembers.length > 1 && (
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-on-surface-variant mb-1 block">Para quem?</label>
                    <select value={form.family_member_id} onChange={e => setForm({ ...form, family_member_id: e.target.value })}
                      className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/40 outline-none">
                      {familyMembers.map(m => <option key={m.id} value={m.id}>{m.name}{m.is_self ? ' (Eu)' : ''}</option>)}
                    </select>
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-on-surface-variant font-semibold hover:bg-surface-container-low transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-60">
                  {saving ? 'Salvando...' : editMed ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Inventory;