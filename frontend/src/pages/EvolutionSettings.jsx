import React, { useContext, useState, useEffect } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { QrCode, RefreshCw, Send, CheckCircle2, AlertCircle, Zap } from 'lucide-react';

const EvolutionSettings = () => {
  const { settings, saveSettings } = useContext(SettingsContext);
  const [formData, setFormData] = useState(settings);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('desconectado'); // desconectado, aguardando, conectado

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const result = await saveSettings(formData);
    if (result.success) {
      try {
        // Tenta configurar o Webhook na Evolution API também
        const response = await fetch(`${formData.evolution_api_url}/webhook/set/${formData.evolution_instance_name}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': formData.evolution_api_key
          },
          body: JSON.stringify({
            webhook: {
              url: formData.evolution_webhook_url || 'https://n8n.agency-innova-ai-solutions.cloud/webhook/lead-message-v2',
              enabled: true,
              events: formData.evolution_events || ['MESSAGES_UPSERT']
            }
          })
        });

        const data = await response.json();
        if (data.status === 200 || data.success) {
          alert("Configurações salvas e Webhook ativo na Evolution!");
        } else {
          alert("Configurações salvas no CRM, mas houve um erro ao ativar o Webhook na Evolution. Verifique a URL.");
        }
      } catch (err) {
        console.error(err);
        alert("Configurações salvas localmente. (O servidor Evolution parece estar offline para o Webhook)");
      }
    } else {
      alert("Erro ao salvar configurações no banco de dados.");
    }
  };

  const fetchQRCode = async () => {
    if (!formData.evolution_api_url || !formData.evolution_api_key || !formData.evolution_instance_name) {
      alert("Preencha a URL, a Chave e o Nome da Instância antes de gerar o QR Code.");
      return;
    }

    setLoading(true);
    setConnectionStatus('aguardando');

    try {
      // 1. Tenta criar a instância primeiro (caso não exista)
      await fetch(`${formData.evolution_api_url}/instance/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': formData.evolution_api_key
        },
        body: JSON.stringify({
          instanceName: formData.evolution_instance_name,
          token: formData.evolution_api_key,
          qrcode: true
        })
      });

      // 2. Agora busca o QR Code ou status de conexão
      const response = await fetch(`${formData.evolution_api_url}/instance/connect/${formData.evolution_instance_name}`, {
        headers: {
          'apikey': formData.evolution_api_key
        }
      });

      const data = await response.json();

      if (data.code || data.base64) {
        setQrCode(data.base64 || data.code);
        setConnectionStatus('aguardando');
      } else if (data.status === 'open' || data.instance?.status === 'open' || data.instance?.state === 'open' || data.state === 'open') {
        setConnectionStatus('conectado');
        setQrCode(null);
      } else if (data.error || data.message || data.response?.message) {
        alert(`Erro da Evolution: ${data.response?.message || data.message || data.error}`);
      } else {
        alert("O servidor respondeu, mas não enviou um QR Code. Tente novamente em instantes.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao falar com o servidor Evolution. Verifique se o Docker está rodando e a URL está correta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h1 style={{ color: 'var(--color-accent-green)', marginBottom: '10px' }}>Evolution API</h1>
      <p style={{ opacity: 0.8, marginBottom: '30px' }}>Gerencie suas instâncias de WhatsApp e conecte novas contas.</p>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>

          {/* CONFIGURAÇÕES TÉCNICAS */}
          <div className="card">
            <h3 style={{ color: 'var(--color-accent-green)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Send size={18} />
              Configurações do Servidor
            </h3>

            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>URL do Servidor Evolution</label>
            <input className="input-field" type="url" name="evolution_api_url" value={formData.evolution_api_url || 'http://localhost:8080'} onChange={handleChange} placeholder="http://localhost:8080" />

            <div style={{ marginTop: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>API Key (Token Global)</label>
              <input className="input-field" type="password" name="evolution_api_key" value={formData.evolution_api_key || ''} onChange={handleChange} autoComplete="off" />
            </div>

            <div style={{ marginTop: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Nome da Instância (Obrigatório)</label>
              <input className="input-field" type="text" name="evolution_instance_name" value={formData.evolution_instance_name || ''} onChange={handleChange} placeholder="ex: WhatsApp_Innova" />
            </div>

            <button className="btn-primary" onClick={handleSave} style={{ marginTop: '25px', width: '100%' }}>
              SALVAR CONFIGURAÇÕES
            </button>
          </div>

          {/* CONFIGURAÇÃO DE WEBHOOK (SEMPRE VISÍVEL) */}
          <div className="card">
            <h3 style={{ color: 'var(--color-accent-cyan)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={20} /> Automação (Webhook)
            </h3>

            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>URL do Webhook (n8n)</label>
            <input
              className="input-field"
              type="url"
              name="evolution_webhook_url"
              value={formData.evolution_webhook_url || 'https://n8n.agency-innova-ai-solutions.cloud/webhook/lead-message-v2'}
              onChange={handleChange}
              placeholder="https://n8n.agency-innova-ai-solutions.cloud/webhook/..."
            />

            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.85rem', opacity: 0.7 }}>Eventos para Monitorar</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { id: 'MESSAGES_UPSERT', label: 'Novas Mensagens' },
                  { id: 'MESSAGES_UPDATE', label: 'Status da Mensagem' },
                  { id: 'PRESENCE_UPDATE', label: 'Status Online/Digitando' },
                  { id: 'CONTACTS_UPSERT', label: 'Sincronizar Contatos' }
                ].map(event => (
                  <label key={event.id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px',
                    cursor: 'pointer', fontSize: '0.8rem'
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.evolution_events?.includes(event.id)}
                      onChange={(e) => {
                        const events = formData.evolution_events || [];
                        const newEvents = e.target.checked
                          ? [...events, event.id]
                          : events.filter(id => id !== event.id);
                        setFormData({ ...formData, evolution_events: newEvents });
                      }}
                    />
                    {event.label}
                  </label>
                ))}
              </div>
            </div>

            <button className="btn-primary" onClick={handleSave} style={{ marginTop: '25px', width: '100%', background: 'linear-gradient(90deg, #00F5FF 0%, #0057FF 100%)', color: '#fff' }}>
              ATUALIZAR WEBHOOK NA EVOLUTION
            </button>
          </div>
        </div>

        {/* QR CODE E STATUS */}
        {(qrCode || connectionStatus === 'conectado') && (
          <div className="card" style={{ marginTop: '30px', textAlign: 'center' }}>
            <h3 style={{ color: 'var(--color-accent-green)', marginBottom: '20px' }}>
              Conectar WhatsApp
            </h3>

            {connectionStatus === 'conectado' ? (
              <div style={{ padding: '40px 20px' }}>
                <CheckCircle2 size={60} color="#22c55e" style={{ marginBottom: '15px' }} />
                <h4 style={{ color: '#fff' }}>WhatsApp Conectado!</h4>
                <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Sua instância está pronta para enviar e receber mensagens.</p>
                <button className="btn-primary" onClick={() => { setQrCode(null); setConnectionStatus('desconectado'); fetchQRCode(); }} style={{ marginTop: '20px', background: 'transparent', border: '1px solid var(--color-accent-green)', color: 'var(--color-accent-green)' }}>
                  RECONECTAR / TROCAR NÚMERO
                </button>
              </div>
            ) : (
              <div>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', display: 'inline-block', marginBottom: '20px' }}>
                  <img src={qrCode} alt="WhatsApp QR Code" style={{ width: '250px', height: '250px' }} />
                </div>
                <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>
                  Abra o WhatsApp no seu celular e escaneie o código acima.
                </p>
                <button className="btn-primary" onClick={fetchQRCode} style={{ marginTop: '20px', background: 'transparent', border: '1px solid #fff', opacity: 0.6 }}>
                  <RefreshCw size={14} className={loading ? 'spin' : ''} style={{ marginRight: '8px' }} />
                  ATUALIZAR QR CODE
                </button>
              </div>
            )}
          </div>
        )}

        {/* BOTÃO PARA GERAR QR CODE (CASO NÃO ESTEJA EXIBIDO) */}
        {!qrCode && connectionStatus !== 'conectado' && (
          <button
            className="btn-primary"
            onClick={fetchQRCode}
            disabled={loading}
            style={{ marginTop: '20px', width: '100%', background: 'linear-gradient(90deg, #25D366 0%, #128C7E 100%)', border: 'none' }}
          >
            {loading ? (
              <><RefreshCw size={18} className="spin" style={{ marginRight: '10px' }} /> GERANDO QR CODE...</>
            ) : (
              <><QrCode size={18} style={{ marginRight: '10px' }} /> GERAR QR CODE PARA CONEXÃO</>
            )}
          </button>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default EvolutionSettings;
