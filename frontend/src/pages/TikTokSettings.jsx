import React, { useState, useEffect } from 'react';
import { Share2, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { apiFetch } from '../utils/api';

const TikTokIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-1.26-.88-2.22-2.19-2.68-3.64-.03 4.14-.02 8.28-.02 12.43-2.01 1.05-4.44 1.26-6.63.61-2.19-.65-4.17-2.31-5.18-4.38-1.01-2.07-1.01-4.63 0-6.7 1.01-2.07 2.99-3.73 5.18-4.38.74-.22 1.5-.3 2.26-.29V8.04c-.42-.05-.85-.06-1.27.02-1.31.25-2.51 1.06-3.23 2.2-.72 1.14-.88 2.53-.45 3.84.43 1.31 1.5 2.39 2.83 2.8.29.09.6.14.9.14 1.62-.05 3.14-1.22 3.63-2.76.04-.13.06-.27.07-.41V.02z" />
  </svg>
);

const TikTokSettings = () => {
  const [formData, setFormData] = useState({
    tiktok_url: '',
    n8n_leadextract_webhook: '',
    n8n_leadextract_token: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadIntegration = async () => {
      try {
        const response = await apiFetch('/api/integrations/TIKTOK');
        const result = await response.json();
        if (result.success && result.data) {
          setFormData({
            tiktok_url: result.data.credentials?.tiktok_url || '',
            n8n_leadextract_webhook: result.data.n8n_webhook || '',
            n8n_leadextract_token: result.data.credentials?.api_key || ''
          });
        }
      } catch (e) {
        console.error("Erro ao carregar TikTok", e);
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
          provider: 'TIKTOK',
          n8n_webhook: formData.n8n_leadextract_webhook,
          credentials: {
            tiktok_url: formData.tiktok_url,
            api_key: formData.n8n_leadextract_token
          }
        })
      });
      const result = await response.json();
      if (result.success) {
        alert("Configurações do TikTok salvas!");
      } else {
        alert("Erro ao salvar TikTok.");
      }
    } catch (e) {
      alert("Erro de conexão.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-light)', marginBottom: '10px' }}>TikTok</h1>
      <p style={{ opacity: 0.8, marginBottom: '30px' }}>Configure sua integração com o TikTok.</p>

      {/* PAINEL DE MÉTRICAS */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px' }}>
          <div style={{ background: '#22C55E1a', padding: '10px', borderRadius: '12px', color: '#22C55E' }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: '700', textTransform: 'uppercase' }}>Alcance Semanal</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>+24.5%</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px' }}>
          <div style={{ background: '#22C55E1a', padding: '10px', borderRadius: '12px', color: '#22C55E' }}>
            <Users size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: '700', textTransform: 'uppercase' }}>Seguidores Totais</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>85.9k</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px' }}>
          <div style={{ background: '#22C55E1a', padding: '10px', borderRadius: '12px', color: '#22C55E' }}>
            <BarChart3 size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: '700', textTransform: 'uppercase' }}>Engajamento</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>5.8%</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card" style={{ borderTop: '4px solid #22C55E' }}>
          <h3 style={{ color: '#22C55E', marginBottom: '20px' }}><TikTokIcon size={20} /> Perfil TikTok</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>URL do Perfil / @user</label>
            <input className="input-field" type="url" name="tiktok_url" value={formData.tiktok_url || ''} onChange={handleChange} placeholder="https://tiktok.com/@..." />
          </div>
          <button className="btn-primary" onClick={handleSave} disabled={isSaving} style={{ width: '100%', background: '#22C55E', opacity: isSaving ? 0.7 : 1 }}>{isSaving ? 'Salvando...' : 'Salvar Perfil'}</button>
        </div>

        <div className="card" style={{ borderTop: '4px solid #22C55E' }}>
          <h3 style={{ color: '#22C55E', marginBottom: '20px' }}>Automação n8n (Lead Extraction)</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Webhook (Lead Collector)</label>
            <input className="input-field" type="url" name="n8n_leadextract_webhook" value={formData.n8n_leadextract_webhook || ''} onChange={handleChange} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>API Token</label>
            <input className="input-field" type="password" name="n8n_leadextract_token" value={formData.n8n_leadextract_token || ''} onChange={handleChange} autoComplete="off" />
          </div>
          <button className="btn-primary" onClick={handleSave} disabled={isSaving} style={{ width: '100%', background: '#22C55E', opacity: isSaving ? 0.7 : 1 }}>{isSaving ? 'Salvando...' : 'Salvar Automação'}</button>
        </div>
      </div>
    </div>
  );
};

export default TikTokSettings;
