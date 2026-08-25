import React, { useContext, useState, useEffect } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { Sparkles, Globe, Shield } from 'lucide-react';

const ContentAutomationSettings = () => {
    const { settings, saveSettings } = useContext(SettingsContext);
    const [formData, setFormData] = useState(settings);

    useEffect(() => {
        setFormData(settings);
    }, [settings]);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSave = async () => {
        await saveSettings(formData);
        alert("Configurações de Automação salvas!");
    };

    return (
        <div>
            <h1 style={{ color: 'var(--color-light)', marginBottom: '10px' }}>Automação de Conteúdo</h1>
            <p style={{ opacity: 0.8, marginBottom: '30px' }}>Configure o motor de IA via n8n para geração automática de postagens.</p>

            <div className="card" style={{ maxWidth: '600px', borderTop: '4px solid #0084FF' }}>
                <h3 style={{ color: '#0084FF', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles size={20} /> motor de Geração IA
                </h3>
                
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>
                        <Globe size={14} style={{ marginRight: '5px' }} /> Webhook do n8n (Geração)
                    </label>
                    <input className="input-field" type="url" name="n8n_generation_webhook" value={formData.n8n_generation_webhook || ''} onChange={handleChange} placeholder="https://n8n.suaempresa.com/webhook/..." />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>
                        <Shield size={14} style={{ marginRight: '5px' }} /> API Token / Auth
                    </label>
                    <input className="input-field" type="password" name="n8n_generation_token" value={formData.n8n_generation_token || ''} onChange={handleChange} autoComplete="off" />
                </div>

                <div style={{ background: 'rgba(0, 132, 255, 0.05)', padding: '15px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px', border: '1px solid rgba(0, 132, 255, 0.1)' }}>
                    <strong>Dica:</strong> Este webhook será chamado pelo Calendário de Conteúdo quando você solicitar uma "Geração via IA". O n8n deve processar a ideia e retornar os textos e sugestões de imagem.
                </div>

                <button className="btn-primary" onClick={handleSave} style={{ width: '100%', background: '#0084FF' }}>Salvar Configurações</button>
            </div>
        </div>
    );
};

export default ContentAutomationSettings;
