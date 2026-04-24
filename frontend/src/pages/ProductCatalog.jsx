import React, { useState } from 'react';
import { Tag, Plus, ShoppingBag, Edit, Trash2, DollarSign } from 'lucide-react';

const ProductCatalog = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Combo Inteligência Artificial', price: '2.500,00', desc: 'Pacote completo com 5 automações personalizadas para atendimento automático.', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=60' },
    { id: 2, name: 'Consultoria de Processos', price: '1.200,00', desc: 'Análise detalhada do seu fluxo comercial para identificar gargalos e otimizar leads.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60' },
    { id: 3, name: 'Manutenção Mensal CRM', price: '450,00', desc: 'Suporte técnico prioritário e atualizações constantes do seu sistema Innova.', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', desc: '', image: '' });

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({ name: '', price: '', desc: '', image: '' });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...formData, id: p.id } : p));
    } else {
      setProducts([...products, { ...formData, id: Date.now() }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      setProducts(products.filter(p => p.id !== id));
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
            <input className="input-field" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ marginBottom: '15px' }} />
            
            <label style={{ display: 'block', marginBottom: '8px', opacity: 0.6 }}>Link da Imagem</label>
            <input className="input-field" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} style={{ marginBottom: '15px' }} />
            
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
        {products.map(item => (
          <div key={item.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ height: '180px', background: 'rgba(0,0,0,0.3)' }}>
              <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
            </div>
            
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>{item.name}</h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.6, lineHeight: '1.5', height: '60px', overflow: 'hidden', marginBottom: '15px' }}>
                {item.desc}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
                <div style={{ color: 'var(--color-accent-green)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  <span style={{ fontSize: '0.8rem', opacity: 0.6, marginRight: '4px' }}>R$</span>
                  {item.price}
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
