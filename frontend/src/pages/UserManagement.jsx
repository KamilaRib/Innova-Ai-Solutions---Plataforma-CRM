import React, { useState, useEffect, useContext } from 'react';
import { Search, Shield, User as UserIcon, Edit2, X, Plus } from 'lucide-react';
import { apiFetch } from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const UserManagement = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'COMERCIAL', password: '' });
  const [submitting, setSubmitting] = useState(false);

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
    setSubmitting(true);
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
      setIsModalOpen(false);
    } catch (err) {
      setError('Erro ao conectar com o servidor.');
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>Usuários da Loja</h1>
          <p style={{ opacity: 0.6, margin: '5px 0 0 0', fontSize: '0.9rem' }}>Gerencie os acessos da sua equipe</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ 
            background: 'var(--color-accent-green)', 
            color: '#000', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '8px', 
            fontWeight: 700, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            cursor: 'pointer',
            transition: '0.2s',
            boxShadow: '0 4px 15px rgba(34,197,94,0.3)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Plus size={18} /> Novo Usuário
        </button>
      </div>

      {/* SEARCH BAR */}
      <div style={{ position: 'relative', marginBottom: '30px' }}>
        <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
        <input 
          type="text" 
          placeholder="BUSCAR POR NOME OU E-MAIL..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '15px 15px 15px 45px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '0.85rem',
            outline: 'none',
            transition: 'border 0.3s'
          }}
          onFocus={(e) => e.currentTarget.style.border = '1px solid rgba(34,197,94,0.5)'}
          onBlur={(e) => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.05)'}
        />
      </div>

      {/* TABLE */}
      <div style={{ background: '#12151a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        
        {/* Table Header */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 2fr 1fr 1fr', 
          padding: '15px 25px', 
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.5)',
          textTransform: 'uppercase'
        }}>
          <div>USUÁRIO</div>
          <div>E-MAIL</div>
          <div>PERFIL</div>
          <div style={{ textAlign: 'center' }}>AÇÕES</div>
        </div>

        {/* Table Body */}
        <div>
          {loading ? (
            <div style={{ padding: '30px', textAlign: 'center', opacity: 0.5 }}>Carregando usuários...</div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', opacity: 0.5 }}>Nenhum usuário encontrado.</div>
          ) : (
            filteredUsers.map(u => (
              <div key={u.id} style={{ 
                display: 'grid', 
                gridTemplateColumns: '2fr 2fr 1fr 1fr', 
                padding: '15px 25px', 
                borderBottom: '1px solid rgba(255,255,255,0.02)',
                alignItems: 'center',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {/* USUÁRIO */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ 
                    width: '38px', height: '38px', borderRadius: '50%', 
                    background: 'var(--color-accent-green)', color: '#000', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontWeight: 800, fontSize: '0.9rem' 
                  }}>
                    {getInitials(u.name)}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                    {u.name}
                    {currentUser?.email === u.email && (
                      <span style={{ 
                        marginLeft: '10px', fontSize: '0.65rem', padding: '3px 8px', 
                        background: 'rgba(255,255,255,0.1)', borderRadius: '4px', opacity: 0.7 
                      }}>
                        você
                      </span>
                    )}
                  </div>
                </div>

                {/* E-MAIL */}
                <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                  {u.email}
                </div>

                {/* PERFIL */}
                <div>
                  <div style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '4px 10px', borderRadius: '20px', 
                    background: u.role === 'ADMINISTRADOR' ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${u.role === 'ADMINISTRADOR' ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.1)'}`,
                    color: u.role === 'ADMINISTRADOR' ? 'var(--color-accent-green)' : '#aaa',
                    fontSize: '0.7rem', fontWeight: 800
                  }}>
                    {u.role === 'ADMINISTRADOR' && <Shield size={12} />}
                    {u.role === 'ADMINISTRADOR' ? 'ADMIN' : u.role}
                  </div>
                </div>

                {/* AÇÕES */}
                <div style={{ textAlign: 'center' }}>
                  <button style={{ 
                    background: 'none', border: 'none', color: '#888', cursor: 'pointer', transition: '0.2s' 
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent-green)'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#888'}
                  title="Editar usuário (Em breve)"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div style={{ textAlign: 'right', marginTop: '15px', fontSize: '0.8rem', opacity: 0.5 }}>
        {filteredUsers.length} {filteredUsers.length === 1 ? 'usuário encontrado' : 'usuários encontrados'}
      </div>

      {/* MODAL NOVO USUÁRIO */}
      {isModalOpen && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 
        }}>
          <div style={{ 
            background: '#12151a', width: '100%', maxWidth: '450px', 
            borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)',
            padding: '30px', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            
            <h2 style={{ margin: '0 0 5px 0', fontSize: '1.4rem' }}>Novo Usuário</h2>
            <p style={{ margin: '0 0 25px 0', fontSize: '0.85rem', opacity: 0.5 }}>Adicione um novo membro à sua equipe.</p>

            <form onSubmit={handleAddUser}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Nome Completo *</label>
                <input 
                  type="text" 
                  placeholder="EX: CARLOS SOUZA" 
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                  required
                  style={{ 
                    width: '100%', padding: '12px 15px', background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' 
                  }}
                  onFocus={(e) => e.target.style.border = '1px solid var(--color-accent-green)'}
                  onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>E-mail *</label>
                <input 
                  type="email" 
                  placeholder="Ex: carlos@empresa.com" 
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                  required
                  style={{ 
                    width: '100%', padding: '12px 15px', background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' 
                  }}
                  onFocus={(e) => e.target.style.border = '1px solid var(--color-accent-green)'}
                  onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Senha *</label>
                <input 
                  type="password" 
                  placeholder="Mínimo 8 caracteres" 
                  value={newUser.password}
                  onChange={e => setNewUser({...newUser, password: e.target.value})}
                  required minLength={8}
                  style={{ 
                    width: '100%', padding: '12px 15px', background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' 
                  }}
                  onFocus={(e) => e.target.style.border = '1px solid var(--color-accent-green)'}
                  onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Perfil de Acesso *</label>
                <select 
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value})}
                  style={{ 
                    width: '100%', padding: '12px 15px', background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none',
                    cursor: 'pointer', appearance: 'none'
                  }}
                  onFocus={(e) => e.target.style.border = '1px solid var(--color-accent-green)'}
                  onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
                >
                  <option value="ADMINISTRADOR" style={{ color: '#000' }}>ADMINISTRADOR – ACESSO TOTAL</option>
                  <option value="COMERCIAL" style={{ color: '#000' }}>VENDEDOR – ACESSO ÀS VENDAS</option>
                  <option value="MARKETING" style={{ color: '#000' }}>MARKETING – ACESSO A CRIATIVOS</option>
                </select>
              </div>

              {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '15px' }}>{error}</div>}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.9rem' }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  style={{ 
                    background: 'var(--color-accent-green)', color: '#000', border: 'none', 
                    padding: '10px 25px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer',
                    opacity: submitting ? 0.7 : 1
                  }}
                >
                  {submitting ? 'Criando...' : 'Criar Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserManagement;
