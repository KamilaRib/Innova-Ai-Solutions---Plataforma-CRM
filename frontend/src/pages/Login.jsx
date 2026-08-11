import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SettingsContext } from '../context/SettingsContext';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepConnected, setKeepConnected] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { settings } = useContext(SettingsContext);
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.error || 'Não foi possível entrar. Verifique seus dados.');
        return;
      }
      login(data.token, data.user_data);
      navigate('/app/dashboard');
    } catch (err) {
      setError('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0a0b0d' }}>
      
      {/* Header fora do card */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        {settings?.logo_url ? (
          <img src={settings.logo_url} alt={settings.business_name || 'Logo'} style={{ maxHeight: '80px', marginBottom: '15px' }} />
        ) : (
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '15px' }}>
            {settings?.business_name ? settings.business_name.split(' ')[0] : 'INNOVA'} 
            <span style={{ color: 'var(--color-accent-green)', marginLeft: '8px' }}>
              {settings?.business_name ? settings.business_name.split(' ')[1] : 'AI'}
            </span>
            <span style={{ color: '#fff', marginLeft: '8px' }}>
              {settings?.business_name ? settings.business_name.split(' ').slice(2).join(' ') : 'SOLUTIONS'}
            </span>
          </h1>
        )}
        <p style={{ color: '#888', fontSize: '0.9rem' }}>Acesso ao CRM Inteligente</p>
      </div>

      {/* Card de Login */}
      <div style={{
        background: '#12151a',
        padding: '2.5rem', 
        borderRadius: '16px', 
        border: '1px solid rgba(255, 255, 255, 0.05)',
        width: '100%', 
        maxWidth: '420px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
      }}>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>E-mail</label>
            <input 
              style={{
                width: '100%',
                padding: '12px 15px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border 0.2s'
              }}
              onFocus={(e) => e.target.style.border = '1px solid var(--color-accent-green)'}
              onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
              type="email" 
              placeholder="seu@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>Senha</label>
              <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: '#888', textDecoration: 'none' }}>Esqueceu a senha?</Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  paddingRight: '45px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border 0.2s'
                }}
                onFocus={(e) => e.target.style.border = '1px solid var(--color-accent-green)'}
                onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div 
                style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888' }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px', gap: '8px' }}>
            <input 
              type="checkbox" 
              id="keepConnected" 
              checked={keepConnected}
              onChange={() => setKeepConnected(!keepConnected)}
              style={{ cursor: 'pointer' }}
            />
            <label htmlFor="keepConnected" style={{ fontSize: '0.85rem', color: '#888', cursor: 'pointer' }}>Manter me conectado</label>
          </div>

          {error && (
            <p style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '-10px', marginBottom: '15px' }}>{error}</p>
          )}

          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '14px', 
              background: 'var(--color-accent-green)', 
              color: '#000', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '1rem', 
              fontWeight: 700, 
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s'
            }} 
            disabled={loading}
          >
            {loading ? 'ENTRANDO...' : 'Acessar o Painel'}
          </button>
        </form>

      </div>

      <div style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#888' }}>
        Não tem uma conta? <Link to="/register" style={{ color: 'var(--color-accent-green)', textDecoration: 'none', fontWeight: 600 }}>Cadastre sua Empresa</Link>
      </div>

    </div>
  );
}
