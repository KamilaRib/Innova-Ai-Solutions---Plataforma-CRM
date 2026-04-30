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
  const [loading, setLoading] = useState(true);
  
  const columns = ['Início de Atendimento', 'Conversando', 'Agendamento', 'Formulário Enviado', 'Follow Up'];

  const fetchLeads = async () => {
    try {
      const response = await fetch('https://innovaisolutions.com.br/api/leads');
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
    fetchLeads();
    const interval = setInterval(fetchLeads, 10000); // Atualiza a cada 10s
    return () => clearInterval(interval);
  }, []);

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
      
      <StatusLegend />
      
      <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '30px' }}>
        {columns.map(col => (
          <div 
            key={col} 
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, col)}
            className="card" 
            style={{ 
              flexShrink: 0, width: '320px', minHeight: '650px', display: 'flex', 
              flexDirection: 'column', padding: '20px', marginTop: 0,
              background: 'rgba(255,255,255,0.01)'
            }}
          >
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
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--color-light)', marginBottom: '8px' }}>{lead.name}</strong>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', opacity: 0.8, marginBottom: '4px' }}>
                     👤 {lead.contact}
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
