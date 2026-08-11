import React, { useContext, useState, useEffect } from 'react';
import { 
  Download, Plus, Wallet, Share2, Settings, HelpCircle, 
  ArrowUpRight, Info, TrendingUp, Users, Calendar, ChevronDown
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { SettingsContext } from '../context/SettingsContext';

const ROIReport = () => {
    const { settings } = useContext(SettingsContext);
    const accentColor = settings?.primary_color || '#00F5FF';

    // Estado do Período Selecionado
    const [selectedMonth, setSelectedMonth] = useState('Junho');
    const [showFilter, setShowFilter] = useState(false);

    // Dados de Evolução Mensal (Base de Dados Histórica)
    const database = {
        'Janeiro': { roi: 120, invest: 2000, sales: 4400, diff: '+5%' },
        'Fevereiro': { roi: 155, invest: 2500, sales: 6375, diff: '+12%' },
        'Março': { roi: 190, invest: 3000, sales: 8700, diff: '+15%' },
        'Abril': { roi: 240, invest: 3500, sales: 11900, diff: '+18%' },
        'Maio': { roi: 310, invest: 4200, sales: 17220, diff: '+20%' },
        'Junho': { roi: 376, invest: 5500, sales: 26200, diff: '+24%' },
    };

    // Dados da Tabela por Canal (Simulando variação por mês)
    const [tableData, setTableData] = useState([
        { name: 'Meta Ads', color: '#1877F2', invest: 1500, sales: 8500, status: 'Excelente' },
        { name: 'Google Ads', color: '#4285F4', invest: 2000, sales: 12000, status: 'Excelente' },
        { name: 'LinkedIn Ads', color: '#0A66C2', invest: 1200, sales: 4200, status: 'Estável' },
        { name: 'TikTok Ads', color: '#00F5FF', invest: 800, sales: 1500, status: 'Atenção' },
        { name: 'Instagram', color: '#E1306C', invest: 0, sales: 0, status: 'Atenção' },
        { name: 'Facebook', color: '#1877F2', invest: 0, sales: 0, status: 'Atenção' },
        { name: 'TikTok', color: '#000000', invest: 0, sales: 0, status: 'Atenção' },
        { name: 'LinkedIn Pages', color: '#0A66C2', invest: 0, sales: 0, status: 'Atenção' },
        { name: 'LinkedIn Pessoal', color: '#0A66C2', invest: 0, sales: 0, status: 'Atenção' },
        { name: 'YouTube', color: '#FF0000', invest: 0, sales: 0, status: 'Atenção' },
        { name: 'Google Meu Negócio', color: '#4285F4', invest: 0, sales: 0, status: 'Atenção' },
        { name: 'Google Analytics 4', color: '#F4B400', invest: 0, sales: 0, status: 'Atenção' },
        { name: 'Threads', color: '#000000', invest: 0, sales: 0, status: 'Atenção' },
        { name: 'Pinterest', color: '#E60023', invest: 0, sales: 0, status: 'Atenção' },
        { name: 'X', color: '#000000', invest: 0, sales: 0, status: 'Atenção' },
        { name: 'WhatsApp Oficial (Cloud API)', color: '#25D366', invest: 0, sales: 0, status: 'Atenção' },
        { name: 'WhatsApp Evolution API', color: '#128C7E', invest: 0, sales: 0, status: 'Atenção' },
    ]);

    // Atualiza os cards e gráfico quando o mês muda
    const currentStats = database[selectedMonth];

    const handleUpdate = (index, field, value) => {
        const newData = [...tableData];
        newData[index][field] = parseFloat(value) || 0;
        
        const roi = ((newData[index].sales - newData[index].invest) / newData[index].invest) * 100;
        if (roi > 200) newData[index].status = 'Excelente';
        else if (roi > 50) newData[index].status = 'Estável';
        else newData[index].status = 'Atenção';

        setTableData(newData);
    };

    const totalInvest = tableData.reduce((acc, curr) => acc + curr.invest, 0);
    const totalSales = tableData.reduce((acc, curr) => acc + curr.sales, 0);
    const totalROI = totalInvest > 0 ? ((totalSales - totalInvest) / totalInvest) * 100 : 0;

    const infoCards = [
        { 
            title: 'Investimento Mensal', 
            val: `R$ ${currentStats.invest.toLocaleString()}`,
            desc: `Total alocado em ${selectedMonth}.`, 
            icon: <Wallet size={20} color="#39FF14" />,
            bgColor: 'rgba(57, 255, 20, 0.1)'
        },
        { 
            title: 'ROI Consolidado', 
            val: `${currentStats.roi}%`,
            desc: `Retorno médio do período.`, 
            icon: <TrendingUp size={20} color="#FFD700" />,
            bgColor: 'rgba(255, 215, 0, 0.1)'
        },
        { 
            title: 'Faturamento Real', 
            val: `R$ ${currentStats.sales.toLocaleString()}`,
            desc: `Receita bruta gerada.`, 
            icon: <ArrowUpRight size={20} color="#00F5FF" />,
            bgColor: 'rgba(0, 245, 255, 0.1)'
        }
    ];

    const monthlyHistory = Object.keys(database).map(m => ({
        month: m.substring(0, 3),
        roi: database[m].roi,
        active: m === selectedMonth
    }));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {/* CABEÇALHO */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.02em' }}>ROI (Retorno sobre Investimento)</h1>
                    <p style={{ opacity: 0.5, fontSize: '0.85rem' }}>Análise estratégica de performance e rentabilidade mensal.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', position: 'relative' }}>
                    <button 
                        className="btn-primary" 
                        onClick={() => setShowFilter(!showFilter)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '0.8rem' }}
                    >
                        <Calendar size={16} /> 
                        <span>Mês: {selectedMonth}</span>
                        <ChevronDown size={14} />
                    </button>

                    {showFilter && (
                        <div style={{ 
                            position: 'absolute', top: '50px', right: 0, background: '#0B132B', 
                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', 
                            padding: '10px', zIndex: 100, boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
                            minWidth: '150px'
                        }}>
                            {Object.keys(database).map(m => (
                                <button 
                                    key={m}
                                    onClick={() => { setSelectedMonth(m); setShowFilter(false); }}
                                    style={{ 
                                        width: '100%', padding: '10px', textAlign: 'left', background: selectedMonth === m ? 'rgba(255,255,255,0.05)' : 'transparent',
                                        border: 'none', color: selectedMonth === m ? accentColor : '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem'
                                    }}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            {/* SEÇÃO DE EVOLUÇÃO MENSAL (GRÁFICO) */}
            <section className="card" style={{ padding: '25px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <TrendingUp size={20} color={accentColor} /> Evolução de ROI (%)
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
                                    axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} 
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
                        <small style={{ opacity: 0.5, fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: '800' }}>Mês Selecionado ({selectedMonth})</small>
                        <div style={{ fontSize: '2rem', fontWeight: '900', color: '#39FF14', margin: '5px 0' }}>{currentStats.roi}%</div>
                        <div style={{ fontSize: '0.8rem', color: '#39FF14', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <ArrowUpRight size={14} /> {currentStats.diff} vs mês anterior
                        </div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <small style={{ opacity: 0.5, fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: '800' }}>Investimento em {selectedMonth}</small>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', margin: '5px 0' }}>R$ {currentStats.invest.toLocaleString()}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>Receita: R$ {currentStats.sales.toLocaleString()}</div>
                    </div>
                </div>
            </section>

            {/* CARDS DE INFORMAÇÃO DINÂMICOS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {infoCards.map((card, i) => (
                    <div key={i} className="card" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                            <div style={{ background: card.bgColor, padding: '12px', borderRadius: '12px' }}>
                                {card.icon}
                            </div>
                            <div>
                                <div style={{ fontSize: '0.7rem', opacity: 0.4, fontWeight: '800', textTransform: 'uppercase' }}>{card.title}</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#fff', margin: '2px 0' }}>{card.val}</div>
                                <div style={{ fontSize: '0.75rem', opacity: 0.5, lineHeight: '1.4' }}>{card.desc}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* TABELA DE INVESTIMENTO */}
            <section className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '20px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>Detalhamento por Canal ({selectedMonth})</h3>
                        <p style={{ fontSize: '0.75rem', opacity: 0.4, marginTop: '5px' }}>Simule e acompanhe o ROI em tempo real editando os valores.</p>
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
                        {tableData.map((item, i) => {
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
                </table>
            </section>
        </div>
    );
};

export default ROIReport;
