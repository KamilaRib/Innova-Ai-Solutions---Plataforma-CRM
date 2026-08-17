import React, { useContext, useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  Instagram, Facebook, MessageCircle, MessageSquare, Clock, Users, 
  CheckCircle, XCircle, Target, Filter, TrendingUp, AlertCircle,
  MoreVertical, Calendar, ShoppingBag
} from 'lucide-react';
import { SettingsContext } from '../context/SettingsContext';

// Mock de Dados para Fontes de Lead
const sourceData = [
  { name: 'Instagram', value: 400, color: '#E1306C' },
  { name: 'WhatsApp', value: 800, color: '#25D366' },
  { name: 'Messenger', value: 300, color: '#0084FF' },
  { name: 'Outros', value: 200, color: '#94A3B8' },
];

const processedData = [
  { name: 'Seg', value: 320 },
  { name: 'Ter', value: 450 },
  { name: 'Qua', value: 380 },
  { name: 'Qui', value: 520 },
  { name: 'Sex', value: 610 },
  { name: 'Sáb', value: 150 },
  { name: 'Dom', value: 80 },
];

const Dashboard = () => {
  const { settings } = useContext(SettingsContext);
  const accentColor = settings?.primary_color || '#22C55E';

  const [stats, setStats] = useState({
    totalLeads: 0,
    leadsAtivos: 0,
    leadsGanhos: 0,
    leadsPerdidos: 0,
    totalMessages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/leads/stats');
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error("Erro ao buscar estatísticas do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Atualiza a cada 30 segundos
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ paddingBottom: '40px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Dashboard</h1>
          <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>Resumo operacional e comercial em tempo real</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '0.85rem' }}>
            <Calendar size={16} />
            <span>Hoje: {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
          </button>
        </div>
      </header>

      {/* GRID PRINCIPAL DE MÉTRICAS */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gridAutoRows: 'minmax(160px, auto)',
        gap: '20px',
        marginBottom: '20px'
      }}>
        
        {/* CARD MENSAGENS RECEBIDAS */}
        <div className="card" style={{ gridRow: 'span 2', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', opacity: 0.4, textTransform: 'uppercase' }}>Mensagens Recebidas</span>
            <div style={{ color: accentColor, fontWeight: 'bold' }}>{stats.totalMessages} <small style={{ opacity: 0.5 }}>hoje</small></div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
            {[
              { label: 'Instagram', icon: <Instagram size={16} color="#E1306C" />, value: 0 },
              { label: 'Messenger', icon: <Facebook size={16} color="#0084FF" />, value: 0 },
              { label: 'WhatsApp API', icon: <MessageCircle size={16} color="#25D366" />, value: 0 },
              { label: 'Outros', icon: <MessageSquare size={16} color="#94A3B8" />, value: 0 },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {item.icon}
                  <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>{item.label}</span>
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CARD CONVERSAS ATUAIS */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', opacity: 0.4, textTransform: 'uppercase' }}>Conversas Atuais</span>
          <div style={{ fontSize: '2.4rem', fontWeight: '900', color: accentColor }}>{stats.totalLeads}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>0 hoje</span>
            <TrendingUp size={16} color="#39FF14" />
          </div>
        </div>

        {/* CARD CHATS SEM RESPOSTA */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '4px solid #FF4D4D' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', opacity: 0.4, textTransform: 'uppercase' }}>Chats sem Resposta</span>
          <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#FF4D4D' }}>0</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>Ação imediata necessária</span>
            <AlertCircle size={16} color="#FF4D4D" />
          </div>
        </div>


        {/* CARD TEMPO DE RESPOSTA */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', opacity: 0.4, textTransform: 'uppercase' }}>Tempo de Resposta</span>
          <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#F8F9FA' }}>0 min</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>Média hoje</span>
            <Clock size={16} opacity={0.5} />
          </div>
        </div>

        {/* CARD MAIS TEMPO ESPERANDO */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', opacity: 0.4, textTransform: 'uppercase' }}>Mais tempo esperando</span>
          <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#F8F9FA' }}>0h</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>Lead: João Silva</span>
            <MoreVertical size={16} opacity={0.3} />
          </div>
        </div>

        {/* NOVO: CARD PRODUTOS VENDIDOS */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '4px solid var(--color-accent-green)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', opacity: 0.4, textTransform: 'uppercase' }}>Produtos Vendidos</span>
          <div style={{ fontSize: '2.4rem', fontWeight: '900', color: 'var(--color-accent-green)' }}>0</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>+12% vs mês anterior</span>
            <ShoppingBag size={16} color="var(--color-accent-green)" />
          </div>
        </div>

      </div>

      {/* SEGUNDA LINHA: ESTATÍSTICAS E AGENDAMENTOS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr', gap: '20px' }}>
        
        {/* LEADS E STATUS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="card" style={{ padding: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#39FF14' }}></div>
              <span style={{ fontSize: '0.7rem', opacity: 0.6, fontWeight: '800' }}>LEADS GANHOS</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>{stats.leadsGanhos}</div>
            <div style={{ fontSize: '0.8rem', color: '#39FF14' }}>R$ 12.400</div>
          </div>
          <div className="card" style={{ padding: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: accentColor }}></div>
              <span style={{ fontSize: '0.7rem', opacity: 0.6, fontWeight: '800' }}>LEADS ATIVOS</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>{stats.leadsAtivos}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>R$ 450.000</div>
          </div>
          <div className="card" style={{ padding: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF4D4D' }}></div>
              <span style={{ fontSize: '0.7rem', opacity: 0.6, fontWeight: '800' }}>LEADS PERDIDOS</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>{stats.leadsPerdidos}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>R$ 1.200</div>
          </div>
          <div className="card" style={{ padding: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94A3B8' }}></div>
              <span style={{ fontSize: '0.7rem', opacity: 0.6, fontWeight: '800' }}>SEM TAREFAS</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>1.503</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>Atenção imediata</div>
          </div>
        </div>

        {/* AGENDAMENTOS MÊS */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', opacity: 0.4 }}>AGENDAMENTOS</span>
            <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>Mês</span>
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#F8F9FA', marginBottom: '15px' }}>0</div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(57, 255, 20, 0.05)', padding: '10px', borderRadius: '8px' }}>
            <Calendar size={18} color="#39FF14" />
            <span style={{ fontSize: '0.8rem' }}>0 agendamentos pendentes este mês.</span>
          </div>
        </div>

        {/* GRÁFICO BARRA (PROCESSADAS) */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', opacity: 0.4, marginBottom: '15px' }}>TOTAL DE CONVERSAS</span>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 10 }} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ background: '#0B132B', border: 'none', borderRadius: '8px', fontSize: '10px' }}
                />
                <Bar dataKey="value" fill={accentColor} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.7rem', opacity: 0.5 }}>Processamento via IA (WhatsApp)</div>
        </div>

      </div>

      {/* FUNIL DE VENDAS FOOTER */}
      <div className="card" style={{ marginTop: '20px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Filter size={18} color={accentColor} />
            <span style={{ fontWeight: '800', fontSize: '0.9rem' }}>Funil de Vendas Detalhado</span>
          </div>
          <select style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.8rem', opacity: 0.5 }}>
            <option>Pipeline Geral</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: '4px' }}>
          {[
            { label: 'Novo Lead', val: 0, color: 'rgba(0, 245, 255, 0.4)' },
            { label: 'Em Qualificação', val: 0, color: 'rgba(0, 245, 255, 0.3)' },
            { label: 'Proposta Enviada', val: 0, color: 'rgba(0, 245, 255, 0.2)' },
            { label: 'Negociação', val: 0, color: 'rgba(0, 245, 255, 0.15)' },
            { label: 'Fechamento', val: 0, color: 'rgba(57, 255, 20, 0.2)' },
          ].map((step, i) => (
            <div key={i} style={{ flex: 1, background: step.color, padding: '15px', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: '900' }}>{step.val}</div>
              <div style={{ fontSize: '0.65rem', opacity: 0.7, textTransform: 'uppercase' }}>{step.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
