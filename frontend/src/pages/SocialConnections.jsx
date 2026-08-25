import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Facebook, Instagram, Youtube, MapPin, Linkedin, BarChart, Twitter, Target, Megaphone, X as XIcon, X } from 'lucide-react';

const TikTokIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-1.26-.88-2.22-2.19-2.68-3.64-.03 4.14-.02 8.28-.02 12.43-2.01 1.05-4.44 1.26-6.63.61-2.19-.65-4.17-2.31-5.18-4.38-1.01-2.07-1.01-4.63 0-6.7 1.01-2.07 2.99-3.73 5.18-4.38.74-.22 1.5-.3 2.26-.29V8.04c-.42-.05-.85-.06-1.27.02-1.31.25-2.51 1.06-3.23 2.2-.72 1.14-.88 2.53-.45 3.84.43 1.31 1.5 2.39 2.83 2.8.29.09.6.14.9.14 1.62-.05 3.14-1.22 3.63-2.76.04-.13.06-.27.07-.41V.02z" />
  </svg>
);

const ThreadsIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 10a2 2 0 1 0-4 0v4a2 2 0 1 0 4 0" />
    <path d="M16 10a4 4 0 1 0-8 0v4a4 4 0 1 0 8 0" />
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10" />
    <path d="M12 22v-4" />
  </svg>
);

const PinterestIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345l-.288 1.178c-.046.182-.148.223-.339.133-1.267-.591-2.062-2.457-2.062-3.955 0-3.218 2.34-6.179 6.758-6.179 3.551 0 6.311 2.531 6.311 5.922 0 3.535-2.228 6.381-5.32 6.381-1.039 0-2.016-.541-2.351-1.18l-.64 2.438c-.231.884-.858 1.99-1.282 2.666 1.023.313 2.102.481 3.213.481 6.621 0 11.988-5.367 11.988-11.987C24 5.367 18.638 0 12.017 0z" />
  </svg>
);

const WhatsAppIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const ConnectionModal = ({ provider, onClose, onContinue }) => {
  if (!provider) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px', margin: '20px', padding: 0, borderTop: `4px solid ${provider.hexColor || '#0084FF'}` }}>
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ margin: 0, color: '#fff' }}>Conecte o {provider.name}</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>
        
        <div style={{ padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--color-accent)' }}>1</div>
            <div>
              <h4 style={{ color: '#fff', marginBottom: '4px' }}>Faça login no {provider.name}</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Você será redirecionado para a página oficial.</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--color-accent)' }}>2</div>
            <div>
              <h4 style={{ color: '#fff', marginBottom: '4px' }}>Permita o gerenciamento</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Autorize o CRM Innova AI a publicar e ler dados da sua conta.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--color-accent)' }}>3</div>
            <div>
              <h4 style={{ color: '#fff', marginBottom: '4px' }}>Finalize a conexão</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Selecione a página desejada para concluir o processo.</p>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
          <button 
            onClick={onContinue} 
            style={{ 
              background: provider.hexColor || '#0084FF',
              border: 'none',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              letterSpacing: '0.05em'
            }}
          >
            Continuar →
          </button>
        </div>
      </div>
    </div>
  );
};

