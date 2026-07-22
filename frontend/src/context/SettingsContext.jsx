import React, { createContext, useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

export const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    business_name: 'INNOVA AI',
    logo_url: null,
    primary_color: '#00F5FF',
    whatsapp_phone_number_id: '',
    whatsapp_access_token: '',
    whatsapp_verify_token: '',
    facebook_url: '',
    instagram_url: '',
    tiktok_url: '',
    n8n_social_webhook: '',
    n8n_social_api_key: '',
    n8n_autoreply_webhook: '',
    n8n_autoreply_token: '',
    n8n_leadextract_webhook: '',
    n8n_leadextract_token: '',
    youtube_url: '',
    n8n_youtube_webhook: '',
    n8n_youtube_token: '',
    n8n_generation_webhook: '',
    n8n_generation_token: '',
    openai_api_key: '',
    evolution_api_url: 'http://localhost:8080',
    evolution_api_key: '',
    evolution_instance_name: '',
    evolution_webhook_url: 'https://n8n.agency-innova-ai-solutions.cloud/webhook/lead-message-v2',
    evolution_events: ['MESSAGES_UPSERT'],
    ai_concierge_webhook: '',
  });
  const [loading, setLoading] = useState(true);

  const applyColors = (primary_color) => {
    if (!primary_color) return;
    document.documentElement.style.setProperty('--color-accent', primary_color);
    document.documentElement.style.setProperty('--color-accent-cyan', primary_color);
    document.documentElement.style.setProperty('--accent-glow', `0 0 20px ${primary_color}40`);
    document.documentElement.style.setProperty('--accent-soft', `${primary_color}1a`);
  };

  const fetchSettings = () => {
    // Busca as configurações públicas (nome, logo, cor) — usado antes do login e em toda a app.
    // Dados sensíveis (tokens, chaves) só são carregados na tela de administração (Settings.jsx).
    const API_URL = import.meta.env.VITE_API_URL || '';
    return fetch(`${API_URL}/api/settings/public`)
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.data) {
          setSettings(data.data);
          applyColors(data.data.primary_color);
          return data.data;
        }
      })
      .catch(err => console.error("Erro ao carregar configurações", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const saveSettings = (newData) => {
    return apiFetch('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(newData)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setSettings(newData);
        applyColors(newData.primary_color);
      }
      return data;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings, saveSettings, fetchSettings, loading }}>
      {!loading && children}
    </SettingsContext.Provider>
  );
}
