import React, { useState } from 'react';
import { Image, Download, Plus, FileText, ExternalLink, Trash2 } from 'lucide-react';

const CreativeCatalog = () => {
  const [creatives, setCreatives] = useState([
    { id: 0, title: 'LOGOMARCA OFICIAL', desc: 'Versões em PNG (fundo transparente), SVG e variações de cor (principal, branco e preto).', type: 'LOGOMARCA', size: '12MB' },
    { id: 1, title: 'Banner Lançamento IA', desc: 'Banner principal para campanha de Google Ads e Site. Focado em conversão de leads frios.', type: 'BANNER', size: '2.5MB' },
    { id: 2, title: 'Post Instagram - CRM', desc: 'Arte quadrada focada em explicar os benefícios do CRM. Para feed orgânico.', type: 'SOCIAL', size: '1.2MB' },
    { id: 3, title: 'Story - Automação', desc: 'Vídeo curto de 15s para Reels e Stories sobre Evolution API.', type: 'VÍDEO', size: '45MB' },
  ]);

  const handleDownload = (title) => {
    alert(`Iniciando download de: ${title} ...`);
  };

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
        <div>
          <h1 style={{ color: 'var(--color-accent-green)', marginBottom: '5px' }}>Catálogo de Ativos</h1>
          <p style={{ opacity: 0.8 }}>Repositório oficial de artes e identidade visual.</p>
        </div>
        
        <button 
          onClick={() => alert('Abrindo seletor de arquivos...')}
          style={{ 
            background: 'var(--color-accent-green)', border: 'none', color: '#000', 
            padding: '12px 24px', borderRadius: '10px', fontWeight: 'bold', 
            display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'
          }}
        >
          <Plus size={20} />
          ADICIONAR NOVO
        </button>
      </div>

      {/* SEÇÃO LOGOMARCA (DESTAQUE) */}
      <div className="card" style={{ 
        background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.05), transparent)', 
        borderLeft: '4px solid var(--color-accent-green)',
        marginBottom: '30px', padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px' }}>
            <Image size={32} color="var(--color-accent-green)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', margin: '0 0 5px 0' }}>{creatives[0].title}</h2>
            <p style={{ margin: 0, opacity: 0.6, fontSize: '0.9rem' }}>{creatives[0].desc}</p>
          </div>
        </div>
        <button 
          onClick={() => handleDownload(creatives[0].title)}
          className="btn-primary" 
          style={{ padding: '10px 25px', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <Download size={18} />
          BAIXAR PACOTE LOGO
        </button>
      </div>

      <h3 style={{ fontSize: '1rem', opacity: 0.4, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Lista de Criativos</h3>

      {/* LISTA DE CRIATIVOS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {creatives.slice(1).map(item => (
          <div key={item.id} className="card" style={{ 
            padding: '20px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            transition: '0.2s', cursor: 'pointer'
          }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
            
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flex: 1 }}>
              <div style={{ width: '50px', height: '50px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={20} opacity={0.3} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '1.05rem' }}>{item.title}</strong>
                  <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', opacity: 0.5 }}>{item.type}</span>
                </div>
                <p style={{ margin: 0, opacity: 0.5, fontSize: '0.85rem' }}>{item.desc}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
              <span style={{ fontSize: '0.8rem', opacity: 0.3, fontWeight: 'bold' }}>{item.size}</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleDownload(item.title)}
                  style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}
                >
                  <Download size={14} />
                  Download
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default CreativeCatalog;
