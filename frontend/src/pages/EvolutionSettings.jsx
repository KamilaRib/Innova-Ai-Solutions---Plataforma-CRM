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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
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

        {/* ÁREA DO QR CODE / STATUS */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          {connectionStatus === 'conectado' ? (
            <div style={{ color: 'var(--color-accent-green)' }}>
              <CheckCircle2 size={64} style={{ marginBottom: '20px' }} />
              <h2 style={{ marginBottom: '10px' }}>WhatsApp Conectado!</h2>
              <p style={{ opacity: 0.6 }}>Sua instância está ativa e pronta para enviar mensagens.</p>
              <button 
                className="btn-primary" 
                style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'rgb(239, 68, 68)', border: '1px solid rgb(239, 68, 68)', marginTop: '20px' }}
                onClick={() => setConnectionStatus('desconectado')}
              >
                DESCONECTAR
              </button>
            </div>
          ) : (
            <>
              {qrCode ? (
                <div>
                  <div style={{ background: '#fff', padding: '15px', borderRadius: '12px', display: 'inline-block', marginBottom: '20px' }}>
                    <img src={qrCode} alt="WhatsApp QR Code" style={{ width: '250px', height: '250px' }} />
                  </div>
                  <p style={{ marginBottom: '20px', fontWeight: 'bold' }}>Escaneie o código acima com seu WhatsApp</p>
                  <button className="btn-primary" onClick={fetchQRCode} style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto' }}>
                    <RefreshCw size={18} className={loading ? 'spin' : ''} />
                    ATUALIZAR QR CODE
                  </button>
                </div>
              ) : (
                <div style={{ opacity: 0.5 }}>
                  <QrCode size={80} style={{ marginBottom: '20px' }} />
                  <h3>Gerador de Conexão</h3>
                  <p style={{ maxWidth: '300px', margin: '10px auto' }}>Após salvar as configurações, clique no botão abaixo para gerar o código de pareamento.</p>
                  <button 
                    className="btn-primary" 
                    onClick={fetchQRCode} 
                    style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}
                    disabled={loading}
                  >
                    <Send size={18} />
                    {loading ? 'GERANDO...' : 'GERAR QR CODE'}
                  </button>
                </div>
              )}
            </>
          )}

          {connectionStatus === 'aguardando' && !qrCode && !loading && (
            <div style={{ marginTop: '20px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span style={{ fontSize: '0.85rem' }}>Verifique se a instância foi criada no painel Evolution.</span>
            </div>
          )}
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
