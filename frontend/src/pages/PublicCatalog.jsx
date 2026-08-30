import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SettingsContext } from '../context/SettingsContext';
import { Search, Filter, MessageCircle, X } from 'lucide-react';
import { apiFetch } from '../utils/api';

// --- MOCK PRODUCTS (Fallback) ---
const mockProducts = [
  { id: 1, name: 'INNOVA AI Knowledge Intelligence', price: 0, category: 'SERVIÇOS', subcategory: 'IA', image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80' },
  { id: 2, name: 'Marketing & Aquisição Digital', price: 0, category: 'SERVIÇOS', subcategory: 'MARKETING', image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80' },
  { id: 3, name: 'Dados & Inteligência', price: 0, category: 'SERVIÇOS', subcategory: 'DADOS', image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80' },
  { id: 4, name: 'Software & Integrações', price: 0, category: 'SERVIÇOS', subcategory: 'SOFTWARE', image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80' },
  { id: 5, name: 'CRM & Atendimento', price: 0, category: 'SERVIÇOS', subcategory: 'CRM', image_url: 'https://images.unsplash.com/photo-1552581234-26160f608093?w=400&q=80' },
  { id: 6, name: 'IA & Automação', price: 0, category: 'SERVIÇOS', subcategory: 'IA', image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80' },
  { id: 7, name: 'Agente CRM Innova IA (Funil Automático)', price: 0, category: 'SERVIÇOS', subcategory: 'IA', image_url: 'https://images.unsplash.com/photo-1531297172868-9441504a32e1?w=400&q=80' }
];

export default function PublicCatalog() {
  const { storeSlug } = useParams();
  const { settings } = useContext(SettingsContext);
  
  const [products, setProducts] = useState(mockProducts); // State for real products
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('TODOS');
  const [subcategory, setSubcategory] = useState('TODAS');
  const [sortBy, setSortBy] = useState('MAIS RECENTES');

  // Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch real products from backend
  React.useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/catalog/public-products');
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          setProducts(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch public products:', err);
      }
    }
    fetchProducts();
  }, []);

  // Hardcoded subcategories for demonstration
  const subcategoriesMap = {
    'SERVIÇOS': ['IA', 'Marketing', 'Dados', 'Software', 'CRM'],
    'VAREJO': ['Roupas', 'Calçados', 'Acessórios', 'Eletrônicos'],
    'ATACADO': ['Fardos', 'Caixas Fechadas', 'Paletes', 'Lotes'],
  };

  const currentSubcategories = category !== 'TODOS' ? subcategoriesMap[category] || [] : [];

  // Filter Logic
  let filteredProducts = products.filter(p => {
    if (category !== 'TODOS' && p.category !== category) return false;
    if (subcategory !== 'TODAS' && p.subcategory !== subcategory) return false;
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Sort Logic
  if (sortBy === 'MENOR PRECO') filteredProducts.sort((a, b) => a.price - b.price);
  if (sortBy === 'MAIOR PRECO') filteredProducts.sort((a, b) => b.price - a.price);

  const handleWhatsAppClick = () => {
    // In a real app, this would use the store's configured WhatsApp number
    window.open(`https://wa.me/5511999999999?text=Olá, vim pelo catálogo da ${settings?.business_name || 'loja'}`, '_blank');
  };

  return (
    <div style={{ height: '100vh', overflowY: 'auto', background: '#0a0b0d', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      {/* HEADER */}
      <header style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: '#12151a'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt="Logo" style={{ height: '40px', borderRadius: '4px' }} />
          ) : (
            <div style={{ width: '40px', height: '40px', background: 'var(--color-accent)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#000' }}>
              In
            </div>
          )}
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>
              {settings?.business_name ? (
                <>
                  {settings.business_name.split(' ')[0]} 
                  <span style={{ color: 'var(--color-accent)', margin: '0 4px' }}>
                    {settings.business_name.split(' ')[1]}
                  </span>
                  {settings.business_name.split(' ').slice(2).join(' ')}
                </>
              ) : (
                <>INNOVA <span style={{ color: 'var(--color-accent)' }}>AI</span> SOLUTIONS</>
              )}
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#888', margin: 0, textTransform: 'uppercase' }}>
              📍 LOJA OFICIAL
            </p>
          </div>
        </div>
        <button 
          onClick={handleWhatsAppClick}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'transparent', border: '1px solid var(--color-accent)', 
            color: 'var(--color-accent)', padding: '8px 16px', borderRadius: '8px',
            fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.target.style.background = 'var(--color-accent)'; e.target.style.color = '#000'; }}
          onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--color-accent)'; }}
        >
          <MessageCircle size={18} /> WhatsApp Loja
        </button>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* FILTERS AREA */}
        <section style={{ 
          background: '#12151a', borderRadius: '16px', padding: '25px', 
          border: '1px solid rgba(255,255,255,0.05)', marginBottom: '40px'
        }}>
          <h2 style={{ fontSize: '0.9rem', color: '#888', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', textTransform: 'uppercase' }}>
            <Filter size={16} color="var(--color-accent)" /> Filtrar Catálogo
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            
            {/* Search */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#888', marginBottom: '8px' }}>Buscar Produto</label>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="#888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text"
                  placeholder="EX: CAMISETA, TÊNIS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 12px 12px 35px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>

            {/* Categoria */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#888', marginBottom: '8px' }}>Categoria</label>
              <select 
                value={category}
                onChange={(e) => { setCategory(e.target.value); setSubcategory('TODAS'); }}
                style={{
                  width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', appearance: 'none'
                }}
              >
                <option value="TODOS">TODOS OS TIPOS</option>
                <option value="VAREJO">VAREJO</option>
                <option value="ATACADO">ATACADO</option>
              </select>
            </div>

            {/* Subcategoria */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#888', marginBottom: '8px' }}>Subcategoria</label>
              <select 
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                style={{
                  width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', appearance: 'none'
                }}
                disabled={category === 'TODOS'}
              >
                <option value="TODAS">TODAS AS SUBCATEGORIAS</option>
                {currentSubcategories.map(sub => (
                  <option key={sub} value={sub.toUpperCase()}>{sub.toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* Ordenar por */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#888', marginBottom: '8px' }}>Ordenar por</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', appearance: 'none'
                }}
              >
                <option value="MAIS RECENTES">MAIS RECENTES</option>
                <option value="MENOR PRECO">MENOR PREÇO</option>
                <option value="MAIOR PRECO">MAIOR PREÇO</option>
              </select>
            </div>

          </div>
        </section>

        {/* PRODUCTS GRID OR EMPTY STATE */}
        {filteredProducts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
            {filteredProducts.map(product => (
              <div key={product.id} style={{ 
                background: '#12151a', borderRadius: '16px', overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.2s',
                display: 'flex', flexDirection: 'column'
              }}>
                <div style={{ height: '220px', overflow: 'hidden', background: '#1a1d24' }}>
                  <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-accent)', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px' }}>
                    {product.category} • {product.subcategory}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', margin: '0 0 15px 0', fontWeight: '600' }}>{product.name}</h3>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '20px', marginTop: 'auto' }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                  </div>
                  <button 
                    onClick={() => { setSelectedProduct(product); setSuccessMsg(''); }}
                    style={{ 
                      width: '100%', padding: '12px', background: 'var(--color-accent)', color: '#000',
                      border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'
                    }}>
                    Tenho Interesse
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <section style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '16px', padding: '80px 20px',
            background: 'rgba(255,255,255,0.01)'
          }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Search size={24} color="#555" />
            </div>
            <h3 style={{ fontSize: '1rem', color: '#fff', margin: '0 0 10px 0' }}>Nenhum produto disponível</h3>
            <p style={{ fontSize: '0.85rem', color: '#666', margin: 0, textAlign: 'center' }}>
              Não encontramos produtos correspondentes aos filtros<br/>selecionados.
            </p>
          </section>
        )}

      </main>

      {/* FOOTER */}
      <footer style={{
        marginTop: '60px', padding: '40px', borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#12151a'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, textTransform: 'uppercase' }}>
            {settings?.business_name ? (
              <>
                {settings.business_name.split(' ')[0]} 
                <span style={{ color: 'var(--color-accent)', margin: '0 4px' }}>
                  {settings.business_name.split(' ')[1]}
                </span>
                {settings.business_name.split(' ').slice(2).join(' ')}
              </>
            ) : (
              <>INNOVA <span style={{ color: 'var(--color-accent)' }}>AI</span> SOLUTIONS</>
            )}
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-accent)', margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
            📍 LOJA OFICIAL DA PLATAFORMA
          </p>
        </div>
        
        <button 
          onClick={handleWhatsAppClick}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'var(--color-accent)', border: 'none',
            color: '#000', padding: '12px 24px', borderRadius: '30px',
            fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s'
          }}
        >
          <MessageCircle size={20} /> Falar com a Loja
        </button>
      </footer>

      {/* LEAD CAPTURE MODAL */}
      {selectedProduct && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#12151a', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px', width: '90%', maxWidth: '400px', padding: '30px',
            position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <button 
              onClick={() => setSelectedProduct(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>Tenho Interesse</h3>
            <p style={{ fontSize: '0.85rem', color: '#888', margin: '0 0 20px 0' }}>{selectedProduct.name}</p>

            {successMsg ? (
              <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--color-accent-green)', padding: '15px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>
                {successMsg}
              </div>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault();
                setSubmitting(true);
                try {
                  const res = await apiFetch('/api/leads/public', {
                    method: 'POST',
                    body: JSON.stringify({ ...leadForm, productName: selectedProduct.name })
                  });
                  if(res.ok) {
                    setSuccessMsg('Interesse registrado com sucesso! Entraremos em contato em breve.');
                    setLeadForm({ name: '', phone: '', email: '' });
                  } else {
                    alert('Erro ao enviar.');
                  }
                } catch(e) {
                  console.error(e);
                  alert('Erro de conexão.');
                }
                setSubmitting(false);
              }}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px' }}>Seu Nome *</label>
                  <input type="text" required value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})}
                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px' }}>Seu WhatsApp *</label>
                  <input type="text" required placeholder="(11) 99999-9999" value={leadForm.phone} onChange={e => setLeadForm({...leadForm, phone: e.target.value})}
                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                </div>
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px' }}>Seu E-mail (Opcional)</label>
                  <input type="email" value={leadForm.email} onChange={e => setLeadForm({...leadForm, email: e.target.value})}
                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                </div>
                <button type="submit" disabled={submitting}
                  style={{ width: '100%', padding: '14px', background: 'var(--color-accent)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? 'Enviando...' : 'Enviar Interesse'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
