import React, { useState, useEffect } from 'react';
import { Facebook, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { apiFetch } from '../utils/api';

const FacebookSettings = () => {
  const [formData, setFormData] = useState({
    facebook_url: '',
    n8n_social_webhook: '',
    n8n_social_api_key: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadIntegration = async () => {
      try {
        const response = await apiFetch('/api/integrations/FACEBOOK');
        const result = await response.json();
        if (result.success && result.data) {
          setFormData({
            facebook_url: result.data.credentials?.facebook_url || '',
            n8n_social_webhook: result.data.n8n_webhook || '',
            n8n_social_api_key: result.data.credentials?.api_key || ''
          });
        }
      } catch (e) {
        console.error("Erro ao carregar Facebook", e);
      }
    };
    loadIntegration();
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await apiFetch('/api/integrations', {
        method: 'POST',
        body: JSON.stringify({
          provider: 'FACEBOOK',
          n8n_webhook: formData.n8n_social_webhook,
          credentials: {
            facebook_url: formData.facebook_url,
            api_key: formData.n8n_social_api_key
          }
        })
      });
      const result = await response.json();
      if (result.success) {
        alert("Configurações do Facebook salvas!");
      } else {
        alert("Erro ao salvar Facebook.");
      }
    } catch (e) {
      alert("Erro de conexão.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-light)', marginBottom: '10px' }}>Facebook</h1>
      <p style={{ opacity: 0.8, marginBottom: '30px' }}>Configure sua integração com o Facebook.</p>

      {/* PAINEL DE MÉTRICAS */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px' }}>
          <div style={{ background: '#1877F21a', padding: '10px', borderRadius: '12px', color: '#1877F2' }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: '700', textTransform: 'uppercase' }}>Alcance Semanal</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>+12%</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px' }}>
          <div style={{ background: '#1877F21a', padding: '10px', borderRadius: '12px', color: '#1877F2' }}>
            <Users size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: '700', textTransform: 'uppercase' }}>Seguidores Totais</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>45.2k</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px' }}>
          <div style={{ background: '#1877F21a', padding: '10px', borderRadius: '12px', color: '#1877F2' }}>
            <BarChart3 size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: '700', textTransform: 'uppercase' }}>Engajamento</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>3.5%</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card" style={{ borderTop: '4px solid #1877F2' }}>
          <h3 style={{ color: '#1877F2', marginBottom: '20px' }}><Facebook size={20} style={{verticalAlign:'middle', marginRight:'8px'}}/> Perfil Facebook</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>URL do Perfil / Página</label>
            <input className="input-field" type="url" name="facebook_url" value={formData.facebook_url || ''} onChange={handleChange} placeholder="https://facebook.com/..." />
          </div>
          <button className="btn-primary" onClick={handleSave} disabled={isSaving} style={{ width: '100%', background: '#1877F2', opacity: isSaving ? 0.7 : 1 }}>{isSaving ? 'Salvando...' : 'Salvar Perfil'}</button>
        </div>

        <div className="card" style={{ borderTop: '4px solid #1877F2' }}>
          <h3 style={{ color: '#1877F2', marginBottom: '20px' }}>Automação n8n (Facebook)</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Webhook do n8n</label>
            <input className="input-field" type="url" name="n8n_social_webhook" value={formData.n8n_social_webhook || ''} onChange={handleChange} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>API Token</label>
            <input className="input-field" type="password" name="n8n_social_api_key" value={formData.n8n_social_api_key || ''} onChange={handleChange} autoComplete="new-password" />
          </div>
          <button className="btn-primary" onClick={handleSave} disabled={isSaving} style={{ width: '100%', background: '#1877F2', opacity: isSaving ? 0.7 : 1 }}>{isSaving ? 'Salvando...' : 'Salvar Automação'}</button>
        </div>
      </div>
    </div>
  );
};

export default FacebookSettings;
