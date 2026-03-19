import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Columns, Users, MessageSquare, CalendarCheck, Settings, LogOut } from 'lucide-react';

export default function ClientLayout() {
  const navigate = useNavigate();
  // Simula o controle de acesso do Banco de Dados
  const userRole = localStorage.getItem('role') || 'USER';
  
  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div className="layout-container">
      {/* MENU LATERAL */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          INNOVA <span style={{ color: 'var(--color-accent-cyan)' }}>AI</span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          
          {/* Bloqueio White-Label: Dashboard SOMENTE PARA ADMINS */}
          {userRole !== 'USER' && (
            <NavLink to="/app/dashboard" className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={20} />
              <span>Dashboard Analítico</span>
            </NavLink>
          )}

          <NavLink to="/app/kanban" className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}>
            <Columns size={20} />
            <span>Leads</span>
          </NavLink>

          <NavLink to="/app/chats" className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}>
            <MessageSquare size={20} />
            <span>Chats (Intervenção)</span>
          </NavLink>

          <NavLink to="/app/leads" className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}>
            <Users size={20} />
            <span>Base de Contatos</span>
          </NavLink>

          <NavLink to="/app/agendamentos" className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}>
            <CalendarCheck size={20} />
            <span>Agendamentos</span>
          </NavLink>

          {/* Bloqueio White-Label para o MENU do Cliente */}
          {userRole !== 'USER' && (
            <NavLink to="/app/settings" className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}>
              <Settings size={20} />
              <span>Configurações Globais</span>
            </NavLink>
          )}

        </nav>

        <button 
          onClick={handleLogout}
          className="menu-item" 
          style={{ background: 'transparent', border: 'none', width: '100%', cursor: 'pointer', opacity: 0.7, marginTop: 'auto' }}
        >
          <LogOut size={20} color="var(--color-accent-cyan)" />
          <span>Sair do Sistema</span>
        </button>
      </aside>

      {/* ÁREA CENTRAL DAS PÁGINAS */}
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}
