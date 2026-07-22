import React, { useState, useEffect } from 'react';
import { Image, Download, Plus, FileText, ExternalLink, Trash2, Eye, Video, Edit, X, Save } from 'lucide-react';
import { apiFetch } from '../utils/api';

const CreativeCatalog = () => {
  const [creatives, setCreatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewItem, setPreviewItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    type: 'SOCIAL',
    format: '',
    size: '',
    recommended: '',
    url: ''
  });

  const fetchCreatives = async () => {
    try {
      const response = await apiFetch('/api/catalog/creatives');
      const result = await response.json();
      if (result.success) setCreatives(result.data);
    } catch (error) {
      console.error("Erro ao buscar criativos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreatives();
  }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        desc: '',
        type: 'SOCIAL',
        format: '',
        size: '',
        recommended: '',
        url: ''
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.title) {
      alert('Por favor, preencha pelo menos o título.');
      return;
    }

    try {
      const url = editingItem
        ? `/api/catalog/creatives/${editingItem.id}`
        : '/api/catalog/creatives';
      
      const method = editingItem ? 'PATCH' : 'POST';

      const response = await apiFetch(url, {
        method,
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchCreatives();
        setShowModal(false);
      }
    } catch (error) {
      console.error("Erro ao salvar criativo:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este ativo?")) return;
    
    try {
      const response = await apiFetch(`/api/catalog/creatives/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) fetchCreatives();
    } catch (error) {
      console.error("Erro ao excluir criativo:", error);
    }
  };

  const filteredCreatives = creatives.filter(item => {
    if (activeFilter === 'Todos') return true;
    if (activeFilter === 'Identidade') return item.type === 'IDENTIDADE';
    if (activeFilter === 'Social') return item.type === 'SOCIAL';
    if (activeFilter === 'Vídeos') return item.type === 'VÍDEO';
    if (activeFilter === 'Banners') return item.type === 'BANNER';
    return true;
  });

  const handleDownload = (url) => {
    if (url && url !== '#') {
      window.open(url, '_blank');
    } else {
      alert('Link de download não disponível.');
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      {/* MODAL DE PREVIEW */}
      {previewItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '900px', textAlign: 'center' }}>
            <button onClick={() => setPreviewItem(null)} style={{ position: 'absolute', top: '-60px', right: 0, color: '#fff', background: 'rgba(255,255,255,0.1)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={20} />
            </button>
            <div style={{ background: '#111', borderRadius: '24px', padding: '30px', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
              <h2 style={{ marginBottom: '25px', color: 'var(--color-accent-green)', letterSpacing: '-1px', fontSize: '1.8rem' }}>{previewItem.title}</h2>
              <div style={{ width: '100%', height: '450px', background: 'linear-gradient(135deg, #1a1a1a, #0d0d0d)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                {previewItem.type.includes('VÍDEO') ? <Video size={80} color="var(--color-accent-green)" /> : <Image size={80} opacity={0.2} />}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '30px' }}>
                <div>
                  <small style={{ display: 'block', opacity: 0.4, textTransform: 'uppercase', fontSize: '0.65rem' }}>Formato</small>
                  <strong>{previewItem.format || 'N/A'}</strong>
                </div>
                <div>
                  <small style={{ display: 'block', opacity: 0.4, textTransform: 'uppercase', fontSize: '0.65rem' }}>Indicação</small>
                  <strong>{previewItem.recommended || 'Geral'}</strong>
                </div>
                <div>
                  <small style={{ display: 'block', opacity: 0.4, textTransform: 'uppercase', fontSize: '0.65rem' }}>Tamanho</small>
                  <strong>{previewItem.size || 'N/A'}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CADASTRO / EDIÇÃO */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <div className="card" style={{ width: '500px', padding: '40px', borderTop: '4px solid var(--color-accent-green)', background: '#0d1117', boxShadow: '0 30px 70px rgba(0,0,0,0.7)', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ color: 'var(--color-accent-green)', fontSize: '1.8rem', fontWeight: '900' }}>
                {editingItem ? 'Editar Ativo' : 'Novo Ativo'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.5 }}><X size={24} /></button>
            </div>
            
            <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.75rem', fontWeight: 'bold', opacity: 0.6 }}>TÍTULO DO ATIVO</label>
                <input className="input-field" placeholder="Ex: Logomarca Principal" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.75rem', fontWeight: 'bold', opacity: 0.6 }}>LINK DO ARQUIVO / ASSET</label>
                <input className="input-field" placeholder="https://exemplo.com/arquivo.png" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.75rem', fontWeight: 'bold', opacity: 0.6 }}>TIPO</label>
                  <select className="input-field" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="IDENTIDADE">Identidade</option>
                    <option value="SOCIAL">Social</option>
                    <option value="VÍDEO">Vídeo</option>
                    <option value="BANNER">Banner</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.75rem', fontWeight: 'bold', opacity: 0.6 }}>FORMATO</label>
                  <input className="input-field" placeholder="Ex: 1080x1080px" value={formData.format} onChange={e => setFormData({...formData, format: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.75rem', fontWeight: 'bold', opacity: 0.6 }}>TAMANHO</label>
                  <input className="input-field" placeholder="Ex: 1.5MB" value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.75rem', fontWeight: 'bold', opacity: 0.6 }}>RECOMENDAÇÃO</label>
                  <input className="input-field" placeholder="Ex: Feed Instagram" value={formData.recommended} onChange={e => setFormData({...formData, recommended: e.target.value})} />
                </div>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.75rem', fontWeight: 'bold', opacity: 0.6 }}>DESCRIÇÃO</label>
                <textarea className="input-field" style={{ height: '80px', resize: 'none' }} placeholder="Descreva o propósito deste ativo..." value={formData.desc || ''} onChange={e => setFormData({...formData, desc: e.target.value})} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              <button className="btn-primary" style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} onClick={handleSave}>
                <Save size={18} /> SALVAR ATIVO
              </button>
              <button className="btn-primary" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: '#fff' }} onClick={() => setShowModal(false)}>
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ color: 'var(--color-accent-green)', fontSize: '2.2rem', fontWeight: '900', letterSpacing: '-1.5px', marginBottom: '8px' }}>Biblioteca de Ativos</h1>
          <p style={{ opacity: 0.6, fontSize: '0.95rem' }}>Gerenciamento centralizado de criativos, logos e manuais de marca.</p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <Plus size={20} />
          NOVO ATIVO
        </button>
      </div>

      {/* FILTROS RÁPIDOS */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
        {['Todos', 'Identidade', 'Social', 'Vídeos', 'Banners'].map((filter) => (
          <button 
            key={filter} 
            onClick={() => setActiveFilter(filter)}
            style={{ 
              background: activeFilter === filter ? 'var(--color-accent-green)' : 'rgba(255,255,255,0.03)', 
              border: 'none', 
              color: activeFilter === filter ? '#000' : '#fff', 
              padding: '8px 20px', 
              borderRadius: '100px', 
              fontSize: '0.8rem', 
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* GRID DE GALERIA */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
        {filteredCreatives.length === 0 && !loading && (
          <div style={{ gridColumn: '1 / -1', padding: '100px', textAlign: 'center', opacity: 0.3 }}>
            <Image size={48} style={{ marginBottom: '20px' }} />
            <p>Nenhum ativo cadastrado nesta categoria.</p>
          </div>
        )}
        {filteredCreatives.map(item => (
          <div key={item.id} className="card" style={{ padding: 0, overflow: 'hidden', border: 'none', background: '#12151a', transition: 'transform 0.3s ease' }}>
            <div style={{ 
              height: '200px', background: 'linear-gradient(45deg, #1a1b1f, #12151a)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
              borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
              {item.type.includes('VÍDEO') ? <Video size={32} color="var(--color-accent-green)" /> : <Image size={32} opacity={0.2} />}
              <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 'bold', color: 'var(--color-accent-green)', textTransform: 'uppercase' }}>
                {item.type}
              </div>
              
              <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => handleOpenModal(item)}
                  style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(5px)', border: 'none', color: '#fff', width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Edit size={14} />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  style={{ background: 'rgba(239, 68, 68, 0.2)', backdropFilter: 'blur(5px)', border: 'none', color: '#ff4d4d', width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '6px', color: '#fff' }}>{item.title}</h3>
              <p style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '20px', height: '36px', overflow: 'hidden' }}>{item.desc}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-accent-green)' }}>{item.format || 'N/A'}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => setPreviewItem(item)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={() => handleDownload(item.url)}
                    style={{ background: 'var(--color-accent-green)', border: 'none', color: '#000', padding: '0 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800' }}
                  >
                    <Download size={14} style={{ marginRight: '6px' }} />
                    BAIXAR
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreativeCatalog;
