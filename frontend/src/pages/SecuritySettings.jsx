import React, { useState } from 'react';
import { User, Store, ShieldCheck, Palette, KeyRound, Eye, EyeOff, Key, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const SecuritySettings = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Gate states
  const [gatePassword, setGatePassword] = useState('');
  const [showGatePassword, setShowGatePassword] = useState(false);
  const [isGateFocused, setIsGateFocused] = useState(false);
  const [passkeyError, setPasskeyError] = useState('');

  // Settings states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User, path: '/app/settings/profile' },
    { id: 'store', label: 'Dados da Loja & Fiscal', icon: Store, path: '/app/settings/store' },
    { id: 'security', label: 'Segurança', icon: ShieldCheck, path: '/app/settings/security' },
    { id: 'appearance', label: 'Aparência', icon: Palette, path: '/app/settings/branding' },
  ];

  const handlePasskey = async () => {
    setPasskeyError('');
    try {
      if (!window.PublicKeyCredential) {
        setPasskeyError("Seu navegador não suporta chaves de acesso.");
        return;
      }
      const publicKey = {
        challenge: new Uint8Array(32),
        rpId: window.location.hostname,
        userVerification: "required",
      };
      await navigator.credentials.get({ publicKey });
      setIsAuthenticated(true);
    } catch (err) {
      setPasskeyError("The passkey operation was cancelled.");
    }
  };

  const handlePasswordSubmit = () => {
    if (!gatePassword) return;
    // In real app, validate password via API
    setIsAuthenticated(true);
  };

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Por favor, preencha todos os campos de senha.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("A nova senha e a confirmação não coincidem.");
      return;
    }
    alert("Senha atualizada com sucesso!");
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleActivate2FA = () => {
    alert("O fluxo de ativação do 2FA será iniciado em breve (Leitura de QR Code).");
  };

  const handleAddPasskey = () => {
    alert("Iniciando o registro de nova chave de acesso (WebAuthn).");
  };

  const inputStyle = {
    width: '100%', 
    padding: '12px 15px', 
    background: 'rgba(255,255,255,0.05)', 
    border: '1px solid rgba(255,255,255,0.1)', 
    borderRadius: '8px', 
    color: '#fff', 
    fontSize: '0.9rem', 
    outline: 'none',
    transition: 'border-color 0.2s'
  };

  const renderPasswordInput = (label, value, setValue, show, setShow) => (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#ccc', marginBottom: '8px' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input 
          type={show ? 'text' : 'password'} 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-accent-green)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          style={inputStyle} 
        />
        <button 
          type="button"
          onClick={() => setShow(!show)}
          style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '20px 40px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px' }}>Configurações</h1>
      <p style={{ color: '#aaa', fontSize: '0.95rem', marginBottom: '40px' }}>Gerencie seu perfil e configurações de conta</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '5px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '15px', marginBottom: '40px', overflowX: 'auto' }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = location.pathname.includes(tab.path);
          return (
            <Link key={tab.id} to={tab.path} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '20px', background: isActive ? 'var(--color-accent-green)' : 'transparent', color: isActive ? '#000' : '#888', textDecoration: 'none', fontSize: '0.85rem', fontWeight: isActive ? '800' : '500', transition: 'all 0.2s ease', whiteSpace: 'nowrap' }}>
              <Icon size={16} />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {!isAuthenticated ? (
        /* Auth Screen (Gate) */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '-40px' }}>
          <div style={{ background: '#fff', width: '40px', height: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', boxShadow: '0 4px 15px rgba(255,255,255,0.2)' }}>
            <ShieldCheck size={20} color="#000" />
          </div>
          
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '10px' }}>Confirmar senha</h2>
          <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '30px', textAlign: 'center', maxWidth: '350px', lineHeight: '1.5' }}>
            Esta é uma área segura do aplicativo. Confirme sua senha antes de continuar.
          </p>

          <div style={{ width: '100%', maxWidth: '380px' }}>
            <button 
              onClick={handlePasskey}
              style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', marginBottom: passkeyError ? '10px' : '30px', transition: 'all 0.2s' }}
            >
              <KeyRound size={16} />
              Confirmar com chave de acesso
            </button>
            
            {passkeyError && (
              <p style={{ color: '#ff4d4d', fontSize: '0.8rem', textAlign: 'center', marginBottom: '30px', marginTop: '-5px' }}>
                {passkeyError}
              </p>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
              <span style={{ fontSize: '0.7rem', color: '#666', fontWeight: '700', letterSpacing: '0.05em' }}>OU CONFIRME COM SENHA</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>Senha</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showGatePassword ? 'text' : 'password'} 
                  placeholder="Senha" 
                  value={gatePassword}
                  onChange={(e) => setGatePassword(e.target.value)}
                  onFocus={() => setIsGateFocused(true)}
                  onBlur={() => setIsGateFocused(false)}
                  style={{ 
                    width: '100%', padding: '12px 15px', background: 'rgba(255,255,255,0.05)', 
                    border: isGateFocused ? '1px solid var(--color-accent-green)' : '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none',
                    transition: 'border-color 0.2s'
                  }} 
                />
                <button 
                  type="button"
                  onClick={() => setShowGatePassword(!showGatePassword)}
                  style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {showGatePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button onClick={handlePasswordSubmit} style={{ width: '100%', padding: '12px', background: 'var(--color-accent-green)', border: 'none', borderRadius: '8px', color: '#000', fontSize: '0.95rem', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s' }}>
              Confirmar
            </button>
          </div>
        </div>
      ) : (
        /* Actual Security Settings */
        <div style={{ maxWidth: '800px' }}>
          
          {/* Atualizar senha */}
          <div style={{ marginBottom: '50px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '5px' }}>Atualizar senha</h2>
            <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '25px' }}>Verifique se sua conta está usando uma senha longa e aleatória para permanecer segura</p>
            
            {renderPasswordInput('Senha atual', currentPassword, setCurrentPassword, showCurrentPassword, setShowCurrentPassword)}
            {renderPasswordInput('Nova senha', newPassword, setNewPassword, showNewPassword, setShowNewPassword)}
            {renderPasswordInput('Confirmar senha', confirmPassword, setConfirmPassword, showConfirmPassword, setShowConfirmPassword)}

            <button onClick={handleUpdatePassword} style={{ background: 'var(--color-accent-green)', color: '#000', border: 'none', borderRadius: '8px', padding: '10px 25px', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem', marginTop: '10px' }}>
              Salvar
            </button>
          </div>

          {/* 2FA */}
          <div style={{ marginBottom: '50px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '5px' }}>Autenticação de dois fatores</h2>
            <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '5px' }}>Gerencie suas configurações de autenticação de dois fatores</p>
            <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '20px' }}>Ao ativar a autenticação de dois fatores, você será solicitado a fornecer um PIN seguro durante o login. Este PIN pode ser obtido em um aplicativo compatível com TOTP no seu telefone.</p>
            
            <button onClick={handleActivate2FA} style={{ background: 'var(--color-accent-green)', color: '#000', border: 'none', borderRadius: '8px', padding: '10px 25px', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem' }}>
              Ativar 2FA
            </button>
          </div>

          {/* Chaves de acesso */}
          <div style={{ marginBottom: '50px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '5px' }}>Chaves de acesso</h2>
            <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '20px' }}>Gerencie suas chaves de acesso para entrar sem senha</p>
            
            <div style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.01)', marginBottom: '25px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
                <Key size={20} color="#888" />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff', marginBottom: '5px' }}>Nenhuma chave de acesso ainda</h3>
              <p style={{ fontSize: '0.8rem', color: '#888', margin: 0 }}>Adicione uma chave de acesso para entrar sem senha</p>
            </div>

            <button onClick={handleAddPasskey} style={{ background: 'var(--color-accent-green)', color: '#000', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={16} /> Adicionar chave de acesso
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default SecuritySettings;
