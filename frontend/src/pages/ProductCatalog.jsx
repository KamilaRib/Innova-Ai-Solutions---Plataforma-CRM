import React, { useState, useEffect } from 'react';
import { Tag, Plus, ShoppingBag, Edit, Trash2, DollarSign } from 'lucide-react';
import { apiFetch } from '../utils/api';

import { useNavigate } from 'react-router-dom';

const ProductCatalog = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showNfeModal, setShowNfeModal] = useState(null);
  const [nfseStatus, setNfseStatus] = useState("NÃO EMITIDA");
  const [isEmitting, setIsEmitting] = useState(false);
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

      {/* MODAL DE NF-E */}
      {showNfeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="card" style={{ width: '500px', padding: '30px', borderTop: '4px solid var(--color-accent-green)', background: '#12151a', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>Gerenciar NFS-e de Serviço</h2>
                <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.6 }}>Serviço: {showNfeModal.name}</p>
              </div>
              <div style={{ background: nfseStatus === 'AUTORIZADA' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255,255,255,0.05)', color: nfseStatus === 'AUTORIZADA' ? 'var(--color-accent-green)' : '#fff', padding: '5px 10px', borderRadius: '4px', fontSize: '0.75rem', opacity: nfseStatus === 'AUTORIZADA' ? 1 : 0.6 }}>{nfseStatus}</div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--color-accent-green)', paddingBottom: '10px', borderBottom: '2px solid var(--color-accent-green)', fontWeight: 'bold' }}>Visão Geral / Emissão</button>
            </div>
            
            {nfseStatus === 'AUTORIZADA' ? (
              <div style={{ background: 'rgba(34, 197, 94, 0.05)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.2)', marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <h4 style={{ margin: 0, color: 'var(--color-accent-green)' }}>NFS-e Autorizada com Sucesso!</h4>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <a href="#" style={{ padding: '8px 15px', background: 'rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontSize: '0.8rem' }}>Baixar PDF</a>
                  <a href="#" style={{ padding: '8px 15px', background: 'rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontSize: '0.8rem' }}>Baixar XML</a>
                </div>
              </div>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '25px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ width: '0', height: '0', borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: '8px solid var(--color-accent-green)' }}></div>
                  <h4 style={{ margin: 0, color: 'var(--color-accent-green)' }}>Emitir NFS-e (Serviço)</h4>
                </div>
                <p style={{ fontSize: '0.85rem', opacity: 0.7, lineHeight: '1.5', margin: 0 }}>
                  Será gerada e enviada uma **NFS-e de Serviço** para a Prefeitura. O valor da nota corresponderá ao preço do serviço cadastrado (R$ {Number(showNfeModal.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}).
                </p>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
              <button 
                onClick={() => {
                  setShowNfeModal(null);
                  setNfseStatus("NÃO EMITIDA");
                }}
                style={{ background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
              >
                Cancelar
              </button>
              <button 
                disabled={isEmitting || nfseStatus === 'AUTORIZADA'}
                onClick={async () => {
                  setIsEmitting(true);
                  try {
                    const response = await apiFetch(`/api/catalog/products/${showNfeModal.id}/nfse`, {
                      method: 'POST'
                    });
                    const data = await response.json();
                    
                    if (data.success) {
                      setNfseStatus("PROCESSANDO");
                      
                      // Simular que o webhook assíncrono (Gateway) respondeu após alguns segundos
                      setTimeout(async () => {
                        // Apenas simulação no frontend para fechar o ciclo que o Webhook faria
                        // Disparando chamada pro webhook interno para autorizar a nota.
                        try {
                          await fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/webhooks/nfse`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              referencia: data.invoice_id,
                              status: 'autorizado',
                              caminho_xml_nota_fiscal: 'http://localhost/dummy.xml',
                              caminho_danfe: 'http://localhost/dummy.pdf'
                            })
                          });
                          setNfseStatus("AUTORIZADA");
                        } catch (e) {
                          console.error("Falha ao simular webhook", e);
                        }
                      }, 2500);

                    } else {
                      alert('Erro ao transmitir nota: ' + (data.error || 'Falha técnica'));
                      setNfseStatus("NÃO EMITIDA");
                    }
                  } catch (e) {
                    alert('Erro de conexão ao transmitir a nota.');
                    setNfseStatus("NÃO EMITIDA");
                  } finally {
                    setIsEmitting(false);
                  }
                }}
                style={{ background: nfseStatus === 'AUTORIZADA' ? 'rgba(255,255,255,0.1)' : 'var(--color-accent-green)', color: nfseStatus === 'AUTORIZADA' ? '#fff' : '#000', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: nfseStatus === 'AUTORIZADA' ? 'default' : 'pointer', fontSize: '0.9rem', opacity: isEmitting ? 0.7 : 1 }}
              >
                {isEmitting ? 'Transmitindo...' : (nfseStatus === 'AUTORIZADA' ? 'Nota Autorizada' : 'Transmitir NFS-e para Prefeitura')}
              </button>
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
          onClick={() => navigate('/app/products/new')}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{item.name}</h3>
                <button onClick={() => handleDelete(item.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Excluir Serviço">
                  <Trash2 size={18} />
                </button>
              </div>
              <p style={{ fontSize: '0.85rem', opacity: 0.6, lineHeight: '1.5', height: '60px', overflow: 'hidden', marginBottom: '15px' }}>
                {item.desc || 'Sem descrição.'}
              </p>
              
              <div style={{ color: 'var(--color-accent-green)', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '15px' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.6, marginRight: '4px' }}>R$</span>
                {Number(item.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
                
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
                <button 
                  onClick={() => navigate(`/app/products/edit?productId=${item.id}`)}
                  style={{ background: 'var(--color-accent-green)', color: '#000', border: 'none', padding: '8px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                  <Edit size={14} /> Editar
                </button>
                <button 
                  onClick={() => navigate(`/app/sales/new?productId=${item.id}`)}
                  style={{ background: 'var(--color-accent-green)', color: '#000', border: 'none', padding: '8px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>
                  Vender
                </button>
                <button 
                  onClick={() => setShowNfeModal(item)}
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  NF-e Serviço
                </button>
                <button 
                  onClick={() => navigate(`/app/products/costs?productId=${item.id}`)}
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  Despesas
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;
