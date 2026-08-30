import React, { useContext, useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Columns, Users, Building2, MessageSquare, CalendarCheck, Settings, LogOut, Calendar, DollarSign, Share2, Facebook, Instagram, Youtube, Palette, MessageCircle, Zap, ChevronDown, ChevronRight, ChevronUp, ChevronsUpDown, Sun, Moon, Monitor, CalendarDays, Sparkles, Brain, BarChart, LineChart, Activity, ClipboardList, Target, ShoppingBag, Shield, Filter, Plus, Edit2, Check } from 'lucide-react';
import { SettingsContext } from '../context/SettingsContext';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

const TikTokIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle' }}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-1.26-.88-2.22-2.19-2.68-3.64-.03 4.14-.02 8.28-.02 12.43-2.01 1.05-4.44 1.26-6.63.61-2.19-.65-4.17-2.31-5.18-4.38-1.01-2.07-1.01-4.63 0-6.7 1.01-2.07 2.99-3.73 5.18-4.38.74-.22 1.5-.3 2.26-.29V8.04c-.42-.05-.85-.06-1.27.02-1.31.25-2.51 1.06-3.23 2.2-.72 1.14-.88 2.53-.45 3.84.43 1.31 1.5 2.39 2.83 2.8.29.09.6.14.9.14 1.62-.05 3.14-1.22 3.63-2.76.04-.13.06-.27.07-.41V.02z" />
  </svg>
);

