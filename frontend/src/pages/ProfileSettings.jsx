import React, { useState, useContext } from 'react';
import { User, Store, ShieldCheck, Palette, AlertTriangle } from 'lucide-react';
import { apiFetch } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const ProfileSettings = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [name, setName] = useState(user?.name || 'KAMILA RIBEIRO GOMES');
  const [email, setEmail] = useState(user?.email || 'Kamilarib@yahoo.com.br');
  const [focusedInput, setFocusedInput] = useState('name');
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!window.confirm('ATENÇÃO: Você está prestes a solicitar a exclusão da sua conta.\n\nTem certeza que deseja prosseguir?')) return;
    
    setIsDeleting(true);
    setDeleteError('');
    try {
      const response = await apiFetch('/api/users/me', {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (!response.ok) {
        setDeleteError(data.error || 'Erro ao tentar excluir a conta.');
      } else {
        alert('Conta excluída com sucesso!');
        // Aqui acionaria o logout
      }
    } catch (error) {
      setDeleteError('Erro de conexão ao verificar o status da conta.');
    } finally {
      setIsDeleting(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User, path: '/app/settings/profile' },
    { id: 'store', label: 'Dados da Loja & Fiscal', icon: Store, path: '/app/settings/store' },
    { id: 'security', label: 'Segurança', icon: ShieldCheck, path: '/app/settings/security' },
    { id: 'appearance', label: 'Aparência', icon: Palette, path: '/app/settings/branding' },
  ];

  return (
    <div style={{ padding: '20px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px' }}>Configurações</h1>
      <p style={{ color: '#aaa', fontSize: '0.95rem', marginBottom: '40px' }}>Gerencie seu perfil e configurações de conta</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '5px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '15px', marginBottom: '40px', overflowX: 'auto' }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = location.pathname.includes(tab.path);
          return (
            <Link 
              key={tab.id}
              to={tab.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '20px',
                background: isActive ? 'var(--color-accent)' : 'transparent',
                color: isActive ? '#000' : '#888',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: isActive ? '700' : '500',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Profile Section */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '5px' }}>Perfil</h2>
        <p style={{ color: '#aaa', fontSize: '0.8rem', marginBottom: '30px' }}>Atualize seu nome e endereço de e-mail</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', maxWidth: '900px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '10px' }}>Nome</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocusedInput('name')}
              onBlur={() => setFocusedInput(null)}
              style={{
                width: '100%',
                padding: '14px 15px',
                background: focusedInput === 'name' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.03)',
                border: focusedInput === 'name' ? '1px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
                boxShadow: focusedInput === 'name' ? '0 0 0 1px var(--color-accent)' : 'none',
                transition: 'all 0.2s ease'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '10px' }}>E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              style={{
                width: '100%',
                padding: '14px 15px',
                background: focusedInput === 'email' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.03)',
                border: focusedInput === 'email' ? '1px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
                boxShadow: focusedInput === 'email' ? '0 0 0 1px var(--color-accent)' : 'none',
                transition: 'all 0.2s ease'
              }}
            />
          </div>

          <button 
            style={{
              background: 'var(--color-accent)',
              color: '#000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: '800',
              fontSize: '0.9rem',
              cursor: 'pointer',
              width: 'fit-content',
              marginTop: '5px'
            }}
          >
            Salvar
          </button>
        </div>
      </div>

      {/* Delete Account Section */}
      <div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '5px' }}>Excluir conta</h2>
        <p style={{ color: '#aaa', fontSize: '0.8rem', marginBottom: '20px' }}>Exclua sua conta e todos os seus recursos</p>
        
        {deleteError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(225, 29, 72, 0.1)', border: '1px solid rgba(225, 29, 72, 0.3)', padding: '12px 15px', borderRadius: '8px', color: '#e11d48', fontSize: '0.85rem', marginBottom: '20px', maxWidth: '600px' }}>
            <AlertTriangle size={18} />
            <span>{deleteError}</span>
          </div>
        )}

        <button 
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          style={{
            background: '#e11d48',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '0.85rem',
            cursor: isDeleting ? 'not-allowed' : 'pointer',
            opacity: isDeleting ? 0.7 : 1
          }}
        >
          {isDeleting ? 'Verificando pagamentos...' : 'Excluir conta'}
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
