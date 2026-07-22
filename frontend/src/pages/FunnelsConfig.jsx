import React, { useState, useEffect } from 'react';
import { Filter, Plus, Trash2 } from 'lucide-react';
import { apiFetch } from '../utils/api';

const FunnelsConfig = () => {
  const [funnels, setFunnels] = useState([]);
  const [newFunnelName, setNewFunnelName] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchFunnels = async () => {
    try {
      const res = await apiFetch('/api/funnels');
      const data = await res.json();
      if (data.success) {
        setFunnels(data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar funis:', error);
    }
  };

  useEffect(() => {
    fetchFunnels();
  }, []);

  const handleCreate = async () => {
    if (!newFunnelName) return;
    setLoading(true);
    try {
      const res = await apiFetch('/api/funnels', {
        method: 'POST',
        body: JSON.stringify({ name: newFunnelName })
      });
      const data = await res.json();
      if (data.success) {
        setNewFunnelName('');
        fetchFunnels();
      } else {
        alert(data.error || 'Erro ao criar funil');
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este funil? Ele não pode conter leads.')) return;
    try {
      const res = await apiFetch(`/api/funnels/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchFunnels();
      } else {
        alert(data.error || 'Erro ao deletar funil');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: 'var(--color-accent-green)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Filter size={28} /> Gestão de Funis
      </h1>
      <p style={{ opacity: 0.8, marginBottom: '30px' }}>
        Crie e gerencie seus funis de vendas para organizar seus leads em jornadas diferentes.
      </p>

      <div className="card" style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>Adicionar Novo Funil</h3>
        <div style={{ display: 'flex', gap: '15px' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Nome do Funil (ex: Lançamento VIP)"
            value={newFunnelName}
            onChange={(e) => setNewFunnelName(e.target.value)}
            style={{ flex: 1 }}
          />
          <button 
            className="btn-primary" 
            onClick={handleCreate} 
            disabled={loading || !newFunnelName}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={18} /> CRIAR
          </button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>Seus Funis</h3>
        {funnels.length === 0 ? (
          <p style={{ opacity: 0.5 }}>Nenhum funil encontrado.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {funnels.map(funnel => (
              <div key={funnel.id} style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' 
              }}>
                <div>
                  <strong style={{ fontSize: '1.1rem', color: '#fff', display: 'block' }}>{funnel.name}</strong>
                  <small style={{ opacity: 0.5 }}>ID: {funnel.id}</small>
                  {funnel.is_default && <span style={{ marginLeft: '10px', fontSize: '0.7rem', padding: '2px 6px', background: 'var(--color-accent-green)', color: '#000', borderRadius: '4px', fontWeight: 'bold' }}>PADRÃO</span>}
                </div>
                {!funnel.is_default && (
                  <button onClick={() => handleDelete(funnel.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.7 }}>
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FunnelsConfig;
