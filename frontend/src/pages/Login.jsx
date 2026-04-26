import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsContext } from '../context/SettingsContext';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const { settings } = useContext(SettingsContext);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simula validação para entrar no sistema
    localStorage.setItem('role', email.includes('admin') ? 'ADM' : 'OPERADOR');
    navigate('/app/dashboard');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      
      <div style={{
        background: 'rgba(248, 249, 250, 0.03)',
        backdropFilter: 'blur(12px)',
        padding: '3rem', borderRadius: '16px', border: '1px solid rgba(34, 197, 94, 0.1)',
        width: '100%', maxWidth: '450px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt={settings.business_name || 'Logo'} style={{ maxHeight: '60px', marginBottom: '10px' }} />
          ) : (
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>
              {settings?.business_name ? settings.business_name.split(' ')[0] : 'INNOVA'} 
              <span style={{ color: 'var(--color-accent-green)', marginLeft: '6px' }}>
                {settings?.business_name ? settings.business_name.split(' ')[1] : 'AI'}
              </span>
              <span style={{ color: '#fff', marginLeft: '6px' }}>
                {settings?.business_name ? settings.business_name.split(' ').slice(2).join(' ') : 'SOLUTIONS'}
              </span>
            </h1>
          )}
          <p style={{ opacity: 0.7, fontSize: '0.85rem' }}>Acesso ao CRM Inteligente</p>
        </div>

        <form onSubmit={handleLogin}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-accent-green)' }}>E-mail de Acesso</label>
            <input 
              className="input-field" 
              type="email" 
              placeholder="seu@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-accent-green)' }}>Senha</label>
            <input 
              className="input-field" 
              type="password" 
              placeholder="••••••••" 
              required 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
            ENTRAR
          </button>
        </form>


      </div>

    </div>
  );
}