export default function ClientLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useContext(SettingsContext);
  const { user, logout } = useContext(AuthContext);
  const userRole = user?.role || 'COMERCIAL';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const closeMobile = () => setIsMobileOpen(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const [expandedGroups, setExpandedGroups] = useState({
    social: false,
    settings: false,
    statistics: false,
    funnels: true
  });

  const [funnels, setFunnels] = useState([]);
  const [editingFunnelId, setEditingFunnelId] = useState(null);
  const [editingFunnelName, setEditingFunnelName] = useState('');
  const [savingFunnel, setSavingFunnel] = useState(false);

  const fetchFunnels = async () => {
    try {
      const res = await apiFetch('/api/funnels');
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setFunnels(data.data);
      } else {
        setFunnels([{ id: 'default', name: 'Funil Principal', is_default: true }]);
      }
    } catch (err) {
      console.error('Erro ao carregar funis no menu:', err);
    }
  };

  useEffect(() => {
    fetchFunnels();
    const handleFunnelUpdated = () => fetchFunnels();
    window.addEventListener('funnelUpdated', handleFunnelUpdated);
    return () => window.removeEventListener('funnelUpdated', handleFunnelUpdated);
  }, []);

  const handleStartEditFunnel = (e, funnel) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingFunnelId(funnel.id);
    setEditingFunnelName(funnel.name);
  };

  const handleSaveEditFunnel = async (funnelId) => {
    const newName = editingFunnelName.trim();
    if (!newName) {
      setEditingFunnelId(null);
      return;
    }
    // Atualização otimista imediata na UI
    setFunnels(prev => prev.map(f => f.id === funnelId ? { ...f, name: newName } : f));
    setEditingFunnelId(null);
    setSavingFunnel(true);
    try {
      const res = await apiFetch(`/api/funnels/${funnelId}`, {
        method: 'PUT',
        body: JSON.stringify({ name: newName })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setFunnels(prev => prev.map(f => (f.id === funnelId || f.id === 'default') ? data.data : f));
        window.dispatchEvent(new CustomEvent('funnelUpdated', { detail: data.data }));
      }
    } catch (error) {
      console.error('Erro ao salvar novo nome do funil:', error);
      fetchFunnels();
    } finally {
      setSavingFunnel(false);
    }
  };


  const handleCancelEditFunnel = () => {
    setEditingFunnelId(null);
  };


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
                <span style={{ color: 'var(--color-accent)', marginLeft: '6px' }}>AI</span>
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
                <span style={{ color: 'var(--color-accent)', marginLeft: '8px' }}>
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

        <nav className="custom-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', paddingRight: '10px' }}>

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
                <NavLink onClick={closeMobile} to="/app/analysis/goals" className={({ isActive }) => `sub-menu-item ${isActive ? 'active' : ''}`}>
                  <Target size={16} />
                  <span>Relatório de metas</span>
                </NavLink>
              </div>
            )}
          </div>

          <div className="nav-group">
            <div
              className={`menu-item ${location.pathname.includes('kanban') || location.pathname.includes('funnels') ? 'active' : ''}`}
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
                {funnels.map(funnel => {
                  const isEditing = editingFunnelId === funnel.id;
                  
                  // Identifica exatamente qual funil está ativo
                  const currentQueryId = new URLSearchParams(location.search).get('funnel_id');
                  const isThisSelected = location.pathname.includes('/app/kanban') && (
                    currentQueryId ? currentQueryId === funnel.id : (funnel.is_default || funnel === funnels[0])
                  );

                  if (isEditing) {
                    return (
                      <div
                        key={funnel.id}
                        className="sub-menu-item"
                        style={{
                          padding: '6px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: 'rgba(0, 210, 255, 0.1)',
                          border: '1px solid rgba(0, 210, 255, 0.3)',
                          borderRadius: '6px',
                          margin: '2px 0'
                        }}
                      >
                        <Filter size={14} color="var(--color-accent-cyan, #00d2ff)" style={{ flexShrink: 0 }} />
                        <input
                          type="text"
                          autoFocus
                          value={editingFunnelName}
                          onChange={(e) => setEditingFunnelName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEditFunnel(funnel.id);
                            if (e.key === 'Escape') handleCancelEditFunnel();
                          }}
                          onBlur={() => handleSaveEditFunnel(funnel.id)}
                          style={{
                            flex: 1,
                            background: '#1a1f26',
                            border: '1px solid var(--color-accent-cyan, #00d2ff)',
                            borderRadius: '4px',
                            color: '#fff',
                            padding: '4px 8px',
                            fontSize: '0.85rem',
                            outline: 'none',
                            width: '100%'
                          }}
                          placeholder="Nome do funil..."
                        />
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSaveEditFunnel(funnel.id);
                          }}
                          title="Salvar (Enter)"
                          style={{
                            background: 'var(--color-accent-green, #10b981)',
                            border: 'none',
                            color: '#000',
                            borderRadius: '4px',
                            padding: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Check size={12} strokeWidth={3} />
                        </button>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={funnel.id}
                      onClick={closeMobile}
                      to={`/app/kanban?funnel_id=${funnel.id}`}
                      className={`sub-menu-item ${isThisSelected ? 'active' : ''}`}
                      onDoubleClick={(e) => handleStartEditFunnel(e, funnel)}
                      title="Clique duas vezes para renomear este funil"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <Filter size={16} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{funnel.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStartEditFunnel(e, funnel)}
                        title="Editar nome"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'inherit',
                          opacity: 0.4,
                          cursor: 'pointer',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.4'}
                      >
                        <Edit2 size={12} />
                      </button>
                    </Link>
                  );
                })}

                <Link 
                  onClick={closeMobile} 
                  to="/app/funnels" 
                  className={`sub-menu-item ${location.pathname === '/app/funnels' ? 'active' : ''}`}
                >
                  <Plus size={16} />
                  <span>+ Adicionar Funil</span>
                </Link>
              </div>
            )}
          </div>




          <NavLink onClick={closeMobile} to="/app/chats" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
            <MessageSquare size={20} />
            <span>Chats</span>
          </NavLink>

          <NavLink onClick={closeMobile} to="/app/clients" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
            <Building2 size={20} />
            <span>Clientes</span>
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
                <NavLink onClick={closeMobile} to="/app/social/hub" className={({ isActive }) => `sub-menu-item ${isActive ? 'active' : ''}`}>
                  <Share2 size={16} />
                  <span>Conectar Contas</span>
                </NavLink>
                <NavLink onClick={closeMobile} to="/app/settings/evolution" className={({ isActive }) => `sub-menu-item ${isActive ? 'active' : ''}`}>
                  <Zap size={16} />
                  <span>WhatsApp Evolution</span>
                </NavLink>
                <NavLink onClick={closeMobile} to="/app/social/schedule" className={({ isActive }) => `sub-menu-item ${isActive ? 'active' : ''}`}>
                  <CalendarCheck size={16} />
                  <span>Agendar Post</span>
                </NavLink>
                <NavLink onClick={closeMobile} to="/app/social/calendar" className={({ isActive }) => `sub-menu-item ${isActive ? 'active' : ''}`}>
                  <CalendarDays size={16} />
                  <span>Calendário</span>
                </NavLink>
                <NavLink onClick={closeMobile} to="/app/social/creatives" className={({ isActive }) => `sub-menu-item ${isActive ? 'active' : ''}`}>
                  <Palette size={16} />
                  <span>Criativos</span>
                </NavLink>
              </div>
            )}
          </div>



          <NavLink onClick={closeMobile} to="/app/products" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
            <ShoppingBag size={20} />
            <span>Produtos</span>
          </NavLink>

        </nav>

        {/* PROFILE WIDGET NO RODAPÉ */}
        <div style={{ position: 'relative', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
          
          {/* POPOVER MENU */}
          {isProfileMenuOpen && (
            <div style={{
              position: 'absolute',
              bottom: 'calc(100% + 10px)',
              left: 0,
              width: '100%',
              background: '#2d2d2d',
              borderRadius: '12px',
              padding: '12px',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
              zIndex: 100,
              color: '#fff',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* User Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.2)' }}>
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : 'KG'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.name || 'Kamila Ribeiro Gomes'}</span>
                  <span style={{ color: '#aaa', fontSize: '0.75rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.email || 'Kamilarib@yahoo.com.br'}</span>
                </div>
              </div>

              {/* Theme Switcher */}
              <div style={{ paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.7rem', color: '#888', fontWeight: 'bold', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>TEMA</span>
                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '4px' }}>
                  <button style={{ flex: 1, padding: '6px', background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer', borderRadius: '6px', display: 'flex', justifyContent: 'center' }}>
                    <Sun size={16} />
                  </button>
                  <button style={{ flex: 1, padding: '6px', background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer', borderRadius: '6px', display: 'flex', justifyContent: 'center' }}>
                    <Moon size={16} />
                  </button>
                  <button style={{ flex: 1, padding: '6px', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '6px', display: 'flex', justifyContent: 'center' }}>
                    <Monitor size={16} />
                  </button>
                </div>
              </div>

              {/* Action Links */}
              <Link 
                to="/app/settings/profile" 
                onClick={() => { closeMobile(); setIsProfileMenuOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 4px', color: '#fff', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}
              >
                <Settings size={18} color="#aaa" />
                Configurações
              </Link>
              
              <button 
                onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 4px', color: '#fff', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <LogOut size={18} color="#aaa" />
                Sair
              </button>
            </div>
          )}

          {/* User Button */}
          <button 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              width: '100%',
              padding: '10px 12px',
              background: isProfileMenuOpen ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              cursor: 'pointer',
              color: '#fff',
              transition: 'background 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'KG'}
              </div>
              <span style={{ fontWeight: '500', fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '120px', textAlign: 'left' }}>
                {user?.name || 'Kamila Ribeiro Go...'}
              </span>
            </div>
            <ChevronsUpDown size={16} color="#aaa" />
          </button>
        </div>

      </aside>

      {/* ÁREA CENTRAL DAS PÁGINAS */}
      <main className="page-content" style={isChatPage ? { padding: 0 } : { padding: '30px' }}>
        <Outlet />
      </main>
    </div>
  );
}
