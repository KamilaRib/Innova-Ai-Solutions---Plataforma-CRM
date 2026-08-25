import React, { useRef, useState, useEffect } from 'react';
import { FileUp, Search, UserPlus, Mail, Instagram, Facebook, Globe, MessageCircle, Star } from 'lucide-react';

const BaseContatos = () => {
  const fileInputRef = useRef(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads');
      const result = await response.json();
      if (result.success) {
        setLeads(result.data);
      }
    } catch (error) {
      console.error("Erro ao buscar contatos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`Arquivo "${file.name}" selecionado para importação! Iniciando processamento...`);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ color: 'var(--color-accent)', marginBottom: '5px' }}>Carteira de Cliente</h1>
          <p style={{ opacity: 0.8 }}>Gerencie sua base estratégica e importe contatos em massa.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".csv, .xlsx, .xls" 
            style={{ display: 'none' }} 
          />
          <button 
            onClick={handleImportClick}
            style={{ 
              background: 'rgba(0, 132, 255, 0.1)', border: '1px solid var(--color-accent)', 
              color: 'var(--color-accent)', padding: '10px 20px', borderRadius: '8px', 
              cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <FileUp size={18} />
            IMPORTAR PLANILHA
          </button>
          <button style={{ background: 'var(--color-accent)', border: 'none', color: '#000', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={18} />
            NOVO CLIENTE
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
          <input 
            className="input-field" 
            placeholder="Pesquisar por nome, empresa ou telefone..." 
            style={{ paddingLeft: '45px' }}
          />
        </div>
      </div>

      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
            <tr>
              <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>CLIENTE / EMPRESA</th>
              <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>REPRESENTANTE</th>
              <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>ORIGEM</th>
              <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>WHATSAPP</th>
              <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>E-MAIL</th>
              <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>ATENDIMENTO</th>
              <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>STATUS ATUAL</th>
              <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>FEEDBACK CLIENTE</th>
              <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem', textAlign: 'right' }}>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && !loading && (
              <tr>
                <td colSpan="9" style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>
                  Nenhum cliente cadastrado na base ainda.
                </td>
              </tr>
            )}
            {leads.map(lead => (
              <tr key={lead.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}>
                <td style={{ padding: '20px', color: 'var(--color-light)' }}><strong>{lead.name}</strong></td>
                <td style={{ padding: '20px', opacity: 0.8 }}>{lead.contact || 'N/A'}</td>
                <td style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: lead.source === 'Instagram' ? '#E1306C' : lead.source === 'Facebook' ? '#1877F2' : 'var(--color-accent-green)' }}>
                    {lead.source === 'Instagram' ? <Instagram size={16} /> : 
                     lead.source === 'Facebook' ? <Facebook size={16} /> : 
                     lead.source === 'Site' ? <Globe size={16} /> : <MessageCircle size={16} />}
                    <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>{lead.source || 'WhatsApp'}</span>
                  </div>
                </td>
                <td style={{ padding: '20px', opacity: 0.8 }}>{lead.phone}</td>
                <td style={{ padding: '20px' }}>
                  <a 
                    href={`mailto:${lead.email || '#'}`} 
                    style={{ 
                      color: 'var(--color-accent)', 
                      textDecoration: 'none', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      background: 'rgba(0, 132, 255, 0.08)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      border: '1px solid rgba(0, 132, 255, 0.2)',
                      transition: '0.2s'
                    }}
                  >
                    <Mail size={14} />
                    {lead.email || 'N/A'}
                  </a>
                </td>
                <td style={{ padding: '20px' }}>
                  <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '6px', 
                    color: lead.last_contacted_at ? 'var(--color-accent-green)' : 'rgba(255,255,255,0.3)',
                    fontSize: '0.75rem', fontWeight: 'bold'
                  }}>
                    <div style={{ 
                      width: '8px', height: '8px', borderRadius: '50%', 
                      background: lead.last_contacted_at ? 'var(--color-accent-green)' : 'rgba(255,255,255,0.2)' 
                    }}></div>
                    {lead.last_contacted_at ? 'CONTATADO' : 'AGUARDANDO'}
                  </div>
                </td>
                <td style={{ padding: '20px' }}>
                  <span style={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    color: 'rgba(255, 255, 255, 0.6)', 
                    padding: '6px 12px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase'
                  }}>
                    {lead.pipeline_status}
                  </span>
                </td>
                <td style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', gap: '3px', color: '#FFD700' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={14} fill={star <= 5 ? '#FFD700' : 'transparent'} opacity={star <= 5 ? 1 : 0.2} />
                    ))}
                  </div>
                </td>
                <td style={{ padding: '20px', textAlign: 'right' }}>
                  <button style={{ 
                    background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.1)', 
                    color: '#fff', padding: '6px 16px', borderRadius: '6px', 
                    cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem'
                  }}>
                    PERFIL
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BaseContatos;
