import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Info, User, Briefcase, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiFetch } from '../utils/api';

const RegisterSale = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);

  // Formulário Esquerdo
  const [saleData, setSaleData] = useState({
    saleValue: '',
    saleDate: new Date().toISOString().split('T')[0],
    buyerName: '',
    whatsapp: '',
    document: '',
    address: '',
    seller: 'Kamila Ribeiro',
    commissionType: 'FIXO',
    commissionValue: ''
  });

  // Formulário Direito (Pagamentos)
  const [payments, setPayments] = useState([
    { id: 1, method: 'PIX', value: '', notes: '' }
  ]);

  useEffect(() => {
    // Se tiver productId, podemos buscar os dados prévios (nome, preco).
    // Aqui vamos fazer um fetch fake para simular. Na vida real bateria na API.
    if (productId) {
      setProduct({ name: `Serviço #${productId} Selecionado` });
      // setSaleData(prev => ({ ...prev, saleValue: '1500' }));
    }
  }, [productId]);

  const handleSaleChange = (e) => {
    const { name, value } = e.target;
    setSaleData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (id, field, value) => {
    setPayments(payments.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const addPaymentMethod = () => {
    setPayments([...payments, { id: Date.now(), method: 'PIX', value: '', notes: '' }]);
  };

  const removePaymentMethod = (id) => {
    if (payments.length > 1) {
      setPayments(payments.filter(p => p.id !== id));
    }
  };

  // Cálculos
  const totalSaleValue = parseFloat(saleData.saleValue || 0);
  const totalPaidValue = payments.reduce((acc, p) => acc + parseFloat(p.value || 0), 0);
  const valuesMatch = totalSaleValue > 0 && totalPaidValue === totalSaleValue;

  const handleRegisterSale = async () => {
    if (!valuesMatch) {
      alert('Atenção: O Valor Total Lançado (Pagamentos) deve bater exatamente com o Valor da Venda.');
      return;
    }
    if (!saleData.buyerName) {
      alert('Informe o Nome do Cliente/Empresa.');
      return;
    }

    setLoading(true);
    // Simular salvamento
    setTimeout(() => {
      setLoading(false);
      alert('Venda registrada com sucesso!');
      navigate('/app/products');
    }, 1000);
  };

  const SectionHeader = ({ icon: Icon, title }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
      <Icon color="var(--color-accent)" size={20} />
      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h3>
    </div>
  );

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto', color: '#fff' }}>
      
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <button 
          onClick={() => navigate('/app/products')}
          style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Registrar Venda</h1>
          <p style={{ opacity: 0.6, margin: 0, fontSize: '0.9rem', color: 'var(--color-accent)' }}>
            {product ? product.name : 'Venda Avulsa'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        
        {/* Coluna Esquerda: Formulários */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Informações da Venda */}
          <div className="card" style={{ background: '#12151a', borderRadius: '12px', padding: '25px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <SectionHeader icon={Info} title="Informações da Venda" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', opacity: 0.8 }}>Valor da Venda (R$)</label>
                <input type="number" step="0.01" name="saleValue" value={saleData.saleValue} onChange={handleSaleChange} className="input-field" placeholder="R$ 0,00" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', opacity: 0.8 }}>Data da Venda</label>
                <input type="date" name="saleDate" value={saleData.saleDate} onChange={handleSaleChange} className="input-field" />
              </div>
            </div>
          </div>

          {/* Dados do Comprador */}
          <div className="card" style={{ background: '#12151a', borderRadius: '12px', padding: '25px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <SectionHeader icon={User} title="Dados do Comprador" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', opacity: 0.8 }}>Nome Completo / Empresa *</label>
                <input name="buyerName" value={saleData.buyerName} onChange={handleSaleChange} className="input-field" placeholder="Ex: Innova Corp" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', opacity: 0.8 }}>WhatsApp (DDD + Número) *</label>
                <input name="whatsapp" value={saleData.whatsapp} onChange={handleSaleChange} className="input-field" placeholder="Ex: (11) 99999-9999" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', opacity: 0.8 }}>CPF ou CNPJ (Opcional)</label>
                  <input name="document" value={saleData.document} onChange={handleSaleChange} className="input-field" placeholder="00.000.000/0001-00" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', opacity: 0.8 }}>Endereço Completo (Opcional)</label>
                  <input name="address" value={saleData.address} onChange={handleSaleChange} className="input-field" placeholder="Rua, Avenida..." />
                </div>
              </div>
            </div>
          </div>

          {/* Comissão do Vendedor */}
          <div className="card" style={{ background: '#12151a', borderRadius: '12px', padding: '25px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <SectionHeader icon={Briefcase} title="Comissão / Responsável" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', opacity: 0.8 }}>Vendedor Responsável</label>
                <select name="seller" value={saleData.seller} onChange={handleSaleChange} className="input-field" style={{ appearance: 'none', cursor: 'pointer' }}>
                  <option value="Kamila Ribeiro">Kamila Ribeiro</option>
                  <option value="Agente IA (Automático)">Agente IA (Automático)</option>
                  <option value="Nenhum">--- Nenhum ---</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', opacity: 0.8 }}>Tipo</label>
                  <select name="commissionType" value={saleData.commissionType} onChange={handleSaleChange} className="input-field" style={{ appearance: 'none', cursor: 'pointer' }}>
                    <option value="FIXO">Valor Fixo (R$)</option>
                    <option value="PERCENTUAL">Percentual (%)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', opacity: 0.8 }}>Comissão</label>
                  <input type="number" step="0.01" name="commissionValue" value={saleData.commissionValue} onChange={handleSaleChange} className="input-field" placeholder="0,00" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Composição de Pagamento (Sticky) */}
        <div style={{ flex: 1, position: 'sticky', top: '30px' }}>
          <div className="card" style={{ background: '#12151a', borderRadius: '12px', padding: '25px', border: '1px solid rgba(0, 132, 255, 0.2)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CreditCard color="var(--color-accent)" size={20} />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase' }}>Pagamentos</h3>
              </div>
              <button onClick={addPaymentMethod} style={{ background: 'transparent', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>
                + Adicionar
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '400px', overflowY: 'auto', paddingRight: '5px' }}>
              {payments.map((p, index) => (
                <div key={p.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.75rem', opacity: 0.5, textTransform: 'uppercase' }}>Pagamento #{index + 1}</span>
                    {payments.length > 1 && (
                      <button onClick={() => removePaymentMethod(p.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem' }}>Remover</button>
                    )}
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', opacity: 0.8 }}>Forma de Pagamento</label>
                    <select value={p.method} onChange={(e) => handlePaymentChange(p.id, 'method', e.target.value)} className="input-field" style={{ appearance: 'none', cursor: 'pointer', background: '#1c1f26' }}>
                      <option value="PIX">PIX</option>
                      <option value="CARTÃO DE CRÉDITO">Cartão de Crédito</option>
                      <option value="BOLETO">Boleto Bancário</option>
                      <option value="TRANSFERÊNCIA">Transferência</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', opacity: 0.8 }}>Valor Pago (R$)</label>
                    <input type="number" step="0.01" value={p.value} onChange={(e) => handlePaymentChange(p.id, 'value', e.target.value)} className="input-field" placeholder="R$ 0,00" style={{ background: '#1c1f26' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Totalizador */}
            <div style={{ 
              marginTop: '25px', padding: '15px', borderRadius: '8px', 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: valuesMatch ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${valuesMatch ? 'var(--color-accent-green)' : 'rgba(255,255,255,0.1)'}`,
              transition: 'all 0.3s'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '2px', textTransform: 'uppercase' }}>Total Pago Lançado</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: valuesMatch ? 'var(--color-accent-green)' : '#fff' }}>
                  R$ {totalPaidValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                {!valuesMatch && totalSaleValue > 0 && (
                  <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px' }}>
                    Diferença: R$ {(totalSaleValue - totalPaidValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                )}
              </div>
              <div>
                {valuesMatch ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--color-accent-green)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    <CheckCircle2 size={16} /> VALORES BATEM
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ef4444', fontSize: '0.8rem', fontWeight: 'bold', opacity: totalSaleValue > 0 ? 1 : 0 }}>
                    <AlertCircle size={16} /> PENDENTE
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={handleRegisterSale}
              disabled={loading}
              style={{ 
                width: '100%', marginTop: '20px',
                background: 'var(--color-accent)', color: '#000', border: 'none', 
                padding: '15px', borderRadius: '8px', fontWeight: 800, fontSize: '1rem',
                cursor: 'pointer', transition: '0.2s',
                opacity: (loading || (!valuesMatch && totalSaleValue > 0)) ? 0.5 : 1,
                boxShadow: valuesMatch ? '0 4px 15px rgba(0, 132, 255,0.3)' : 'none'
              }}
            >
              {loading ? 'Processando...' : 'Confirmar e Registrar Venda'}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSale;
