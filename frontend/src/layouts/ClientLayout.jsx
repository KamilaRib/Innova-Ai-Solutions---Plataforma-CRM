import React, { useContext, useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Columns, Users, MessageSquare, CalendarCheck, Settings, LogOut, Calendar, DollarSign, Share2, Facebook, Instagram, Youtube, Palette, MessageCircle, Zap, ChevronDown, ChevronRight, CalendarDays, Sparkles, Brain, BarChart, LineChart, Activity, ClipboardList, Target, ShoppingBag, Shield, Filter, Plus } from 'lucide-react';
import { SettingsContext } from '../context/SettingsContext';

const TikTokIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle' }}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-1.26-.88-2.22-2.19-2.68-3.64-.03 4.14-.02 8.28-.02 12.43-2.01 1.05-4.44 1.26-6.63.61-2.19-.65-4.17-2.31-5.18-4.38-1.01-2.07-1.01-4.63 0-6.7 1.01-2.07 2.99-3.73 5.18-4.38.74-.22 1.5-.3 2.26-.29V8.04c-.42-.05-.85-.06-1.27.02-1.31.25-2.51 1.06-3.23 2.2-.72 1.14-.88 2.53-.45 3.84.43 1.31 1.5 2.39 2.83 2.8.29.09.6.14.9.14 1.62-.05 3.14-1.22 3.63-2.76.04-.13.06-.27.07-.41V.02z" />
  </svg>
);

