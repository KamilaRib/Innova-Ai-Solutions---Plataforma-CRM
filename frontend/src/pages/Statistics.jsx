import React, { useContext, useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { TrendingUp, Users, Target, Zap, Share2, MousePointer2, ChevronDown, Calendar } from 'lucide-react';
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

  // Estado do Mês Selecionado
  const [selectedMonth, setSelectedMonth] = useState('Junho');
  const [showFilter, setShowFilter] = useState(false);

  // Banco de Dados de KPIs (Simulado)
  const database = {
      'Janeiro': { conv: '8.4%', ctr: '3.2%', leads: '840', response: '2.1s', g1: '+1.2%', g2: '+0.2%', g3: '+8%', g4: '-0.1s' },
      'Fevereiro': { conv: '9.2%', ctr: '3.5%', leads: '920', response: '1.8s', g1: '+0.8%', g2: '+0.3%', g3: '+10%', g4: '-0.3s' },
      'Março': { conv: '10.5%', ctr: '4.1%', leads: '1.050', response: '1.5s', g1: '+1.3%', g2: '+0.6%', g3: '+12%', g4: '-0.3s' },
      'Abril': { conv: '11.1%', ctr: '4.4%', leads: '1.120', response: '1.4s', g1: '+0.6%', g2: '+0.3%', g3: '+8%', g4: '-0.1s' },
      'Maio': { conv: '11.8%', ctr: '4.6%', leads: '1.180', response: '1.3s', g1: '+0.7%', g2: '+0.2%', g3: '+6%', g4: '-0.1s' },
      'Junho': { conv: '12.4%', ctr: '4.8%', leads: '1.240', response: '1.2s', g1: '+2.1%', g2: '+0.5%', g3: '+15%', g4: '-0.3s' },
  };

  const months = Object.keys(database);
  const currentKPIs = database[selectedMonth];

  const kpis = [
      { label: 'Taxa de Conversão', val: currentKPIs.conv, icon: <Target size={20} color="#39FF14" />, growth: currentKPIs.g1 },
      { label: 'CTR Médio', val: currentKPIs.ctr, icon: <MousePointer2 size={20} color={accentColor} />, growth: currentKPIs.g2 },
      { label: 'Leads Qualificados', val: currentKPIs.leads, icon: <Users size={20} color="#FFD700" />, growth: currentKPIs.g3 },
      { label: 'Tempo de Resposta AI', val: currentKPIs.response, icon: <Zap size={20} color="#BB86FC" />, growth: currentKPIs.g4 },
  ];

  return (
    <div style={{ paddingBottom: '40px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Estatísticas Detalhadas</h1>
          <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>Análise profunda de crescimento e conversão</p>
        </div>
        
        <div style={{ position: 'relative' }}>
            <button 
                onClick={() => setShowFilter(!showFilter)}
                style={{ 
                    background: 'rgba(255,255,255,0.05)', padding: '10px 20px', borderRadius: '10px', 
                    border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: '#fff',
                    display: 'flex', alignItems: 'center', gap: '10px'
                }}
            >
                <Calendar size={16} color={accentColor} />
                <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>MÊS DE REFERÊNCIA: </span>
                <strong style={{ fontSize: '0.9rem', color: accentColor }}>{selectedMonth.toUpperCase()} 2026</strong>
                <ChevronDown size={14} />
            </button>

            {showFilter && (
                <div style={{ 
                    position: 'absolute', top: '50px', right: 0, background: '#0B132B', 
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', 
                    padding: '10px', zIndex: 100, boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
                    minWidth: '180px'
                }}>
                    {months.map(m => (
                        <button 
                            key={m}
                            onClick={() => { setSelectedMonth(m); setShowFilter(false); }}
                            style={{ 
                                width: '100%', padding: '10px', textAlign: 'left', background: selectedMonth === m ? 'rgba(255,255,255,0.05)' : 'transparent',
                                border: 'none', color: selectedMonth === m ? accentColor : '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem'
                            }}
                        >
                            {m} 2026
                        </button>
                    ))}
                </div>
            )}
        </div>
      </header>

      {/* KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        {kpis.map((kpi, i) => (
          <div key={i} className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px' }}>{kpi.icon}</div>
              <span style={{ fontSize: '0.75rem', color: kpi.growth.startsWith('+') ? '#39FF14' : '#FF4D4D', fontWeight: '800' }}>{kpi.growth}</span>
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
