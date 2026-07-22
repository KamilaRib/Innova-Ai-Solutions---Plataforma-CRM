import React, { useState, useEffect } from 'react';
import { Tag, Plus, ShoppingBag, Edit, Trash2, DollarSign } from 'lucide-react';
import { apiFetch } from '../utils/api';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', desc: '', image_url: '' });

  const fetchProducts = async () => {
    try {
      const response = await apiFetch('/api/catalog/products');
      const result = await response.json();
      if (result.success) setProducts(result.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: String(product.price),
        desc: product.desc || '',
        image_url: product.image_url || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', price: '', desc: '', image_url: '' });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price) {
      alert('Nome e Preço são obrigatórios.');
      return;
    }

    try {
      const url = editingProduct
        ? `/api/catalog/products/${editingProduct.id}`
        : '/api/catalog/products';
      
      const method = editingProduct ? 'PATCH' : 'POST';

      const response = await apiFetch(url, {
        method,
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchProducts();
        setShowModal(false);
      }
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    
    try {
      const response = await apiFetch(`/api/catalog/products/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) fetchProducts();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      {/* MODAL DE PRODUTO */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="card" style={{ width: '450px', padding: '30px', borderTop: '4px solid var(--color-accent-green)', background: '#0a0a0a', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <h2 style={{ marginBottom: '20px', color: 'var(--color-accent-green)' }}>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
            
            <label style={{ display: 'block', marginBottom: '8px', opacity: 0.6 }}>Nome do Produto</label>
            <input className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ marginBottom: '15px' }} />
            
            <label style={{ display: 'block', marginBottom: '8px', opacity: 0.6 }}>Preço (R$)</label>
            <input className="input-field" type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ marginBottom: '15px' }} />
            
            <label style={{ display: 'block', marginBottom: '8px', opacity: 0.6 }}>Link da Imagem</label>
            <input className="input-field" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} style={{ marginBottom: '15px' }} />
            
            <label style={{ display: 'block', marginBottom: '8px', opacity: 0.6 }}>Descrição</label>
            <textarea className="input-field" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} style={{ height: '80px', marginBottom: '20px' }} />
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleSave}>SALVAR</button>
              <button className="btn-primary" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: '#fff' }} onClick={() => setShowModal(false)}>CANCELAR</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
        <div>
          <h1 style={{ color: 'var(--color-accent-green)', marginBottom: '5px' }}>Catálogo de Produtos</h1>
          <p style={{ opacity: 0.8 }}>Gerencie seus produtos, serviços e precificações.</p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          style={{ 
            background: 'var(--color-accent-green)', border: 'none', color: '#000', 
            padding: '12px 24px', borderRadius: '10px', fontWeight: 'bold', 
            display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'
          }}
        >
          <Plus size={20} />
          NOVO PRODUTO
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
        {products.length === 0 && !loading && (
          <div style={{ gridColumn: '1 / -1', padding: '100px', textAlign: 'center', opacity: 0.3 }}>
            <ShoppingBag size={48} style={{ marginBottom: '20px' }} />
            <p>Nenhum produto cadastrado no catálogo ainda.</p>
          </div>
        )}
        {products.map(item => (
          <div key={item.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ height: '180px', background: 'rgba(0,0,0,0.3)' }}>
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.1 }}>
                  <ShoppingBag size={48} />
                </div>
              )}
            </div>
            
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>{item.name}</h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.6, lineHeight: '1.5', height: '60px', overflow: 'hidden', marginBottom: '15px' }}>
                {item.desc || 'Sem descrição.'}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
                <div style={{ color: 'var(--color-accent-green)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  <span style={{ fontSize: '0.8rem', opacity: 0.6, marginRight: '4px' }}>R$</span>
                  {Number(item.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleOpenModal(item)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: 'rgb(239, 68, 68)', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>
                    <Trash2 size={16} />
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

export default ProductCatalog;
