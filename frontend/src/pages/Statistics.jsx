import React, { useContext } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { TrendingUp, Users, Target, Zap, Share2, MousePointer2 } from 'lucide-react';
import { SettingsContext } from '../context/SettingsContext';

const growthData = [
  { name: 'Jan', leads: 400, conv: 240 },
  { name: 'Fev', leads: 300, conv: 139 },
  { name: 'Mar', leads: 800, conv: 480 },
  { name: 'Abr', leads: 600, conv: 390 },
  { name: 'Mai', leads: 700, conv: 480 },
  { name: 'Jun', leads: 900, conv: 590 },
];

const distributionData = [
  { name: 'Instagram', value: 45, color: '#E1306C' },
  { name: 'Facebook', value: 25, color: '#1877F2' },
  { name: 'WhatsApp', value: 20, color: '#25D366' },
  { name: 'YouTube', value: 10, color: '#FF0000' },
];

const Statistics = () => {
  const { settings } = useContext(SettingsContext);
  const accentColor = settings?.primary_color || '#00F5FF';

  return (
    <div style={{ paddingBottom: '40px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Estatísticas Detalhadas</h1>
          <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>Análise profunda de crescimento e conversão</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>MÊS DE REFERÊNCIA: </span>
            <strong style={{ fontSize: '0.9rem', color: 'var(--color-accent-cyan)' }}>MARÇO 2026</strong>
        </div>
      </header>

      {/* KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        {[
          { label: 'Taxa de Conversão', val: '12.4%', icon: <Target size={20} color="#39FF14" />, growth: '+2.1%' },
          { label: 'CTR Médio', val: '4.8%', icon: <MousePointer2 size={20} color={accentColor} />, growth: '+0.5%' },
          { label: 'Leads Qualificados', val: '1.240', icon: <Users size={20} color="#FFD700" />, growth: '+15%' },
          { label: 'Tempo de Resposta AI', val: '1.2s', icon: <Zap size={20} color="#BB86FC" />, growth: '-0.3s' },
        ].map((kpi, i) => (
          <div key={i} className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px' }}>{kpi.icon}</div>
              <span style={{ fontSize: '0.75rem', color: '#39FF14', fontWeight: '800' }}>{kpi.growth}</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900' }}>{kpi.val}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '20px' }}>
        {/* GRÁFICO DE CRESCIMENTO */}
        <div className="card" style={{ padding: '25px', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>Crescimento de Leads vs Conversão</h3>
            <div style={{ display: 'flex', gap: '15px', fontSize: '0.75rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: accentColor }}></div> Leads</div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#39FF14' }}></div> Conversões</div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={accentColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={accentColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#0B132B', border: 'none', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="leads" stroke={accentColor} fillOpacity={1} fill="url(#colorLeads)" strokeWidth={3} />
                <Area type="monotone" dataKey="conv" stroke="#39FF14" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DISTRIBUIÇÃO POR CANAL */}
        <div className="card" style={{ padding: '25px', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '20px' }}>Origem por Rede Social</h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
