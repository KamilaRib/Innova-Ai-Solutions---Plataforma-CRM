import React, { useContext, useState, useEffect } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { QrCode, RefreshCw, Send, CheckCircle2, AlertCircle } from 'lucide-react';

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
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSave = async () => {
    const result = await saveSettings(formData);
    if (result.success) {
      alert("Configurações salvas! Agora você pode gerar o QR Code.");
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
      // 1. Tenta conectar/gerar QR Code
      const response = await fetch(`${formData.evolution_api_url}/instance/connect/${formData.evolution_instance_name}`, {
        headers: {
          'apikey': formData.evolution_api_key
        }
      });

      const data = await response.json();

      if (data.base64) {
        setQrCode(data.base64);
      } else if (data.status === 'open') {
        setConnectionStatus('conectado');
        alert("Esta instância já está conectada!");
      } else {
        alert("Não foi possível gerar o QR Code. Verifique se a instância foi criada no Evolution.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o servidor Evolution. Verifique a URL e se o CORS está liberado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h1 style={{ color: 'var(--color-accent-green)', marginBottom: '10px' }}>Evolution API</h1>
      <p style={{ opacity: 0.8, marginBottom: '30px' }}>Gerencie suas instâncias de WhatsApp e conecte novas contas.</p>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* CONFIGURAÇÕES TÉCNICAS */}
        <div className="card">
          <h3 style={{ color: 'var(--color-accent-green)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Send size={18} />
            Configurações do Servidor
          </h3>
          
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>URL do Servidor Evolution</label>
          <input className="input-field" type="url" name="evolution_api_url" value={formData.evolution_api_url || ''} onChange={handleChange} placeholder="https://api.meuevolution.com" />
          
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
      </div>

      {/* DICAS PARA DOCKER LOCAL */}
      <div className="card" style={{ marginTop: '30px', background: 'rgba(34, 197, 94, 0.02)' }}>
        <h4 style={{ color: 'var(--color-accent-green)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} />
          Dicas para Evolution em Docker Local
        </h4>
        <ul style={{ fontSize: '0.85rem', opacity: 0.7, paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>Certifique-se de que o container <strong>evolution_api</strong> está rodando (<code>docker ps</code>).</li>
          <li>A URL padrão geralmente é <code>http://localhost:8080</code>.</li>
          <li>Verifique se o <strong>AUTHENTICATION_GLOBAL_KEY</strong> no seu .env coincide com a API Key acima.</li>
          <li>Se der erro de conexão, verifique se a variável <code>CORS_ORIGIN=*</code> está ativa no seu .env da Evolution.</li>
        </ul>
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
