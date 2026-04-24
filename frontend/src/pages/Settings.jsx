import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [formData, setFormData] = useState({
    business_name: '', logo_url: '', primary_color: '#00F5FF',
    whatsapp_phone_number_id: '', whatsapp_access_token: '', whatsapp_verify_token: '',
    evolution_webhook_url: '', evolution_api_key: ''
  });

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${API_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        if(data.success && data.data) {
          setFormData(prev => ({...prev, ...data.data}));
        }
      }).catch(err => console.error("Erro carrega dados config", err));
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSave = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${API_URL}/api/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
      alert("Configurações salvas. Recarregue a página para ver as novas cores da marca em todo o sistema!");
    }).catch(err => alert("Erro ao salvar. Verifique se o backend está rodando."));
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-light)', marginBottom: '10px' }}>Configurações</h1>
      <p style={{ opacity: 0.8, marginBottom: '30px' }}>
        Gerencie a marca do seu SaaS e as credenciais do motor de IA.
      </p>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* White-Label / Marca Customizada */}
        <div id="branding" className="card" style={{ flex: '1 1 400px', borderTop: '4px solid var(--color-accent-cyan)' }}>
          <h3 style={{ color: 'var(--color-accent-cyan)', marginBottom: '20px' }}>Identidade Visual (Branding)</h3>
          
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Nome do Sistema / Empresa</label>
          <input className="input-field" type="text" name="business_name" value={formData.business_name || ''} onChange={handleChange} placeholder="Ex: Meu CRM" />
          
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>URL da Logomarca (Deixe em branco para usar o Texto)</label>
          <input className="input-field" type="url" name="logo_url" value={formData.logo_url || ''} onChange={handleChange} placeholder="https://meusite.com/logo.png" />
          
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Cor Principal da Marca</label>
          <input className="input-field" type="color" name="primary_color" value={formData.primary_color || '#00F5FF'} onChange={handleChange} style={{ padding: '2px', height: '45px' }} />
        </div>

        {/* WhatsApp & Motores */}
        <div id="whatsapp" className="card" style={{ flex: '1 1 400px', borderTop: '4px solid #39FF14' }}>
          <h3 style={{ color: '#39FF14', marginBottom: '20px' }}>WhatsApp Cloud API (Meta)</h3>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Phone Number ID</label>
          <input className="input-field" type="text" name="whatsapp_phone_number_id" value={formData.whatsapp_phone_number_id || ''} onChange={handleChange} />
          
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Access Token Principal</label>
          <input className="input-field" type="password" name="whatsapp_access_token" value={formData.whatsapp_access_token || ''} onChange={handleChange} />
          
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.75rem', opacity: 0.7 }}>Token de Verificação Webhook</label>
          <input className="input-field" type="text" name="whatsapp_verify_token" value={formData.whatsapp_verify_token || ''} onChange={handleChange} />
        </div>
        
        {/* Botão de salvar comum */}
        <div style={{ width: '100%', marginTop: '10px' }}>
          <button className="btn-primary" onClick={handleSave} style={{ maxWidth: '300px' }}>Salvar Configurações</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
