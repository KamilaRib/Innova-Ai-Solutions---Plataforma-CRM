import React, { useState } from 'react';
import { UserPlus, Shield, User as UserIcon, Mail, Trash2, Key } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: '1', name: 'Admin Master', email: 'admin@innovaai.com.br', role: 'ADM' },
    { id: '2', name: 'Operador 01', email: 'op01@innovaai.com.br', role: 'OPERADOR' },
  ]);

  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'OPERADOR', password: '' });

  const handleAddUser = (e) => {
    e.preventDefault();
    // Aqui no futuro faremos a chamada para o seu Backend real
    const userToAdd = { ...newUser, id: Date.now().toString() };
    setUsers([...users, userToAdd]);
    setNewUser({ name: '', email: '', role: 'OPERADOR', password: '' });
    alert('Usuário cadastrado com sucesso!');
  };

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
          <Shield size={32} color="var(--color-accent-green)" />
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#fff' }}>Gestão de Acessos</h1>
            <p style={{ opacity: 0.6, margin: 0 }}>Controle de usuários Administradores e Operadores</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' }}>
          
          {/* FORMULÁRIO DE CADASTRO */}
          <div className="card" style={{ height: 'fit-content' }}>
            <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserPlus size={20} color="var(--color-accent-green)" />
              Novo Registro
            </h3>
            <form onSubmit={handleAddUser}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Nome Completo</label>
                <input 
                  className="input-field" 
                  placeholder="Ex: João Silva" 
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                  required
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>E-mail Corporativo</label>
                <input 
                  className="input-field" 
                  type="email" 
                  placeholder="nome@innovaai.com.br" 
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                  required
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Senha Inicial</label>
                <input 
                  className="input-field" 
                  type="password" 
                  placeholder="••••••••" 
                  value={newUser.password}
                  onChange={e => setNewUser({...newUser, password: e.target.value})}
                  required
                />
              </div>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Nível de Acesso</label>
                <select 
                  className="input-field"
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value})}
                  style={{ appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="OPERADOR">OPERADOR (Acesso Limitado)</option>
                  <option value="ADM">ADM (Acesso Total)</option>
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                REGISTRAR USUÁRIO
              </button>
            </form>
          </div>

          {/* LISTA DE USUÁRIOS ATIVOS */}
          <div className="card">
            <h3 style={{ marginBottom: '25px' }}>Usuários Ativos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {users.map(u => (
                <div key={u.id} style={{ 
                  background: 'rgba(255,255,255,0.02)', 
                  padding: '20px', 
                  borderRadius: '12px', 
                  border: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ 
                      width: '45px', height: '45px', borderRadius: '50%', 
                      background: u.role === 'ADM' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1px solid ${u.role === 'ADM' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.1)'}`
                    }}>
                      {u.role === 'ADM' ? <Shield size={20} color="var(--color-accent-green)" /> : <UserIcon size={20} opacity={0.5} />}
                    </div>
                    <div>
                      <strong style={{ display: 'block' }}>{u.name}</strong>
                      <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>{u.email}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                      fontSize: '0.7rem', fontWeight: 'bold', padding: '4px 10px', borderRadius: '4px',
                      background: u.role === 'ADM' ? 'var(--color-accent-green)' : 'rgba(255,255,255,0.1)',
                      color: u.role === 'ADM' ? '#000' : 'rgba(255,255,255,0.6)'
                    }}>
                      {u.role}
                    </div>
                    <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
