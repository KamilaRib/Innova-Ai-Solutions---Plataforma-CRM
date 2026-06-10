import React, { useContext, useState, useEffect } from 'react';
import { SettingsContext } from '../context/SettingsContext';

const BrandingSettings = () => {
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
      alert("Identidade visual salva com sucesso!");
    } else {
      alert("Erro ao salvar identidade visual.");
    }
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-light)', marginBottom: '10px' }}>Identidade Visual</h1>
      <p style={{ opacity: 0.8, marginBottom: '30px' }}>Personalize as cores e a marca do seu sistema.</p>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card">
        <h3 style={{ color: 'var(--color-accent-cyan)', marginBottom: '20px' }}>Branding</h3>
        
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Nome do Sistema / Empresa</label>
        <input className="input-field" type="text" name="business_name" value={formData.business_name || ''} onChange={handleChange} />
        
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>URL da Logomarca</label>
        <input className="input-field" type="url" name="logo_url" value={formData.logo_url || ''} onChange={handleChange} />
        
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Cor Principal da Marca</label>
        <input className="input-field" type="color" name="primary_color" value={formData.primary_color || '#00F5FF'} onChange={handleChange} style={{ padding: '2px', height: '45px' }} />

        <button className="btn-primary" onClick={handleSave} style={{ marginTop: '20px' }}>Salvar Identidade</button>
        </div>
      </div>
    </div>
  );
};

export default BrandingSettings;
