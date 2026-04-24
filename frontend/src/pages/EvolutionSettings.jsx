import React, { useContext, useState, useEffect } from 'react';
import { SettingsContext } from '../context/SettingsContext';

const EvolutionSettings = () => {
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
      alert("Configurações do Evolution API salvas!");
    } else {
      alert("Erro ao salvar Evolution API.");
    }
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-light)', marginBottom: '10px' }}>Evolution API</h1>
      <p style={{ opacity: 0.8, marginBottom: '30px' }}>Integração com o motor Evolution para instâncias de WhatsApp.</p>

      <div className="card" style={{ maxWidth: '600px', borderTop: '4px solid #22C55E' }}>
        <h3 style={{ color: '#22C55E', marginBottom: '20px' }}>Conexão Evolution</h3>
        
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>URL da API (Evolution)</label>
        <input className="input-field" type="url" name="evolution_api_url" value={formData.evolution_api_url || ''} onChange={handleChange} placeholder="https://api.meuevolution.com" />
        
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>API Key / Global Token</label>
        <input className="input-field" type="password" name="evolution_api_key" value={formData.evolution_api_key || ''} onChange={handleChange} autoComplete="off" />

        <button className="btn-primary" onClick={handleSave} style={{ marginTop: '20px' }}>Salvar Configurações</button>
      </div>
    </div>
  );
};

export default EvolutionSettings;
