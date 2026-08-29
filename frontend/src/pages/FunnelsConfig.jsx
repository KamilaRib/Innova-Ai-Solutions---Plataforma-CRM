import React, { useState, useEffect } from 'react';
import { Filter, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { apiFetch } from '../utils/api';

const FunnelsConfig = () => {
  const [funnels, setFunnels] = useState([]);
  const [newFunnelName, setNewFunnelName] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

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
    const handleFunnelUpdated = () => fetchFunnels();
    window.addEventListener('funnelUpdated', handleFunnelUpdated);
    return () => window.removeEventListener('funnelUpdated', handleFunnelUpdated);
  }, []);

  const handleCreate = async () => {
    if (!newFunnelName.trim()) return;
    setLoading(true);
    try {
      const res = await apiFetch('/api/funnels', {
        method: 'POST',
        body: JSON.stringify({ name: newFunnelName.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setNewFunnelName('');
        fetchFunnels();
        window.dispatchEvent(new CustomEvent('funnelUpdated'));
      } else {
        alert(data.error || 'Erro ao criar funil');
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (funnel) => {
    setEditingId(funnel.id);
    setEditingName(funnel.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSaveEdit = async (id) => {
    if (!editingName.trim() || savingEdit) {
      handleCancelEdit();
      return;
    }
    setSavingEdit(true);
    try {
      const res = await apiFetch(`/api/funnels/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name: editingName.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setFunnels(prev => prev.map(f => f.id === id ? { ...f, name: editingName.trim() } : f));
        window.dispatchEvent(new CustomEvent('funnelUpdated', { detail: { id, name: editingName.trim() } }));
        setEditingId(null);
      } else {
        alert(data.error || 'Erro ao atualizar nome do funil');
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este funil? Ele não pode conter leads.')) return;
    try {
      const res = await apiFetch(`/api/funnels/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchFunnels();
        window.dispatchEvent(new CustomEvent('funnelUpdated'));
      } else {
        alert(data.error || 'Erro ao deletar funil');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: 'var(--color-accent)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Filter size={28} /> Gestão de Funis
      </h1>
      <p style={{ opacity: 0.8, marginBottom: '30px' }}>
        Crie, renomeie e gerencie seus funis de vendas para organizar seus leads em jornadas diferentes.
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
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            style={{ flex: 1 }}
          />
          <button 
            className="btn-primary" 
            onClick={handleCreate} 
            disabled={loading || !newFunnelName.trim()}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={18} /> CRIAR
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Seus Funis</h3>
          <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Dica: Dê 2 cliques no nome ou clique no lápis para editar</span>
        </div>

        {funnels.length === 0 ? (
          <p style={{ opacity: 0.5 }}>Nenhum funil encontrado.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {funnels.map(funnel => {
              const isEditing = editingId === funnel.id;

              return (
                <div key={funnel.id} style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  padding: '15px 20px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px',
                  border: isEditing ? '1px solid var(--color-accent-cyan, #00d2ff)' : '1px solid rgba(255,255,255,0.05)',
                  transition: '0.2s ease'
                }}>
                  <div style={{ flex: 1, marginRight: '15px' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="text"
                          autoFocus
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(funnel.id);
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          style={{
                            background: '#1a1f26',
                            border: '1px solid var(--color-accent-cyan, #00d2ff)',
                            borderRadius: '6px',
                            color: '#fff',
                            padding: '8px 12px',
                            fontSize: '1rem',
                            outline: 'none',
                            width: '100%',
                            maxWidth: '350px'
                          }}
                        />
                        <button
                          onClick={() => handleSaveEdit(funnel.id)}
                          disabled={savingEdit || !editingName.trim()}
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
                          <Check size={16} /> Salvar
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          title="Cancelar (Esc)"
                          style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            color: '#fff',
                            borderRadius: '6px',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.85rem'
                          }}
                        >
                          <X size={16} /> Cancelar
                        </button>
                      </div>
                    ) : (
                      <div 
                        onDoubleClick={() => handleStartEdit(funnel)}
                        style={{ cursor: 'pointer' }}
                        title="Duplo clique para editar o nome"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <strong style={{ fontSize: '1.1rem', color: '#fff' }}>{funnel.name}</strong>
                          {funnel.is_default && (
                            <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'var(--color-accent-green, #10b981)', color: '#000', borderRadius: '4px', fontWeight: 'bold' }}>
                              PADRÃO
                            </span>
                          )}
                        </div>
                        <small style={{ opacity: 0.4, fontSize: '0.75rem' }}>ID: {funnel.id}</small>
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button 
                        onClick={() => handleStartEdit(funnel)} 
                        title="Editar nome"
                        style={{ background: 'transparent', border: 'none', color: 'var(--color-accent-cyan, #00d2ff)', cursor: 'pointer', opacity: 0.8, display: 'flex', alignItems: 'center', padding: '6px' }}
                      >
                        <Edit2 size={18} />
                      </button>
                      {!funnel.is_default && (
                        <button 
                          onClick={() => handleDelete(funnel.id)} 
                          title="Excluir funil"
                          style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.8, display: 'flex', alignItems: 'center', padding: '6px' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FunnelsConfig;

