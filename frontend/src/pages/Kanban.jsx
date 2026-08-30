import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockLeads } from '../data/mockData';
import { Star, Clock, ShieldAlert, Zap, Settings2, DollarSign, X, Edit2, Check } from 'lucide-react';
import { apiFetch } from '../utils/api';

const StatusLegend = () => (
  <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap', padding: '10px 0' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'var(--color-accent-green)' }}></div>
      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Atendimento Pronto</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'var(--color-accent-cyan)' }}></div>
      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>IA Conversando</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'var(--color-accent-green)', opacity: 0.6 }}></div>
      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Agendamento</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}></div>
      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Outros Estágios</span>
    </div>
  </div>
);

const Kanban = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const funnelIdParam = searchParams.get('funnel_id');

  const [isManualMode, setIsManualMode] = useState(false);
  const [leads, setLeads] = useState([]);
  const [funnels, setFunnels] = useState([]);
  const [selectedFunnel, setSelectedFunnel] = useState(funnelIdParam || null);
  const [loading, setLoading] = useState(true);
  const [billingLead, setBillingLead] = useState(null);
  const [billingForm, setBillingForm] = useState({ description: '', amount: '' });
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingError, setBillingError] = useState('');
  const [billingResult, setBillingResult] = useState(null);

  const [isEditingFunnel, setIsEditingFunnel] = useState(false);
  const [editingFunnelName, setEditingFunnelName] = useState('');
  const [savingFunnel, setSavingFunnel] = useState(false);
  
  const columns = ['Início de Atendimento', 'Conversando', 'Agendamento', 'Formulário Enviado', 'Follow Up'];

  const fetchFunnels = async () => {
    try {
      const response = await apiFetch('/api/funnels');
      const result = await response.json();
      if (result.success && result.data.length > 0) {
        setFunnels(result.data);
        if (!selectedFunnel) {
          const currentParam = searchParams.get('funnel_id');
          const target = (currentParam && result.data.find(f => f.id === currentParam)) 
            || result.data.find(f => f.is_default) 
            || result.data[0];
          if (target) setSelectedFunnel(target.id);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar funis:", error);
    }
  };

  useEffect(() => {
    fetchFunnels();
    const handleFunnelUpdated = () => fetchFunnels();
    window.addEventListener('funnelUpdated', handleFunnelUpdated);
    return () => window.removeEventListener('funnelUpdated', handleFunnelUpdated);
  }, []);

  useEffect(() => {
    if (funnelIdParam && funnelIdParam !== selectedFunnel) {
      setSelectedFunnel(funnelIdParam);
    }
  }, [funnelIdParam]);

  const handleSelectFunnel = (id) => {
    setSelectedFunnel(id);
    setSearchParams({ funnel_id: id });
  };

  const handleStartEditCurrentFunnel = () => {
    const current = funnels.find(f => f.id === selectedFunnel);
    if (current) {
      setEditingFunnelName(current.name);
      setIsEditingFunnel(true);
    }
  };

  const handleSaveCurrentFunnel = async () => {
    const newName = editingFunnelName.trim();
    if (!newName || !selectedFunnel) {
      setIsEditingFunnel(false);
      return;
    }
    // Atualização otimista
    setFunnels(prev => prev.map(f => f.id === selectedFunnel ? { ...f, name: newName } : f));
    setIsEditingFunnel(false);
    setSavingFunnel(true);
    try {
      const res = await apiFetch(`/api/funnels/${selectedFunnel}`, {
        method: 'PUT',
        body: JSON.stringify({ name: newName })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setFunnels(prev => prev.map(f => (f.id === selectedFunnel || f.id === 'default') ? data.data : f));
        if (data.data.id && data.data.id !== selectedFunnel) {
          setSelectedFunnel(data.data.id);
          setSearchParams({ funnel_id: data.data.id });
        }
        window.dispatchEvent(new CustomEvent('funnelUpdated', { detail: data.data }));
      } else {
        alert(data.error || 'Erro ao renomear funil');
        fetchFunnels();
      }
    } catch (err) {
      console.error('Erro ao salvar funil:', err);
      fetchFunnels();
    } finally {
      setSavingFunnel(false);
    }
  };



  const fetchLeads = async () => {
    try {
      const url = selectedFunnel
        ? `/api/leads?funnel_id=${selectedFunnel}`
        : '/api/leads';
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        setLeads(result.data);
      }
    } catch (error) {
      console.error("Erro ao buscar leads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedFunnel || funnels.length === 0) {
      fetchLeads();
      const interval = setInterval(fetchLeads, 10000); // Atualiza a cada 10s
      return () => clearInterval(interval);
    }
  }, [selectedFunnel, funnels.length]);

  const openBillingModal = (lead) => {
    setBillingLead(lead);
    setBillingForm({ description: '', amount: '' });
    setBillingError('');
    setBillingResult(null);
  };

  const closeBillingModal = () => {
    setBillingLead(null);
    setBillingResult(null);
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (!billingForm.description || !billingForm.amount) return;

    setBillingLoading(true);
    setBillingError('');
    try {
      const response = await apiFetch('/api/billing/invoices', {
        method: 'POST',
        body: JSON.stringify({
          lead_id: billingLead.id,
          description: billingForm.description,
          amount: Number(billingForm.amount)
        })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setBillingError(data.error || 'Erro ao criar fatura.');
        return;
      }
      setBillingResult(data.data);
    } catch (error) {
      setBillingError('Erro ao conectar com o servidor.');
    } finally {
      setBillingLoading(false);
    }
  };

  const onDragStart = (e, leadId) => {
    e.dataTransfer.setData('leadId', leadId);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = async (e, newStatus) => {
    const leadId = e.dataTransfer.getData('leadId');
    
    // Atualização Otimista no UI
    setLeads(leads.map(lead => 
      String(lead.id) === String(leadId) ? { ...lead, pipeline_status: newStatus } : lead
    ));

    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pipeline_status: newStatus })
      });
    } catch (error) {
      console.error("Erro ao atualizar status do lead:", error);
      fetchLeads(); // Reverte se der erro
    }
  };
  
  return (
    <div style={{ paddingRight: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h1 style={{ color: isManualMode ? '#f59e0b' : 'var(--color-accent-green)', marginBottom: '5px', transition: '0.3s' }}>
            Leads {isManualMode && '(MODO MANUAL ATIVO)'}
          </h1>
          <p style={{ opacity: 0.5, fontSize: '0.85rem' }}>
            {isManualMode ? 'As automações estão pausadas. Você tem o controle total.' : 'Gestão inteligente e automatizada do seu funil.'}
          </p>
        </div>

        <button 
          onClick={() => setIsManualMode(!isManualMode)}
          style={{ 
            background: isManualMode ? '#f59e0b' : 'rgba(255,255,255,0.05)', 
            border: `1px solid ${isManualMode ? '#f59e0b' : 'rgba(255,255,255,0.1)'}`,
            color: isManualMode ? '#000' : '#fff',
            padding: '10px 20px', borderRadius: '12px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold',
            transition: '0.3s', boxShadow: isManualMode ? '0 0 20px rgba(245, 158, 11, 0.4)' : 'none'
          }}
        >
          {isManualMode ? <ShieldAlert size={18} /> : <Zap size={18} color="var(--color-accent-green)" />}
          {isManualMode ? 'DESATIVAR MODO MANUAL' : 'ATIVAR MODO MANUAL'}
        </button>
      </header>

      {funnels.length > 0 && (
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', opacity: 0.7, fontWeight: 'bold' }}>FUNIL ATIVO:</span>
          {isEditingFunnel ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="text"
                autoFocus
                value={editingFunnelName}
                onChange={(e) => setEditingFunnelName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveCurrentFunnel();
                  if (e.key === 'Escape') setIsEditingFunnel(false);
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: '#1a1f26',
                  color: '#fff',
                  border: '1px solid var(--color-accent-cyan, #00d2ff)',
                  outline: 'none',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
              />
              <button
                onClick={handleSaveCurrentFunnel}
                disabled={savingFunnel || !editingFunnelName.trim()}
                title="Salvar (Enter)"
                style={{
                  background: 'var(--color-accent-green, #10b981)',
                  border: 'none',
                  color: '#000',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 'bold',
                  fontSize: '0.85rem'
                }}
              >
                <Check size={14} /> Salvar
              </button>
              <button
                onClick={() => setIsEditingFunnel(false)}
                title="Cancelar (Esc)"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <select 
                value={selectedFunnel || ''} 
                onChange={e => handleSelectFunnel(e.target.value)}
                style={{ 
                  padding: '10px 15px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', 
                  color: '#fff', border: '1px solid rgba(255,255,255,0.1)', outline: 'none', cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {funnels.map(f => (
                  <option key={f.id} value={f.id} style={{ color: '#000' }}>{f.name}</option>
                ))}
              </select>
              <button
                onClick={handleStartEditCurrentFunnel}
                title="Renomear este funil"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--color-accent-cyan, #00d2ff)',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}
              >
                <Edit2 size={14} /> Renomear
              </button>
            </div>
          )}
        </div>
      )}

      
      <StatusLegend />
      
      <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '30px' }}>
        {columns.map(col => (
          <div 
            key={col} 
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, col)}
            style={{ 
              flexShrink: 0, width: '320px', height: 'calc(100vh - 200px)', minHeight: '500px', display: 'flex', 
              flexDirection: 'column', padding: '20px', paddingBottom: '10px', marginTop: 0,
              background: 'rgba(18, 21, 26, 0.8)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderTop: '2px solid rgba(0, 132, 255, 0.2)',
              borderRadius: '20px',
              position: 'relative'
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', background: 'linear-gradient(90deg, #0084FF, #00D4FF, #0084FF)', opacity: 0.9 }}></div>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '20px', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
              <span>{col}</span>
              <span style={{ opacity: 0.5 }}>{leads.filter(l => l.pipeline_status === col).length}</span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
              {leads.filter(l => l.pipeline_status === col).map(lead => (
                <div 
                  key={lead.id} 
                  draggable
                  onDragStart={(e) => onDragStart(e, lead.id)}
                  style={{
                    background: 'rgba(20,24,31,1)', padding: '18px', borderRadius: '12px',
                    borderLeft: `5px solid var(--color-accent)`,
                    cursor: 'grab',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--color-light)', marginBottom: '8px' }}>{lead.name}</strong>
                  
                  {/* TAGS DE ORIGEM E INTERESSE */}
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    {lead.source && (
                      <span style={{ 
                        background: lead.source === 'Website' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.1)', 
                        color: lead.source === 'Website' ? 'var(--color-accent-green)' : '#fff',
                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase'
                      }}>
                        {lead.source === 'Website' ? '🌐 CATÁLOGO' : lead.source}
                      </span>
                    )}
                  </div>

                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', opacity: 0.5, marginBottom: '8px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                     ID: {lead.id}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', opacity: 0.8, marginBottom: '4px' }}>
                     📱 {lead.phone}
                  </span>

                  {lead.notes && (
                    <div style={{ 
                      background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '6px', 
                      fontSize: '0.75rem', color: '#ccc', marginBottom: '10px',
                      borderLeft: '2px solid var(--color-accent-cyan)'
                    }}>
                      {lead.notes}
                    </div>
                  )}

                  {/* ETIQUETA DE FOLLOW UP */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(0, 132, 255, 0.1)', padding: '4px 8px', borderRadius: '4px', marginBottom: '12px', width: 'fit-content' }}>
                    <Clock size={12} color="var(--color-accent)" />
                    <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>FOLLOW UP</span>
                  </div>

                  {/* FEEDBACK DO CLIENTE (ESTRELAS) */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <small style={{ fontSize: '0.65rem', opacity: 0.4, textTransform: 'uppercase' }}>Feedback</small>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={12} fill={s <= (lead.id % 2 === 0 ? 5 : 4) ? '#FFD700' : 'transparent'} color={s <= (lead.id % 2 === 0 ? 5 : 4) ? '#FFD700' : 'rgba(255,255,255,0.2)'} />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => openBillingModal(lead)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      background: 'rgba(0, 132, 255, 0.1)', border: '1px solid rgba(0, 132, 255, 0.2)',
                      color: 'var(--color-accent)', padding: '8px', borderRadius: '8px',
                      fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer'
                    }}
                  >
                    <DollarSign size={14} /> FECHAR VENDA
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {billingLead && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="card" style={{ width: '450px', padding: '30px', borderTop: '4px solid var(--color-accent)', background: '#0a0a0a', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: 'var(--color-accent)', margin: 0 }}>Fechar Venda</h2>
              <button onClick={closeBillingModal} style={{ background: 'none', border: 'none', color: '#fff', opacity: 0.5, cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {!billingResult ? (
              <form onSubmit={handleCreateInvoice}>
                <p style={{ opacity: 0.6, fontSize: '0.85rem', marginBottom: '20px' }}>
                  Gera uma fatura no Stripe para <strong>{billingLead.name}</strong> e envia o link de pagamento (com cálculo de imposto automático).
                </p>

                <label style={{ display: 'block', marginBottom: '8px', opacity: 0.6 }}>Descrição</label>
                <input
                  className="input-field"
                  placeholder="Ex: Implementação de IA — Pacote Essencial"
                  value={billingForm.description}
                  onChange={e => setBillingForm({ ...billingForm, description: e.target.value })}
                  style={{ marginBottom: '15px' }}
                  required
                />

                <label style={{ display: 'block', marginBottom: '8px', opacity: 0.6 }}>Valor (R$)</label>
                <input
                  className="input-field"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0,00"
                  value={billingForm.amount}
                  onChange={e => setBillingForm({ ...billingForm, amount: e.target.value })}
                  style={{ marginBottom: '20px' }}
                  required
                />

                {billingError && (
                  <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '15px' }}>{billingError}</p>
                )}

                <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={billingLoading}>
                  {billingLoading ? 'GERANDO FATURA...' : 'GERAR FATURA E ENVIAR'}
                </button>
              </form>
            ) : (
              <div>
                <p style={{ color: 'var(--color-accent-green)', marginBottom: '15px' }}>
                  Fatura criada e enviada com sucesso!
                </p>
                {billingResult.hosted_invoice_url && (
                  <a
                    href={billingResult.hosted_invoice_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'block', wordBreak: 'break-all', color: 'var(--color-accent-cyan)', marginBottom: '20px', fontSize: '0.85rem' }}
                  >
                    {billingResult.hosted_invoice_url}
                  </a>
                )}
                <button className="btn-primary" style={{ width: '100%' }} onClick={closeBillingModal}>
                  FECHAR
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Kanban;
