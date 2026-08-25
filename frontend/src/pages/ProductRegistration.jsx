import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Bot, DollarSign, PenTool, Image as ImageIcon, Save, ArrowLeft, Info, FileText } from 'lucide-react';
import { apiFetch } from '../utils/api';

const ProductRegistration = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'AGENTE IA',
    ai_model: 'gpt-4o-mini',
    memory_type: 'RAG (Vector Database)',
    delivery_time: '7 a 15 dias',
    setup_price: '',
    monthly_price: '',
    warranty: 'SIM (30 DIAS DE SUPORTE INCLUSO)',
    description: '',
    image_url: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (productId) {
      apiFetch('/api/catalog/products')
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            const prod = result.data.find(p => String(p.id) === String(productId));
            if (prod) {
              setFormData({
                name: prod.name || '',
                category: prod.category || 'AGENTE IA',
                ai_model: prod.ai_model || 'gpt-4o-mini',
                memory_type: prod.memory_type || 'RAG (Vector Database)',
                delivery_time: prod.delivery_time || '7 a 15 dias',
                setup_price: prod.price || '',
                monthly_price: prod.monthly_price || '',
                warranty: prod.warranty || 'SIM (30 DIAS DE SUPORTE INCLUSO)',
                description: prod.desc || '',
                image_url: prod.image_url || ''
              });
            }
          }
        })
        .catch(console.error);
    }
  }, [productId]);

  const handleSave = async () => {
    if (!formData.name || !formData.setup_price) {
      alert('Preencha os campos obrigatórios (Nome e Preço Setup).');
      return;
    }
    setLoading(true);
    try {
      const url = productId ? `/api/catalog/products/${productId}` : '/api/catalog/products';
      const method = productId ? 'PATCH' : 'POST';

      const response = await apiFetch(url, {
        method,
        body: JSON.stringify({
          name: formData.name,
          price: formData.setup_price,
          desc: formData.description,
          image_url: formData.image_url,
          // Pode expandir depois pra salvar as outras configs
          category: formData.category,
          ai_model: formData.ai_model
        })
      });

      if (response.ok) {
        navigate('/app/products');
      } else {
        alert('Erro ao salvar serviço.');
      }
    } catch (err) {
      alert('Falha na comunicação com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
      <div style={{ background: 'rgba(0, 132, 255, 0.1)', padding: '12px', borderRadius: '10px' }}>
        <Icon color="var(--color-accent)" size={24} />
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{title}</h3>
        <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.6 }}>{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
      
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={() => navigate('/app/products')}
            style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>{productId ? 'Editar Serviço / Produto' : 'Novo Serviço / Produto'}</h1>
            <p style={{ opacity: 0.6, margin: 0 }}>Configure um novo escopo para seu portfólio comercial.</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* Bloco 1: Ficha Técnica */}
        <div className="card" style={{ background: '#12151a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '30px' }}>
          <SectionHeader icon={Info} title="Ficha Técnica" subtitle="Informações principais da solução ou agente." />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', opacity: 0.8 }}>Nome do Serviço/Produto *</label>
              <input name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="Ex: Agente IA Especialista em Vendas" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', opacity: 0.8 }}>Categoria Principal</label>
              <select name="category" value={formData.category} onChange={handleChange} className="input-field" style={{ appearance: 'none', cursor: 'pointer' }}>
                <option value="AGENTE IA">Agente de IA (Chatbot)</option>
                <option value="CRM">Implantação CRM</option>
                <option value="AUTOMAÇÃO">Automação (n8n/Make)</option>
                <option value="CONSULTORIA">Consultoria Estratégica</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', opacity: 0.8 }}>Modelo do Agente (LLM)</label>
              <select name="ai_model" value={formData.ai_model} onChange={handleChange} className="input-field" style={{ appearance: 'none', cursor: 'pointer' }}>
                <option value="gpt-4o">GPT-4o (OpenAI)</option>
                <option value="gpt-4o-mini">GPT-4o Mini (OpenAI)</option>
                <option value="claude-3.5-sonnet">Claude 3.5 Sonnet (Anthropic)</option>
                <option value="llama-3">Llama 3 (Meta)</option>
                <option value="N/A">Não aplicável</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', opacity: 0.8 }}>Prazo de Implantação</label>
              <input name="delivery_time" value={formData.delivery_time} onChange={handleChange} className="input-field" placeholder="Ex: 7 a 15 dias úteis" />
            </div>
          </div>
        </div>

        {/* Bloco 2: Preços */}
        <div className="card" style={{ background: '#12151a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '30px' }}>
          <SectionHeader icon={DollarSign} title="Preços, Suporte & Condições" subtitle="Configuração comercial e setup do projeto." />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', opacity: 0.8 }}>Valor de Setup (R$) *</label>
              <input type="number" step="0.01" name="setup_price" value={formData.setup_price} onChange={handleChange} className="input-field" placeholder="R$ 0,00" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', opacity: 0.8 }}>Valor da Mensalidade (R$)</label>
              <input type="number" step="0.01" name="monthly_price" value={formData.monthly_price} onChange={handleChange} className="input-field" placeholder="R$ 0,00" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', opacity: 0.8 }}>Garantia / Suporte Incluso</label>
              <select name="warranty" value={formData.warranty} onChange={handleChange} className="input-field" style={{ appearance: 'none', cursor: 'pointer' }}>
                <option value="SIM (30 DIAS DE SUPORTE INCLUSO)">SIM (30 DIAS DE SUPORTE INCLUSO)</option>
                <option value="CONTRATO SLA MENSAL">CONTRATO SLA MENSAL</option>
                <option value="SEM SUPORTE APÓS ENTREGA">SEM SUPORTE APÓS ENTREGA</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', opacity: 0.8 }}>Base de Conhecimento</label>
              <select name="memory_type" value={formData.memory_type} onChange={handleChange} className="input-field" style={{ appearance: 'none', cursor: 'pointer' }}>
                <option value="RAG (Vector Database)">RAG Integrado (Leitura de Documentos)</option>
                <option value="Prompt Fixo">Prompt Contextual Fixo</option>
                <option value="Híbrido">Híbrido (Prompt + RAG)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bloco 3: Detalhes do Escopo */}
        <div className="card" style={{ background: '#12151a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '30px' }}>
          <SectionHeader icon={PenTool} title="Escopo Interno / Funcionalidades" subtitle="Descreva o que o agente faz, ferramentas conectadas, integrações, etc." />
          
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            className="input-field" 
            style={{ minHeight: '120px', resize: 'vertical' }} 
            placeholder="Detalhes técnicos, integrações necessárias (n8n, Evolution), personas do Agente..."
          />
        </div>

        {/* Bloco 4: Mídias */}
        <div className="card" style={{ background: '#12151a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '30px' }}>
          <SectionHeader icon={ImageIcon} title="Anexos e Mídia (Vitrine)" subtitle="Imagem de capa que aparecerá na sua Landing Page." />
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', opacity: 0.8 }}>URL da Imagem de Capa</label>
            <input name="image_url" value={formData.image_url} onChange={handleChange} className="input-field" placeholder="https://exemplo.com/imagem-agente.jpg" />
          </div>

          <div style={{ 
            marginTop: '25px', padding: '40px', border: '2px dashed rgba(255,255,255,0.1)', 
            borderRadius: '12px', textAlign: 'center', cursor: 'pointer',
            transition: 'border 0.2s', background: 'rgba(255,255,255,0.01)'
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
          >
            <FileText size={32} opacity={0.5} style={{ marginBottom: '10px' }} />
            <div style={{ fontWeight: 600 }}>Arraste ou clique para selecionar a Proposta Comercial (PDF)</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '5px' }}>Será enviada automaticamente pelo Agente quando solicitado. (Em breve)</div>
          </div>
        </div>

      </div>

      {/* Footer / Salvar */}
      <div style={{ position: 'sticky', bottom: '0', background: '#0a0b0d', padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '40px', display: 'flex', justifyContent: 'flex-start', gap: '20px' }}>
        <button 
          onClick={handleSave}
          disabled={loading}
          style={{ 
            background: 'var(--color-accent)', color: '#000', border: 'none', 
            padding: '12px 30px', borderRadius: '8px', fontWeight: 800, fontSize: '1rem',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
            opacity: loading ? 0.7 : 1, transition: '0.2s',
            boxShadow: '0 4px 15px rgba(0, 132, 255,0.3)'
          }}
        >
          <Save size={20} />
          {loading ? 'SALVANDO...' : (productId ? 'Salvar Alterações' : 'Cadastrar Serviço / Agente')}
        </button>
        <button 
          onClick={() => navigate('/app/products')}
          style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 30px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
        >
          Cancelar
        </button>
      </div>

    </div>
  );
};

export default ProductRegistration;
