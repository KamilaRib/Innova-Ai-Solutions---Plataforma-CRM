import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, User as UserIcon, Mail, Trash2, Key } from 'lucide-react';
import { apiFetch } from '../utils/api';

const ROLES = ['ADMINISTRADOR', 'MARKETING', 'COMERCIAL', 'GESTOR'];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'COMERCIAL', password: '' });

  const fetchUsers = async () => {
    try {
      const res = await apiFetch('/api/users');
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await apiFetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Erro ao cadastrar usuário.');
        return;
      }
      setUsers([...users, data.data]);
      setNewUser({ name: '', email: '', role: 'COMERCIAL', password: '' });
    } catch (err) {
      setError('Erro ao conectar com o servidor.');
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Desativar o acesso deste usuário?')) return;
    try {
      const res = await apiFetch(`/api/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => (u.id === id ? { ...u, active: false } : u)));
      } else {
        alert(data.error || 'Erro ao desativar usuário.');
      }
    } catch (err) {
      alert('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
          <Shield size={32} color="var(--color-accent-green)" />
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#fff' }}>Gestão de Acessos</h1>
            <p style={{ opacity: 0.6, margin: 0 }}>Controle de usuários e níveis de acesso (RBAC)</p>
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
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
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
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Senha Inicial</label>
                <input
                  className="input-field"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                  required
                  minLength={8}
                />
              </div>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Nível de Acesso</label>
                <select
                  className="input-field"
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  style={{ appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="ADMINISTRADOR">ADMINISTRADOR (Acesso Total)</option>
                  <option value="MARKETING">MARKETING (Campanhas e Criativos)</option>
                  <option value="COMERCIAL">COMERCIAL (Leads e Clientes)</option>
                  <option value="GESTOR">GESTOR (Leitura Ampla)</option>
                </select>
              </div>
              {error && (
                <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '15px' }}>{error}</p>
              )}
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                REGISTRAR USUÁRIO
              </button>
            </form>
          </div>

          {/* LISTA DE USUÁRIOS ATIVOS */}
          <div className="card">
            <h3 style={{ marginBottom: '25px' }}>Usuários</h3>
            {loading ? (
              <p style={{ opacity: 0.5 }}>Carregando...</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {users.map(u => (
                  <div key={u.id} style={{
                    background: 'rgba(255,255,255,0.02)',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    opacity: u.active ? 1 : 0.4
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{
                        width: '45px', height: '45px', borderRadius: '50%',
                        background: u.role === 'ADMINISTRADOR' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: `1px solid ${u.role === 'ADMINISTRADOR' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.1)'}`
                      }}>
                        {u.role === 'ADMINISTRADOR' ? <Shield size={20} color="var(--color-accent-green)" /> : <UserIcon size={20} opacity={0.5} />}
                      </div>
                      <div>
                        <strong style={{ display: 'block' }}>{u.name}{!u.active && ' (inativo)'}</strong>
                        <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>{u.email}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{
                        fontSize: '0.7rem', fontWeight: 'bold', padding: '4px 10px', borderRadius: '4px',
                        background: u.role === 'ADMINISTRADOR' ? 'var(--color-accent-green)' : 'rgba(255,255,255,0.1)',
                        color: u.role === 'ADMINISTRADOR' ? '#000' : 'rgba(255,255,255,0.6)'
                      }}>
                        {u.role}
                      </div>
                      {u.active && (
                        <button onClick={() => handleDeactivate(u.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
