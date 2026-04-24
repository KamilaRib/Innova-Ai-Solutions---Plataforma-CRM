import React from 'react';
import { mockLeads } from '../data/mockData'; // Usando o novo mockData centralizado

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
  const columns = ['Início de Atendimento', 'Conversando', 'Agendamento', 'Formulário Enviado', 'Follow Up'];
  
  return (
    <div style={{ paddingRight: '20px' }}>
      <h1 style={{ color: 'var(--color-accent-green)', marginBottom: '25px' }}>Leads</h1>
      
      <StatusLegend />
      
      <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
        {columns.map(col => (
          <div key={col} className="card" style={{ flexShrink: 0, width: '320px', minHeight: '650px', display: 'flex', flexDirection: 'column', padding: '20px', marginTop: 0 }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '20px', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
              <span>{col}</span>
              <span style={{ opacity: 0.5 }}>{mockLeads.filter(l => l.status === col).length}</span>
            </h3>
            
            {/* Rendereiza os Cards Virtuais da Coluna */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {mockLeads.filter(l => l.status === col).map(lead => (
                <div key={lead.id} style={{
                  background: 'rgba(0,0,0,0.5)', padding: '18px', borderRadius: '10px',
                  borderLeft: `5px solid var(--color-accent-green)`,
                  cursor: 'pointer',
                  transition: '0.2s',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                }}>
                  <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--color-light)', marginBottom: '8px' }}>{lead.name}</strong>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', opacity: 0.8, marginBottom: '4px' }}>
                     👤 {lead.contact}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', opacity: 0.8 }}>
                     📱 {lead.phone}
                  </span>
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
