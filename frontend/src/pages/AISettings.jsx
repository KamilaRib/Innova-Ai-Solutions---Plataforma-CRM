import React, { useContext, useState, useEffect } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { Brain, Cpu, Key, Wand2 } from 'lucide-react';

const AISettings = () => {
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
        alert("Configurações de IA salvas!");
    };

    return (
        <div>
            <h1 style={{ color: 'var(--color-light)', marginBottom: '10px' }}>Inteligência Artificial</h1>
            <p style={{ opacity: 0.8, marginBottom: '30px' }}>Configure as chaves e comportamentos do motor de IA do seu CRM.</p>

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="card">
                    <h3 style={{ color: 'var(--color-accent-cyan)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Brain size={20} /> OpenAI Configuration
                    </h3>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>
                            <Key size={14} style={{ marginRight: '5px' }} /> OpenAI API Key
                        </label>
                        <input 
                            className="input-field" 
                            type="password" 
                            name="openai_api_key" 
                            value={formData.openai_api_key || ''} 
                            onChange={handleChange} 
                            placeholder="sk-..."
                            autoComplete="new-password"
                        />
                    </div>

                    <div style={{ background: 'rgba(0, 245, 255, 0.05)', padding: '15px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px', border: '1px solid rgba(0, 245, 255, 0.1)' }}>
                        <strong>Nota:</strong> Esta chave é usada para o "Copilot de Chat" e para a geração de sugestões inteligentes dentro do sistema.
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ color: 'var(--color-accent-cyan)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem' }}>
                            <Wand2 size={18} /> Comportamento da Agência
                        </h3>
                        <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '10px' }}>Defina como a IA deve se comportar ao sugerir respostas.</p>
                        <textarea 
                            className="input-field" 
                            name="ai_behavior" 
                            value={formData.ai_behavior || ''} 
                            onChange={handleChange} 
                            style={{ height: '100px', resize: 'none' }}
                            placeholder="Ex: Você é um assistente de vendas focado em fechamento..."
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ color: 'var(--color-accent-cyan)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem' }}>
                            Webhook da Automação (n8n)
                        </h3>
                        <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '10px' }}>URL do fluxo do AI Concierge no n8n que receberá os chamados.</p>
                        <input 
                            className="input-field" 
                            type="url" 
                            name="ai_concierge_webhook" 
                            value={formData.ai_concierge_webhook || ''} 
                            onChange={handleChange} 
                            placeholder="https://n8n.agency-innova-ai-solutions.cloud/webhook/..."
                        />
                    </div>

                    <button className="btn-primary" onClick={handleSave} style={{ width: '100%' }}>Salvar Inteligência</button>
                </div>
            </div>
        </div>
    );
};

export default AISettings;
