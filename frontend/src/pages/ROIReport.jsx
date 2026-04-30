import React, { useContext, useState } from 'react';
import { 
  Download, Plus, Wallet, Share2, Settings, HelpCircle, 
  ArrowUpRight, Info, TrendingUp, Users, Calendar
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { SettingsContext } from '../context/SettingsContext';

const ROIReport = () => {
    const { settings } = useContext(SettingsContext);
    const accentColor = settings?.primary_color || '#00F5FF';

    // Dados de Evolução Mensal (Histórico)
    const monthlyHistory = [
        { month: 'Jan', roi: 120, invest: 2000, sales: 4400 },
        { month: 'Fev', roi: 155, invest: 2500, sales: 6375 },
        { month: 'Mar', roi: 190, invest: 3000, sales: 8700 },
        { month: 'Abr', roi: 240, invest: 3500, sales: 11900 },
        { month: 'Mai', roi: 310, invest: 4200, sales: 17220 },
        { month: 'Jun', roi: 376, invest: 5500, sales: 26200 },
    ];

    const [data, setData] = useState([
        { name: 'Instagram Ads', color: '#E1306C', invest: 1500, sales: 8500, status: 'Excelente' },
        { name: 'Facebook Ads', color: '#1877F2', invest: 1200, sales: 4200, status: 'Estável' },
        { name: 'Google Ads', color: '#4285F4', invest: 2000, sales: 12000, status: 'Excelente' },
        { name: 'TikTok Ads', color: '#00F5FF', invest: 800, sales: 1500, status: 'Atenção' },
    ]);

    const handleUpdate = (index, field, value) => {
        const newData = [...data];
        newData[index][field] = parseFloat(value) || 0;
        
        const roi = ((newData[index].sales - newData[index].invest) / newData[index].invest) * 100;
        if (roi > 200) newData[index].status = 'Excelente';
        else if (roi > 50) newData[index].status = 'Estável';
        else newData[index].status = 'Atenção';

        setData(newData);
    };

    const totalInvest = data.reduce((acc, curr) => acc + curr.invest, 0);
    const totalSales = data.reduce((acc, curr) => acc + curr.sales, 0);
    const totalROI = totalInvest > 0 ? ((totalSales - totalInvest) / totalInvest) * 100 : 0;

    const infoCards = [
        { 
            title: 'Investimento Mensal', 
            desc: 'Total alocado em canais de tração no mês vigente.', 
            icon: <Wallet size={20} color="#39FF14" />,
            bgColor: 'rgba(57, 255, 20, 0.1)'
        },
        { 
            title: 'Custo por Lead (CPL)', 
            desc: 'Média de custo para aquisição de cada novo prospect.', 
            icon: <Users size={20} color="#00F5FF" />,
            bgColor: 'rgba(0, 245, 255, 0.1)'
        },
        { 
            title: 'Retorno Líquido', 
            desc: 'Margem de lucro real após dedução de investimentos.', 
            icon: <TrendingUp size={20} color="#FFD700" />,
            bgColor: 'rgba(255, 215, 0, 0.1)'
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {/* CABEÇALHO */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.02em' }}>ROI (Retorno sobre Investimento)</h1>
                    <p style={{ opacity: 0.5, fontSize: '0.85rem' }}>Análise estratégica de performance e rentabilidade mensal.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '10px', cursor: 'pointer' }}>
                        <Download size={16} /> EXPORTAR RELATÓRIO
                    </button>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '0.8rem' }}>
                        <Calendar size={16} /> FILTRAR PERÍODO
                    </button>
                </div>
            </header>

            {/* SEÇÃO DE EVOLUÇÃO MENSAL (GRÁFICO) */}
            <section className="card" style={{ padding: '25px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <TrendingUp size={20} color={accentColor} /> Evolução de ROI Mensal (%)
                    </h3>
                    <div style={{ height: '250px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyHistory}>
                                <defs>
                                    <linearGradient id="colorRoi" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={accentColor} stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor={accentColor} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94A3B8', fontSize: 10}} 
                                    label={{ value: 'ROI (%)', angle: -90, position: 'insideLeft', fill: accentColor, fontSize: 10, fontWeight: 'bold' }}
                                />
                                <Tooltip 
                                    contentStyle={{ background: '#0B132B', border: 'none', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                                    itemStyle={{ color: accentColor, fontWeight: 'bold' }}
                                    formatter={(value) => [`${value}%`, 'ROI']}
                                />
                                <Area type="monotone" dataKey="roi" stroke={accentColor} strokeWidth={3} fillOpacity={1} fill="url(#colorRoi)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', justifyContent: 'center' }}>
                    <div style={{ background: 'rgba(57, 255, 20, 0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(57, 255, 20, 0.1)' }}>
                        <small style={{ opacity: 0.5, fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: '800' }}>Mês Atual (Junho)</small>
                        <div style={{ fontSize: '2rem', fontWeight: '900', color: '#39FF14', margin: '5px 0' }}>{totalROI.toFixed(0)}%</div>
                        <div style={{ fontSize: '0.8rem', color: '#39FF14', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <ArrowUpRight size={14} /> +24% que Maio
                        </div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <small style={{ opacity: 0.5, fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: '800' }}>Investimento Acumulado</small>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', margin: '5px 0' }}>R$ {totalInvest.toLocaleString()}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>Projeção: R$ 7.200 até fim do mês</div>
                    </div>
                </div>
            </section>

            {/* CARDS DE INFORMAÇÃO */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {infoCards.map((card, i) => (
                    <div key={i} className="card" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                            <div style={{ background: card.bgColor, padding: '12px', borderRadius: '12px' }}>
                                {card.icon}
                            </div>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '4px' }}>{card.title}</div>
                                <div style={{ fontSize: '0.75rem', opacity: 0.5, lineHeight: '1.4' }}>{card.desc}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* TABELA DE INVESTIMENTO POR REDE SOCIAL */}
            <section className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '20px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>Detalhamento por Canal de Aquisição</h3>
                        <p style={{ fontSize: '0.75rem', opacity: 0.4, marginTop: '5px' }}>Simule e acompanhe o ROI em tempo real editando os valores de investimento e receita.</p>
                    </div>
                </div>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <th style={{ padding: '15px 25px', opacity: 0.4 }}>REDE SOCIAL</th>
                            <th style={{ padding: '15px 10px', opacity: 0.4 }}>INVESTIMENTO (R$)</th>
                            <th style={{ padding: '15px 10px', opacity: 0.4 }}>RECEITA (R$)</th>
                            <th style={{ padding: '15px 10px', opacity: 0.4 }}>ROI (%)</th>
                            <th style={{ padding: '15px 25px', opacity: 0.4 }}>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, i) => {
                            const roi = item.invest > 0 ? ((item.sales - item.invest) / item.invest) * 100 : 0;
                            return (
                                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: '0.2s' }}>
                                    <td style={{ padding: '18px 25px', fontWeight: '700' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color, boxShadow: `0 0 10px ${item.color}40` }}></div>
                                            {item.name}
                                        </div>
                                    </td>
                                    <td style={{ padding: '18px 10px' }}>
                                        <input 
                                            type="number"
                                            value={item.invest}
                                            onChange={(e) => handleUpdate(i, 'invest', e.target.value)}
                                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: '6px', padding: '8px 12px', width: '110px', fontSize: '0.85rem' }}
                                        />
                                    </td>
                                    <td style={{ padding: '18px 10px' }}>
                                        <input 
                                            type="number"
                                            value={item.sales}
                                            onChange={(e) => handleUpdate(i, 'sales', e.target.value)}
                                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-accent-green)', borderRadius: '6px', padding: '8px 12px', width: '110px', fontSize: '0.85rem', fontWeight: 'bold' }}
                                        />
                                    </td>
                                    <td style={{ padding: '18px 10px', fontSize: '1rem', fontWeight: '800', color: roi > 100 ? 'var(--color-accent-cyan)' : '#fff' }}>
                                        {roi.toFixed(0)}%
                                    </td>
                                    <td style={{ padding: '18px 25px' }}>
                                        <span style={{ 
                                            background: item.status === 'Excelente' ? 'rgba(57, 255, 20, 0.1)' : item.status === 'Estável' ? 'rgba(0, 245, 255, 0.1)' : 'rgba(255, 77, 77, 0.1)',
                                            color: item.status === 'Excelente' ? '#39FF14' : item.status === 'Estável' ? '#00F5FF' : '#FF4D4D',
                                            padding: '5px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase'
                                        }}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', fontWeight: 'bold' }}>
                            <td style={{ padding: '20px 25px', fontSize: '0.9rem' }}>TOTAL CONSOLIDADO</td>
                            <td style={{ padding: '20px 10px', fontSize: '1rem' }}>R$ {totalInvest.toLocaleString()}</td>
                            <td style={{ padding: '20px 10px', color: 'var(--color-accent-green)', fontSize: '1.1rem' }}>R$ {totalSales.toLocaleString()}</td>
                            <td style={{ padding: '20px 10px', color: 'var(--color-accent-cyan)', fontSize: '1.2rem' }}>{totalROI.toFixed(0)}%</td>
                            <td style={{ padding: '20px 25px' }}>-</td>
                        </tr>
                    </tfoot>
                </table>
            </section>
        </div>
    );
};

export default ROIReport;