export default function ClientLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useContext(SettingsContext);
  const userRole = localStorage.getItem('role') || 'OPERADOR';

  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/');
  };

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const closeMobile = () => setIsMobileOpen(false);

  const [expandedGroups, setExpandedGroups] = useState({
    social: false,
    settings: false,
    statistics: false,
    funnels: false
  });

  const toggleGroup = (group) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const isChatPage = location.pathname.includes('/app/chats');

  return (
    <div className="layout-container">
      {/* MOBILE HEADER */}
      <header className="mobile-header">
        <div className="logo">
          <Link to="/app/dashboard" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="Logo" style={{ maxHeight: '30px' }} />
            ) : (
              <>
                INNOVA
                <span style={{ color: 'var(--color-accent-green)', marginLeft: '6px' }}>AI</span>
                <span style={{ color: '#fff', marginLeft: '6px' }}>SOLUTIONS</span>
              </>
            )}
          </Link>
        </div>
        <button className="mobile-header-btn" onClick={() => setIsMobileOpen(true)}>
          <Menu size={24} />
        </button>
      </header>

      {/* OVERLAY MOBILE */}
      <div
        className={`mobile-overlay ${isMobileOpen ? 'open' : ''}`}
        onClick={closeMobile}
      />

      {/* MENU LATERAL */}
      <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
        <div className="sidebar-logo" style={{ color: '#fff', fontSize: '1.2rem' }}>
          <Link to="/app/dashboard" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt={settings.business_name || 'Logo'} style={{ maxHeight: '40px' }} />
            ) : (
              <>
                {settings?.business_name ? settings.business_name.split(' ')[0].toUpperCase() : 'INNOVA'}
                <span style={{ color: 'var(--color-accent-green)', marginLeft: '8px' }}>
                  {settings?.business_name ? settings.business_name.split(' ')[1]?.toUpperCase() : 'AI'}
                </span>
                <span style={{ color: '#fff', marginLeft: '8px' }}>
                  {settings?.business_name ? settings.business_name.split(' ').slice(2).join(' ').toUpperCase() : 'SOLUTIONS'}
                </span>
              </>
            )}
          </Link>
          <button className="mobile-close-btn" onClick={closeMobile}>
            <X size={20} />
          </button>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>

          {userRole !== 'USER' && (
            <NavLink onClick={closeMobile} to="/app/dashboard" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
          )}

          <div className="nav-group">
            <div
              className={`menu-item ${location.pathname.includes('analysis') ? 'active' : ''}`}
              onClick={() => toggleGroup('statistics')}
              style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <BarChart size={20} />
                <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '800', opacity: 0.7, letterSpacing: '0.05em' }}>Análise de Dados</span>
              </div>
              {expandedGroups.statistics ? <ChevronDown size={14} opacity={0.5} /> : <ChevronRight size={14} opacity={0.5} />}
            </div>

            {expandedGroups.statistics && (
              <div className="sub-menu">
                <NavLink onClick={closeMobile} to="/app/analysis/sales" className={({ isActive }) => `sub-menu-item ${isActive ? 'active' : ''}`}>
                  <BarChart size={16} />
                  <span>Análise de vendas</span>
                </NavLink>
                <NavLink onClick={closeMobile} to="/app/analysis/consolidated" className={({ isActive }) => `sub-menu-item ${isActive ? 'active' : ''}`}>
                  <Activity size={16} />
                  <span>Relatório consolidado</span>
                </NavLink>
                <NavLink onClick={closeMobile} to="/app/analysis/roi" className={({ isActive }) => `sub-menu-item ${isActive ? 'active' : ''}`}>
                  <DollarSign size={16} />
                  <span>ROI</span>
                </NavLink>
                <NavLink onClick={closeMobile} to="/app/analysis/activities" className={({ isActive }) => `sub-menu-item ${isActive ? 'active' : ''}`}>
                  <ClipboardList size={16} />
                  <span>Relatório por atividades</span>
                </NavLink>
                <NavLink onClick={closeMobile} to="/app/analysis/goals" className={({ isActive }) => `sub-menu-item ${isActive ? 'active' : ''}`}>
                  <Target size={16} />
                  <span>Relatório de metas</span>
                </NavLink>
              </div>
            )}
          </div>

          <div className="nav-group">
            <div
              className={`menu-item ${location.pathname.includes('kanban') ? 'active' : ''}`}
              onClick={() => toggleGroup('funnels')}
              style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Filter size={20} />
                <span>Funis de Vendas</span>
              </div>
              {expandedGroups.funnels ? <ChevronDown size={14} opacity={0.5} /> : <ChevronRight size={14} opacity={0.5} />}
            </div>

            {expandedGroups.funnels && (
              <div className="sub-menu">
                <NavLink onClick={closeMobile} to="/app/kanban" className={({ isActive }) => `sub-menu-item ${isActive ? 'active' : ''}`}>
                  <Filter size={16} />
                  <span>Funil Principal</span>
                </NavLink>
                <NavLink onClick={closeMobile} to="/app/funnels" className={({ isActive }) => `sub-menu-item ${isActive ? 'active' : ''}`}>
                  <Plus size={16} />
                  <span>Adicionar Funil</span>
                </NavLink>
              </div>
            )}
          </div>

          <NavLink onClick={closeMobile} to="/app/tasks" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
            <Calendar size={20} />
            <span>Tarefas</span>
          </NavLink>

          <NavLink onClick={closeMobile} to="/app/calendar" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
            <CalendarDays size={20} />
            <span>Calendário</span>
          </NavLink>

          <NavLink onClick={closeMobile} to="/app/chats" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
            <MessageSquare size={20} />
            <span>Chats</span>
          </NavLink>

          <NavLink onClick={closeMobile} to="/app/leads" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
            <Users size={20} />
            <span>Carteira de Cliente</span>
          </NavLink>

          <div className="nav-group">
            <div
              className={`menu-item ${location.pathname.includes('social') ? 'active' : ''}`}
              onClick={() => toggleGroup('social')}
              style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Share2 size={20} />
                <span>Redes Sociais</span>
              </div>
              {expandedGroups.social ? <ChevronDown size={14} opacity={0.5} /> : <ChevronRight size={14} opacity={0.5} />}
            </div>

            {expandedGroups.social && (
              <div className="sub-menu">
                <NavLink onClick={closeMobile} to="/app/social/facebook" className={({ isActive }) => `sub-menu-item ${isActive ? 'active' : ''}`}>
                  <Facebook size={16} />
                  <span>Facebook</span>
                </NavLink>
                <NavLink onClick={closeMobile} to="/app/social/instagram" className={({ isActive }) => `sub-menu-item ${isActive ? 'active' : ''}`}>
                  <Instagram size={16} />
                  <span>Instagram</span>
                </NavLink>
                <NavLink onClick={closeMobile} to="/app/social/tiktok" className={({ isActive }) => `sub-menu-item ${isActive ? 'active' : ''}`}>
                  <TikTokIcon size={16} />
                  <span>TikTok</span>
                </NavLink>
                <NavLink onClick={closeMobile} to="/app/social/youtube" className={({ isActive }) => `sub-menu-item ${isActive ? 'active' : ''}`}>
                  <Youtube size={16} />
                  <span>YouTube</span>
                </NavLink>
              </div>
            )}
          </div>

          <NavLink onClick={closeMobile} to="/app/creatives" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
            <Palette size={20} />
            <span>Criativos</span>
          </NavLink>

          <NavLink onClick={closeMobile} to="/app/products" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
            <ShoppingBag size={20} />
            <span>Produtos</span>
          </NavLink>

          <div className="nav-group">
            <div
              className={`menu-item ${location.pathname.includes('settings') ? 'active' : ''}`}
              onClick={() => toggleGroup('settings')}
              style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Settings size={20} />
                <span>Configurações</span>
              </div>
              {expandedGroups.settings ? <ChevronDown size={14} opacity={0.5} /> : <ChevronRight size={14} opacity={0.5} />}
            </div>

            {expandedGroups.settings && (
              <div className="sub-menu">
                {userRole === 'ADM' && (
                  <NavLink onClick={closeMobile} to="/app/settings/users" className={({ isActive }) => `sub-menu-item ${isActive ? 'active' : ''}`}>
                    <Shield size={16} color="var(--color-accent-green)" />
                    <span>Gestão de Usuários</span>
                  </NavLink>
                )}
                <NavLink onClick={closeMobile} to="/app/settings/branding" className={({ isActive }) => `sub-menu-item ${isActive ? 'active' : ''}`}>
                  <Palette size={16} />
                  <span>Identidade Visual</span>
                </NavLink>
                <NavLink onClick={closeMobile} to="/app/settings/whatsapp" className={({ isActive }) => `sub-menu-item ${isActive ? 'active' : ''}`}>
                  <MessageCircle size={16} />
                  <span>WhatsApp API</span>
                </NavLink>
                <NavLink onClick={closeMobile} to="/app/settings/evolution" className={({ isActive }) => `sub-menu-item ${isActive ? 'active' : ''}`}>
                  <Zap size={16} color="var(--color-accent-green)" />
                  <span>Evolution API (Local)</span>
                </NavLink>
              </div>
            )}
          </div>

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
      <main className="page-content" style={isChatPage ? { padding: 0 } : { padding: '30px' }}>
        <Outlet />
      </main>
    </div>
  );
}
