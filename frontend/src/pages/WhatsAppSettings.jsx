import React, { useContext, useState, useEffect } from 'react';
import { SettingsContext } from '../context/SettingsContext';

const WhatsAppSettings = () => {
  const { settings, saveSettings } = useContext(SettingsContext);
  const [formData, setFormData] = useState(settings);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSave = async () => {
    const result = await saveSettings(formData);
    if (result.success) {
      alert("Credenciais do WhatsApp salvas com sucesso!");
    } else {
      alert("Erro ao salvar credenciais.");
    }
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-light)', marginBottom: '10px' }}>WhatsApp API</h1>
      <p style={{ opacity: 0.8, marginBottom: '30px' }}>Configure as chaves e tokens da Meta Cloud API.</p>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card">
        <h3 style={{ color: '#39FF14', marginBottom: '20px' }}>Credenciais Meta</h3>
        
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Phone Number ID</label>
        <input className="input-field" type="text" name="whatsapp_phone_number_id" value={formData.whatsapp_phone_number_id || ''} onChange={handleChange} />
        
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Access Token Principal</label>
        <input className="input-field" type="password" name="whatsapp_access_token" value={formData.whatsapp_access_token || ''} onChange={handleChange} />
        
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Token de Verificação Webhook</label>
        <input className="input-field" type="text" name="whatsapp_verify_token" value={formData.whatsapp_verify_token || ''} onChange={handleChange} />

        <button className="btn-primary" onClick={handleSave} style={{ marginTop: '20px' }}>Salvar Configurações</button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppSettings;
