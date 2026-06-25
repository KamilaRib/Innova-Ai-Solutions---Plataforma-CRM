import React, { useState, useEffect } from 'react';
import { mockLeads } from '../data/mockData';
import { Star, Clock, ShieldAlert, Zap, Settings2 } from 'lucide-react';

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
  const [isManualMode, setIsManualMode] = useState(false);
  const [leads, setLeads] = useState([]);
  const [funnels, setFunnels] = useState([]);
  const [selectedFunnel, setSelectedFunnel] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const columns = ['Início de Atendimento', 'Conversando', 'Agendamento', 'Formulário Enviado', 'Follow Up'];

  const fetchFunnels = async () => {
    try {
      const response = await fetch('https://innovaisolutions.com.br/api/funnels');
      const result = await response.json();
      if (result.success && result.data.length > 0) {
        setFunnels(result.data);
        if (!selectedFunnel) {
          // Seleciona o primeiro funil por padrão ou o funil principal
          const defaultFunnel = result.data.find(f => f.is_default) || result.data[0];
          setSelectedFunnel(defaultFunnel.id);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar funis:", error);
    }
  };

  useEffect(() => {
    fetchFunnels();
  }, []);

  const fetchLeads = async () => {
    try {
      const url = selectedFunnel 
        ? `https://innovaisolutions.com.br/api/leads?funnel_id=${selectedFunnel}`
        : 'https://innovaisolutions.com.br/api/leads';
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
      await fetch(`https://innovaisolutions.com.br/api/leads/${leadId}`, {
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
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '0.85rem', opacity: 0.7, fontWeight: 'bold' }}>SELECIONAR FUNIL:</span>
          <select 
            value={selectedFunnel || ''} 
            onChange={e => setSelectedFunnel(e.target.value)}
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
              flexShrink: 0, width: '320px', minHeight: '650px', display: 'flex', 
              flexDirection: 'column', padding: '20px', marginTop: 0,
              background: 'rgba(18, 21, 26, 0.8)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderTop: '2px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '20px',
              position: 'relative'
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', background: 'linear-gradient(90deg, #22c55e, #4ade80, #22c55e)', opacity: 0.9 }}></div>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '20px', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
              <span>{col}</span>
              <span style={{ opacity: 0.5 }}>{leads.filter(l => l.pipeline_status === col).length}</span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
              {leads.filter(l => l.pipeline_status === col).map(lead => (
                <div 
                  key={lead.id} 
                  draggable
                  onDragStart={(e) => onDragStart(e, lead.id)}
                  style={{
                    background: 'rgba(20,24,31,1)', padding: '18px', borderRadius: '12px',
                    borderLeft: `5px solid var(--color-accent-green)`,
                    cursor: 'grab',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--color-light)', marginBottom: '8px' }}>{lead.name}</strong>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', opacity: 0.5, marginBottom: '8px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                     ID: {lead.id}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', opacity: 0.8, marginBottom: '4px' }}>
                     👤 {lead.contact || 'Contato'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', opacity: 0.8, marginBottom: '10px' }}>
                     📱 {lead.phone}
                  </span>

                  {/* ETIQUETA DE FOLLOW UP */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(34, 197, 94, 0.1)', padding: '4px 8px', borderRadius: '4px', marginBottom: '12px', width: 'fit-content' }}>
                    <Clock size={12} color="var(--color-accent-green)" />
                    <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'var(--color-accent-green)' }}>FOLLOW UP</span>
                  </div>

                  {/* FEEDBACK DO CLIENTE (ESTRELAS) */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <small style={{ fontSize: '0.65rem', opacity: 0.4, textTransform: 'uppercase' }}>Feedback</small>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={12} fill={s <= (lead.id % 2 === 0 ? 5 : 4) ? '#FFD700' : 'transparent'} color={s <= (lead.id % 2 === 0 ? 5 : 4) ? '#FFD700' : 'rgba(255,255,255,0.2)'} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kanban;
