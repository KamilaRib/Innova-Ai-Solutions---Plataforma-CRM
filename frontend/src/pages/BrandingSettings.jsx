import React, { useContext, useState, useEffect } from 'react';
import { SettingsContext } from '../context/SettingsContext';

const BrandingSettings = () => {
  const { settings, saveSettings } = useContext(SettingsContext);
  const [formData, setFormData] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await saveSettings(formData);
      if (result && result.success) {
        alert("Identidade visual salva com sucesso!");
      } else {
        alert("Erro ao salvar identidade visual: " + (result?.error || 'Acesso negado.'));
      }
    } catch (error) {
      alert("Erro de conexão ao salvar identidade visual.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-light)', marginBottom: '10px' }}>Identidade Visual</h1>
      <p style={{ opacity: 0.8, marginBottom: '30px' }}>Personalize as cores e a marca do seu sistema.</p>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card">
        <h3 style={{ color: 'var(--color-accent-cyan)', marginBottom: '20px' }}>Branding</h3>

        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Upload da Logomarca</label>
        <div style={{
          border: '2px dashed rgba(255,255,255,0.2)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
          background: 'rgba(0,0,0,0.2)',
          cursor: 'pointer',
          position: 'relative',
          marginBottom: '20px'
        }}>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleLogoUpload} 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
          />
          {formData.logo_url ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <img src={formData.logo_url} alt="Logo" style={{ maxHeight: '50px', maxWidth: '100%', objectFit: 'contain' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Clique na área para alterar</span>
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>
              Clique aqui e selecione o arquivo da sua marca
            </p>
          )}
        </div>
        
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Cor Principal da Marca (Selecione ou digite o código HEX)</label>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <input 
            className="input-field" 
            type="color" 
            name="primary_color" 
            value={formData.primary_color || '#00F5FF'} 
            onChange={handleChange} 
            style={{ padding: '2px', height: '45px', width: '70px', cursor: 'pointer' }} 
          />
          <input 
            className="input-field" 
            type="text" 
            name="primary_color" 
            value={formData.primary_color || '#00F5FF'} 
            onChange={handleChange} 
            style={{ height: '45px', flex: 1, fontFamily: 'monospace', letterSpacing: '1px' }} 
            placeholder="#00F5FF"
            maxLength={7}
          />
        </div>

        <button 
          className="btn-primary" 
          onClick={handleSave} 
          disabled={isSaving} 
          style={{ marginTop: '30px', width: '100%', opacity: isSaving ? 0.7 : 1, transition: 'all 0.2s' }}
        >
          {isSaving ? 'Salvando Alterações...' : 'Salvar Identidade'}
        </button>
        </div>
      </div>
    </div>
  );
};

export default BrandingSettings;
