import React, { useRef } from 'react';
import { mockLeads } from '../data/mockData';
import { FileUp, Search, UserPlus, Mail } from 'lucide-react';

const BaseContatos = () => {
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`Arquivo "${file.name}" selecionado para importação! Iniciando processamento...`);
      // Aqui entrará a lógica de leitura de Excel/CSV no futuro
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ color: 'var(--color-accent-green)', marginBottom: '5px' }}>Carteira de Cliente</h1>
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
              background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--color-accent-green)', 
              color: 'var(--color-accent-green)', padding: '10px 20px', borderRadius: '8px', 
              cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <FileUp size={18} />
            IMPORTAR PLANILHA
          </button>
          <button style={{ background: 'var(--color-accent-green)', border: 'none', color: '#000', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
              <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>WHATSAPP</th>
              <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>E-MAIL</th>
              <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>STATUS ATUAL</th>
              <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem', textAlign: 'right' }}>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {mockLeads.map(lead => (
              <tr key={lead.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}>
                <td style={{ padding: '20px', color: 'var(--color-light)' }}><strong>{lead.name}</strong></td>
                <td style={{ padding: '20px', opacity: 0.8 }}>{lead.contact}</td>
                <td style={{ padding: '20px', opacity: 0.8 }}>{lead.phone}</td>
                <td style={{ padding: '20px', opacity: 0.8 }}>
                  <a href={`mailto:${lead.email || 'contato@cliente.com'}`} style={{ color: 'var(--color-accent-green)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Mail size={14} />
                    {lead.email || 'Enviar E-mail'}
                  </a>
                </td>
                <td style={{ padding: '20px' }}>
                  <span style={{ 
                    background: lead.status === 'Conversando' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)', 
                    color: lead.status === 'Conversando' ? 'var(--color-accent-green)' : 'rgba(255, 255, 255, 0.6)', 
                    padding: '6px 12px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase'
                  }}>
                    {lead.status}
                  </span>
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
