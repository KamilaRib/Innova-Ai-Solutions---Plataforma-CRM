import React, { useState, useEffect } from 'react';
import { Instagram, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { apiFetch } from '../utils/api';

const InstagramSettings = () => {
  const [formData, setFormData] = useState({
    instagram_url: '',
    n8n_autoreply_webhook: '',
    n8n_autoreply_token: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadIntegration = async () => {
      try {
        const response = await apiFetch('/api/integrations/INSTAGRAM');
        const result = await response.json();
        if (result.success && result.data) {
          setFormData({
            instagram_url: result.data.credentials?.instagram_url || '',
            n8n_autoreply_webhook: result.data.n8n_webhook || '',
            n8n_autoreply_token: result.data.credentials?.api_key || ''
          });
        }
      } catch (e) {
        console.error("Erro ao carregar Instagram", e);
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
          provider: 'INSTAGRAM',
          n8n_webhook: formData.n8n_autoreply_webhook,
          credentials: {
            instagram_url: formData.instagram_url,
            api_key: formData.n8n_autoreply_token
          }
        })
      });
      const result = await response.json();
      if (result.success) {
        alert("Configurações do Instagram salvas!");
      } else {
        alert("Erro ao salvar Instagram.");
      }
    } catch (e) {
      alert("Erro de conexão.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-light)', marginBottom: '10px' }}>Instagram</h1>
      <p style={{ opacity: 0.8, marginBottom: '30px' }}>Configure sua integração com o Instagram.</p>

      {/* PAINEL DE MÉTRICAS */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px' }}>
          <div style={{ background: '#E1306C1a', padding: '10px', borderRadius: '12px', color: '#E1306C' }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: '700', textTransform: 'uppercase' }}>Alcance Semanal</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>+8.4%</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px' }}>
          <div style={{ background: '#E1306C1a', padding: '10px', borderRadius: '12px', color: '#E1306C' }}>
            <Users size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: '700', textTransform: 'uppercase' }}>Seguidores Totais</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>12.8k</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px' }}>
          <div style={{ background: '#E1306C1a', padding: '10px', borderRadius: '12px', color: '#E1306C' }}>
            <BarChart3 size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: '700', textTransform: 'uppercase' }}>Engajamento</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>4.2%</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card" style={{ borderTop: '4px solid #E1306C' }}>
          <h3 style={{ color: '#E1306C', marginBottom: '20px' }}><Instagram size={20} style={{verticalAlign:'middle', marginRight:'8px'}}/> Perfil Instagram</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>URL do Perfil / @handle</label>
            <input className="input-field" type="url" name="instagram_url" value={formData.instagram_url || ''} onChange={handleChange} placeholder="https://instagram.com/..." />
          </div>
          <button className="btn-primary" onClick={handleSave} disabled={isSaving} style={{ width: '100%', background: '#E1306C', opacity: isSaving ? 0.7 : 1 }}>{isSaving ? 'Salvando...' : 'Salvar Perfil'}</button>
        </div>

        <div className="card" style={{ borderTop: '4px solid #E1306C' }}>
          <h3 style={{ color: '#E1306C', marginBottom: '20px' }}>Automação n8n (Instagram)</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Webhook (Auto-Reply)</label>
            <input className="input-field" type="url" name="n8n_autoreply_webhook" value={formData.n8n_autoreply_webhook || ''} onChange={handleChange} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>API Token</label>
            <input className="input-field" type="password" name="n8n_autoreply_token" value={formData.n8n_autoreply_token || ''} onChange={handleChange} autoComplete="off" />
          </div>
          <button className="btn-primary" onClick={handleSave} disabled={isSaving} style={{ width: '100%', background: '#E1306C', opacity: isSaving ? 0.7 : 1 }}>{isSaving ? 'Salvando...' : 'Salvar Automação'}</button>
        </div>
      </div>
    </div>
  );
};

export default InstagramSettings;
