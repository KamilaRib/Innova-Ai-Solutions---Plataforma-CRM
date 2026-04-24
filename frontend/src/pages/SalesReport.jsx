import React, { useContext } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell
} from 'recharts';
import { ShoppingBag, CreditCard, Users, TrendingUp } from 'lucide-react';
import { SettingsContext } from '../context/SettingsContext';

const salesData = [
  { name: 'Redes Sociais', value: 45000, color: '#00F5FF' },
  { name: 'WhatsApp', value: 32000, color: '#39FF14' },
  { name: 'Indicação', value: 18000, color: '#FFD700' },
  { name: 'Google', value: 12000, color: '#BB86FC' },
];

const SalesReport = () => {
    const { settings } = useContext(SettingsContext);
    const accentColor = settings?.primary_color || '#00F5FF';

    return (
        <div>
            <header style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Relatório de Vendas</h1>
                <p style={{ opacity: 0.5 }}>Visão detalhada de faturamento e performance comercial</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                {[
                  { label: 'Vendas Totais', val: 'R$ 107.000', icon: <ShoppingBag size={20} />, color: accentColor },
                  { label: 'Ticket Médio', val: 'R$ 2.547', icon: <CreditCard size={20} />, color: '#39FF14' },
                  { label: 'Novos Clientes', val: '42', icon: <Users size={20} />, color: '#FFD700' },
                  { label: 'Crescimento', val: '+24%', icon: <TrendingUp size={20} />, color: '#BB86FC' },
                ].map((kpi, i) => (
                  <div key={i} className="card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                      <div style={{ color: kpi.color, background: `${kpi.color}15`, padding: '8px', borderRadius: '8px' }}>{kpi.icon}</div>
                      <span style={{ fontSize: '0.8rem', opacity: 0.6, fontWeight: '700' }}>{kpi.label}</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>{kpi.val}</div>
                  </div>
                ))}
            </div>

            <div className="card" style={{ padding: '30px', height: '400px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '25px' }}>Faturamento por Canal de Origem</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData} layout="vertical" margin={{ left: 50 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis type="number" axisLine={false} tickLine={false} tick={{fill:'#94A3B8'}} />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill:'#94A3B8'}} />
                        <Tooltip contentStyle={{ background: '#0B132B', border: 'none', borderRadius: '12px' }} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {salesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SalesReport;
