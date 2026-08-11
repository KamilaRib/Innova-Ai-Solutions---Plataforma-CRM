import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, PlusCircle, AlertCircle, Database, Cloud, User, Receipt, DollarSign, Wallet } from 'lucide-react';

const ProductCosts = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');

  const [productName, setProductName] = useState('Agente IA de Vendas');
  const [setupValue, setSetupValue] = useState(5000); // Exemplo fixo simulando vindo da API
  
  const [expenses, setExpenses] = useState([]);
  
  const [formData, setFormData] = useState({
    description: '',
    category: 'API LLM', // Categoria default
    value: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = [
    { id: 'API LLM', label: 'API LLM (OpenAI, etc)', icon: Database },
    { id: 'INFRA/CLOUD', label: 'Infra/Cloud (AWS, VPS)', icon: Cloud },
    { id: 'FREELANCER', label: 'Terceiros / Devs', icon: User },
    { id: 'IMPOSTOS', label: 'Impostos / Taxas', icon: Receipt },
    { id: 'OUTROS', label: 'Outros Custos', icon: DollarSign }
  ];

  const totalExpenses = expenses.reduce((acc, curr) => acc + parseFloat(curr.value || 0), 0);
  const realProfit = setupValue - totalExpenses;

  const handleAddExpense = () => {
    if (!formData.description || !formData.value) {
      alert("Preencha a descrição e o valor da despesa.");
      return;
    }
    
    const newExpense = {
      id: Date.now(),
      ...formData,
      value: parseFloat(formData.value)
    };
    
    setExpenses([...expenses, newExpense]);
    setFormData({ ...formData, description: '', value: '' });
  };

  const removeExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <button 
          onClick={() => navigate('/app/products')}
          style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Custos do Serviço (Despesas)</h1>
          <p style={{ opacity: 0.6, margin: 0, fontSize: '0.9rem', color: 'var(--color-accent-green)' }}>
            Serviço: {productName}
          </p>
        </div>
      </div>

      {/* Resumo Financeiro */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div className="card" style={{ background: '#12151a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase', marginBottom: '10px' }}>Valor de Setup (Venda)</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            R$ {setupValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
        
        <div className="card" style={{ background: '#12151a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase', marginBottom: '10px', color: '#ef4444' }}>Total de Despesas</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ef4444' }}>
            R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="card" style={{ background: '#12151a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.8rem', opacity: 0.8, textTransform: 'uppercase', marginBottom: '10px', color: 'var(--color-accent-green)', fontWeight: 'bold' }}>Lucro Líquido Real</div>
            <Wallet size={24} color="var(--color-accent-green)" opacity={0.8} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-accent-green)' }}>
            R$ {realProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        
        {/* Coluna Esquerda: Lançamento de Despesa */}
        <div style={{ flex: 1 }}>
          <div className="card" style={{ background: '#12151a', borderRadius: '12px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
              <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '8px', borderRadius: '8px' }}>
                <PlusCircle color="var(--color-accent-green)" size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Lançar Nova Despesa</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', opacity: 0.8 }}>Descrição do Gasto *</label>
                <input 
                  type="text" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className="input-field" 
                  placeholder="Ex: Assinatura n8n, API OpenAI..." 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '12px', opacity: 0.8 }}>Categoria</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {categories.map(cat => {
                    const isSelected = formData.category === cat.id;
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setFormData({...formData, category: cat.id})}
                        style={{
                          background: isSelected ? 'var(--color-accent-green)' : 'rgba(255,255,255,0.05)',
                          color: isSelected ? '#000' : '#fff',
                          border: `1px solid ${isSelected ? 'var(--color-accent-green)' : 'rgba(255,255,255,0.1)'}`,
                          padding: '8px 12px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: isSelected ? 'bold' : 'normal',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: '0.2s'
                        }}
                      >
                        <Icon size={14} /> {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', opacity: 0.8 }}>Valor (R$) *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={formData.value} 
                    onChange={e => setFormData({...formData, value: e.target.value})} 
                    className="input-field" 
                    placeholder="0,00" 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', opacity: 0.8 }}>Data da Despesa</label>
                  <input 
                    type="date" 
                    value={formData.date} 
                    onChange={e => setFormData({...formData, date: e.target.value})} 
                    className="input-field" 
                  />
                </div>
              </div>

              <button 
                onClick={handleAddExpense}
                style={{ 
                  marginTop: '10px', width: '100%',
                  background: 'var(--color-accent-green)', color: '#000', border: 'none', 
                  padding: '14px', borderRadius: '8px', fontWeight: 800, fontSize: '1rem',
                  cursor: 'pointer', transition: '0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
                }}
              >
                <PlusCircle size={18} /> Adicionar Custo
              </button>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Histórico */}
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '0.9rem', color: '#fff', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>Histórico de Gastos</h3>
          
          {expenses.length === 0 ? (
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', padding: '50px 20px', borderRadius: '12px', textAlign: 'center' }}>
              <AlertCircle size={32} opacity={0.3} style={{ marginBottom: '15px' }} />
              <p style={{ opacity: 0.5, margin: 0, fontSize: '0.9rem' }}>Nenhum custo registrado para este serviço ainda.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {expenses.map(expense => {
                const catInfo = categories.find(c => c.id === expense.category);
                const Icon = catInfo?.icon || DollarSign;
                
                return (
                  <div key={expense.id} className="card" style={{ background: '#12151a', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '10px' }}>
                        <Icon size={20} opacity={0.7} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px' }}>{expense.description}</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.5, display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>{catInfo?.label}</span>
                          <span>Data: {expense.date.split('-').reverse().join('/')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ef4444' }}>
                        - R$ {expense.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                      <button onClick={() => removeExpense(expense.id)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }} title="Excluir">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductCosts;
