import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { SettingsContext } from '../context/SettingsContext';
import { apiFetch } from '../utils/api';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { settings } = useContext(SettingsContext);

  useEffect(() => {
    if (!token) {
      setError('Token de recuperação inválido ou ausente.');
    }
  }, [token]);

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    
    try {
      const response = await apiFetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, new_password: password })
      });
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        setError(data.error || 'Erro ao redefinir a senha. O link pode ter expirado.');
        return;
      }
      
      setSuccess(data.message || 'Senha redefinida com sucesso! Redirecionando...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      setError('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0a0b0d' }}>
      
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
        <p style={{ color: '#888', fontSize: '0.9rem' }}>Redefinir Senha</p>
      </div>

      <div style={{
        background: '#12151a',
        padding: '2.5rem', 
        borderRadius: '16px', 
        border: '1px solid rgba(255, 255, 255, 0.05)',
        width: '100%', 
        maxWidth: '420px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
      }}>

        {!token && error ? (
           <div style={{ textAlign: 'center' }}>
             <p style={{ color: '#f87171', marginBottom: '20px' }}>{error}</p>
             <Link to="/forgot-password" style={{ color: 'var(--color-accent-green)', textDecoration: 'none', fontWeight: 600 }}>Solicitar novo link</Link>
           </div>
        ) : (
          <form onSubmit={handleReset}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>Nova Senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  style={{
                    width: '100%', padding: '12px 15px', paddingRight: '45px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff',
                    fontSize: '0.9rem', outline: 'none', transition: 'border 0.2s'
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

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>Confirmar Nova Senha</label>
              <input
                style={{
                  width: '100%', padding: '12px 15px', background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff',
                  fontSize: '0.9rem', outline: 'none', transition: 'border 0.2s'
                }}
                onFocus={(e) => e.target.style.border = '1px solid var(--color-accent-green)'}
                onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '-10px', marginBottom: '15px', textAlign: 'center' }}>{error}</p>
            )}

            {success && (
              <p style={{ color: 'var(--color-accent-green)', fontSize: '0.85rem', marginTop: '-10px', marginBottom: '15px', textAlign: 'center' }}>{success}</p>
            )}

            <button 
              type="submit" 
              style={{ 
                width: '100%', padding: '14px', background: 'var(--color-accent-green)', color: '#000', 
                border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                opacity: loading || success ? 0.7 : 1, transition: 'opacity 0.2s'
              }} 
              disabled={loading || !!success}
            >
              {loading ? 'SALVANDO...' : success ? 'REDIRECIONANDO...' : 'Alterar Senha'}
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
