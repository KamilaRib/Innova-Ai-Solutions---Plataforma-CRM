import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleLogin = (e) => {
    e.stringify;
    e.preventDefault();
    // Simula validação para entrar no sistema
    localStorage.setItem('role', email.includes('admin') ? 'CLIENT_OWNER' : 'USER');
    navigate('/app/kanban');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      
      <div style={{
        background: 'rgba(248, 249, 250, 0.03)',
        backdropFilter: 'blur(12px)',
        padding: '3rem', borderRadius: '16px', border: '1px solid rgba(0, 245, 255, 0.1)',
        width: '100%', maxWidth: '450px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem' }}>
            INNOVA <span style={{ color: 'var(--color-accent-cyan)' }}>AI</span>
          </h1>
          <p style={{ opacity: 0.7 }}>Acesso ao CRM Inteligente</p>
        </div>

        <form onSubmit={handleLogin}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-accent-cyan)' }}>E-mail de Acesso</label>
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