const SocialConnections = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [successMsg, setSuccessMsg] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState('1');
  
  const mockProfiles = [
    { id: '1', name: 'Innova AI Solutions' },
    { id: '2', name: 'Cliente B - Loja' },
    { id: '3', name: 'Agência (Interno)' }
  ];
  
  const [connections, setConnections] = useState([
    { id: 'instagram', name: 'Instagram', icon: <Instagram size={28} />, hexColor: '#E1306C', connected: true },
    { id: 'facebook', name: 'Facebook', icon: <Facebook size={28} />, hexColor: '#1877F2', connected: true },
    { id: 'tiktok', name: 'TikTok', icon: <TikTokIcon size={28} />, hexColor: '#00F2FE', connected: false },
    { id: 'linkedin_pages', name: 'LinkedIn Pages', icon: <Linkedin size={28} />, hexColor: '#0A66C2', connected: false },
    { id: 'linkedin_personal', name: 'LinkedIn Pessoal', icon: <Linkedin size={28} />, hexColor: '#0A66C2', connected: false },
    { id: 'youtube', name: 'YouTube', icon: <Youtube size={28} />, hexColor: '#FF0000', connected: false },
    { id: 'gmn', name: 'Google Meu Negócio', icon: <MapPin size={28} />, hexColor: '#4285F4', connected: false },
    { id: 'ga4', name: 'Google Analytics 4', icon: <BarChart size={28} />, hexColor: '#F4B400', connected: false },
    { id: 'threads', name: 'Threads', icon: <ThreadsIcon size={28} />, hexColor: '#000000', connected: false },
    { id: 'pinterest', name: 'Pinterest', icon: <PinterestIcon size={28} />, hexColor: '#E60023', connected: false },
    { id: 'x', name: 'X', icon: <XIcon size={28} />, hexColor: '#000000', connected: false },
    { id: 'meta_ads', name: 'Meta Ads', icon: <Megaphone size={28} />, hexColor: '#0668E1', connected: false },
    { id: 'google_ads', name: 'Google Ads', icon: <Target size={28} />, hexColor: '#4285F4', connected: false },
    { id: 'linkedin_ads', name: 'LinkedIn Ads', icon: <Linkedin size={28} />, hexColor: '#0A66C2', connected: false },
    { id: 'tiktok_ads', name: 'TikTok Ads', icon: <TikTokIcon size={28} />, hexColor: '#00F2FE', connected: false },
    { id: 'whatsapp_evolution', name: 'WhatsApp Evolution API', icon: <WhatsAppIcon size={28} />, hexColor: '#128C7E', connected: false },
    { id: 'whatsapp_cloud', name: 'WhatsApp Oficial (Cloud API)', icon: <WhatsAppIcon size={28} />, hexColor: '#25D366', connected: false },
  ]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('success') === 'true') {
      const providerStr = params.get('provider') || '';
      setSuccessMsg(`${providerStr.toUpperCase()} conectado com sucesso!`);
      setConnections(prev => prev.map(c => c.id === providerStr ? { ...c, connected: true } : c));
    }
  }, [location]);

  const handleConnectClick = (provider) => {
    if (provider.id === 'whatsapp_evolution') {
      navigate('/app/settings/evolution');
      return;
    }
    if (provider.id === 'whatsapp_cloud') {
      navigate('/app/settings/whatsapp');
      return;
    }
    setSelectedProvider(provider);
  };

  const handleModalContinue = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/social-auth/${selectedProvider.id}/url`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erro ao obter a URL de autorização.");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Erro ao iniciar autenticação.");
    }
    setSelectedProvider(null);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ color: 'var(--color-light)', marginBottom: '5px' }}>Contas sociais do perfil</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Conecte suas contas para habilitar o agendamento e automações.</p>
        </div>
        
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Gerenciando conexões de:</label>
          <select 
            className="input-field" 
            value={selectedProfile} 
            onChange={(e) => setSelectedProfile(e.target.value)}
            style={{ width: '250px', cursor: 'pointer' }}
          >
            {mockProfiles.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {successMsg && (
        <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--color-accent-green)', color: 'var(--color-accent-green)', borderRadius: '10px', fontWeight: 'bold' }}>
          ✅ {successMsg}
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
        gap: '20px' 
      }}>
        {connections.map(provider => (
          <div 
            key={provider.id} 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              minHeight: '200px',
              padding: '20px',
              margin: 0,
              borderRadius: '20px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderTop: `4px solid ${provider.hexColor}`,
              background: provider.connected ? `linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(0,0,0,0.5))` : 'rgba(18, 21, 26, 0.8)'
            }}
          >
            <div style={{ color: provider.hexColor, marginBottom: '15px' }}>
              {provider.icon}
            </div>
            <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '1.1rem', marginBottom: '20px', textAlign: 'center' }}>
              {provider.name}
            </span>
            
            {provider.connected ? (
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 15px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', color: '#fff', letterSpacing: '1px' }}>
                CONECTADO
              </div>
            ) : (
              <button 
                onClick={() => handleConnectClick(provider)}
                style={{ 
                  background: provider.hexColor, 
                  width: '100%', 
                  color: '#fff',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em'
                }}
              >
                Conectar
              </button>
            )}
          </div>
        ))}
      </div>

      <ConnectionModal 
        provider={selectedProvider} 
        onClose={() => setSelectedProvider(null)} 
        onContinue={handleModalContinue} 
      />
    </div>
  );
};

export default SocialConnections;
