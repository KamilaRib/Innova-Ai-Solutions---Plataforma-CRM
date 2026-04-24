import React, { useContext, useState, useEffect } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { Facebook, Instagram, Share2 } from 'lucide-react';

const SocialMediaSettings = () => {
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
      alert("Redes sociais salvas com sucesso!");
    } else {
      alert("Erro ao salvar redes sociais.");
    }
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-light)', marginBottom: '10px' }}>Redes Sociais</h1>
      <p style={{ opacity: 0.8, marginBottom: '30px' }}>Conecte seus perfis socais para facilitar o acesso e integrações.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {/* Perfis Sociais */}
        <div className="card" style={{ borderTop: '4px solid #FF0050', margin: 0 }}>
          <h3 style={{ color: '#FF0050', marginBottom: '20px' }}>Perfis Sociais</h3>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>
              <Facebook size={16} color="#1877F2" /> Facebook URL
            </label>
            <input className="input-field" type="url" name="facebook_url" value={formData.facebook_url || ''} onChange={handleChange} placeholder="https://facebook.com/seu-perfil" />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>
              <Instagram size={16} color="#E1306C" /> Instagram URL
            </label>
            <input className="input-field" type="url" name="instagram_url" value={formData.instagram_url || ''} onChange={handleChange} placeholder="https://instagram.com/seu-perfil" />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>
              <Share2 size={16} color="#000000" /> TikTok URL
            </label>
            <input className="input-field" type="url" name="tiktok_url" value={formData.tiktok_url || ''} onChange={handleChange} placeholder="https://tiktok.com/@seu-perfil" />
          </div>
          <button className="btn-primary" onClick={handleSave} style={{ width: '100%' }}>Salvar Redes Sociais</button>
        </div>

        {/* Integração n8n (Automação) */}
        <div className="card" style={{ borderTop: '4px solid #FF6B00', margin: 0 }}>
          <h3 style={{ color: '#FF6B00', marginBottom: '20px' }}>Integração n8n (Automação)</h3>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Webhook URL do n8n (Social Receiver)</label>
            <input className="input-field" type="url" name="n8n_social_webhook" value={formData.n8n_social_webhook || ''} onChange={handleChange} placeholder="https://n8n.seusite.com/webhook/..." />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>n8n API Key / Token</label>
            <input className="input-field" type="password" name="n8n_social_api_key" value={formData.n8n_social_api_key || ''} onChange={handleChange} />
          </div>
          <p style={{ fontSize: '0.75rem', opacity: 0.5, fontStyle: 'italic', marginBottom: '20px' }}>
            Este token será usado pelo CRM para disparar eventos para o n8n.
          </p>
          <button className="btn-primary" onClick={handleSave} style={{ width: '100%', background: '#FF6B00' }}>Salvar Automação n8n</button>
        </div>

        {/* Automação de Resposta */}
        <div className="card" style={{ borderTop: '4px solid #FF6B00', margin: 0 }}>
          <h3 style={{ color: '#FF6B00', marginBottom: '20px' }}>n8n: Automação de Resposta</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Webhook URL (Auto-Reply)</label>
            <input className="input-field" type="url" name="n8n_autoreply_webhook" value={formData.n8n_autoreply_webhook || ''} onChange={handleChange} placeholder="https://..." />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>API Token (Auto-Reply)</label>
            <input className="input-field" type="password" name="n8n_autoreply_token" value={formData.n8n_autoreply_token || ''} onChange={handleChange} />
          </div>
          <button className="btn-primary" onClick={handleSave} style={{ width: '100%', background: '#FF6B00', fontSize: '0.85rem' }}>Salvar Resposta Automática</button>
        </div>

        {/* Extração de Leads */}
        <div className="card" style={{ borderTop: '4px solid #FF6B00', margin: 0 }}>
          <h3 style={{ color: '#FF6B00', marginBottom: '20px' }}>n8n: Extração de Leads</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Webhook URL (Lead Collector)</label>
            <input className="input-field" type="url" name="n8n_leadextract_webhook" value={formData.n8n_leadextract_webhook || ''} onChange={handleChange} placeholder="https://..." />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>API Token (Lead Collector)</label>
            <input className="input-field" type="password" name="n8n_leadextract_token" value={formData.n8n_leadextract_token || ''} onChange={handleChange} />
          </div>
          <button className="btn-primary" onClick={handleSave} style={{ width: '100%', background: '#FF6B00', fontSize: '0.85rem' }}>Salvar Extração de Leads</button>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaSettings;
