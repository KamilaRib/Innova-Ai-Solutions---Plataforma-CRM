import React, { useState, useEffect } from 'react';
import { Youtube, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { apiFetch } from '../utils/api';

const YoutubeSettings = () => {
  const [formData, setFormData] = useState({
    youtube_url: '',
    n8n_youtube_webhook: '',
    n8n_youtube_token: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadIntegration = async () => {
      try {
        const response = await apiFetch('/api/integrations/YOUTUBE');
        const result = await response.json();
        if (result.success && result.data) {
          setFormData({
            youtube_url: result.data.credentials?.youtube_url || '',
            n8n_youtube_webhook: result.data.n8n_webhook || '',
            n8n_youtube_token: result.data.credentials?.api_key || ''
          });
        }
      } catch (e) {
        console.error("Erro ao carregar YouTube", e);
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
          provider: 'YOUTUBE',
          n8n_webhook: formData.n8n_youtube_webhook,
          credentials: {
            youtube_url: formData.youtube_url,
            api_key: formData.n8n_youtube_token
          }
        })
      });
      const result = await response.json();
      if (result.success) {
        alert("Configurações do YouTube salvas!");
      } else {
        alert("Erro ao salvar YouTube.");
      }
    } catch (e) {
      alert("Erro de conexão.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-light)', marginBottom: '10px' }}>YouTube</h1>
      <p style={{ opacity: 0.8, marginBottom: '30px' }}>Configure sua integração com o YouTube.</p>

      {/* PAINEL DE MÉTRICAS */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px' }}>
          <div style={{ background: '#FF00001a', padding: '10px', borderRadius: '12px', color: '#FF0000' }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: '700', textTransform: 'uppercase' }}>Alcance Semanal</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>+15.2%</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px' }}>
          <div style={{ background: '#FF00001a', padding: '10px', borderRadius: '12px', color: '#FF0000' }}>
            <Users size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: '700', textTransform: 'uppercase' }}>Inscritos Totais</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>32.4k</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px' }}>
          <div style={{ background: '#FF00001a', padding: '10px', borderRadius: '12px', color: '#FF0000' }}>
            <BarChart3 size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: '700', textTransform: 'uppercase' }}>Taxa de Cliques (CTR)</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>6.1%</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card" style={{ borderTop: '4px solid #FF0000' }}>
          <h3 style={{ color: '#FF0000', marginBottom: '20px' }}><Youtube size={20} style={{verticalAlign:'middle', marginRight:'8px'}}/> Canal YouTube</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>URL do Canal</label>
            <input className="input-field" type="url" name="youtube_url" value={formData.youtube_url || ''} onChange={handleChange} placeholder="https://youtube.com/c/..." />
          </div>
          <button className="btn-primary" onClick={handleSave} disabled={isSaving} style={{ width: '100%', background: '#FF0000', opacity: isSaving ? 0.7 : 1 }}>{isSaving ? 'Salvando...' : 'Salvar Canal'}</button>
        </div>

        <div className="card" style={{ borderTop: '4px solid #FF0000' }}>
          <h3 style={{ color: '#FF0000', marginBottom: '20px' }}>Automação n8n (YouTube)</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Webhook URL</label>
            <input className="input-field" type="url" name="n8n_youtube_webhook" value={formData.n8n_youtube_webhook || ''} onChange={handleChange} placeholder="https://..." />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>API Token</label>
            <input className="input-field" type="password" name="n8n_youtube_token" value={formData.n8n_youtube_token || ''} onChange={handleChange} autoComplete="off" />
          </div>
          <button className="btn-primary" onClick={handleSave} disabled={isSaving} style={{ width: '100%', background: '#FF0000', opacity: isSaving ? 0.7 : 1 }}>{isSaving ? 'Salvando...' : 'Salvar Automação'}</button>
        </div>
      </div>
    </div>
  );
};

export default YoutubeSettings;
