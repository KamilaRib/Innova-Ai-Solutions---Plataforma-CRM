import React, { useContext } from 'react';
import { 
  Download, Plus, Wallet, Share2, Settings, HelpCircle, 
  ArrowUpRight, Info, TrendingUp, Users
} from 'lucide-react';
import { SettingsContext } from '../context/SettingsContext';

const ROIReport = () => {
    const { settings } = useContext(SettingsContext);
    const accentColor = settings?.primary_color || '#00F5FF';

    const [data, setData] = React.useState([
        { name: 'Instagram Ads', color: '#E1306C', invest: 1500, sales: 8500, status: 'Excelente' },
        { name: 'Facebook Ads', color: '#1877F2', invest: 1200, sales: 4200, status: 'Estável' },
        { name: 'Google Ads', color: '#4285F4', invest: 2000, sales: 12000, status: 'Excelente' },
        { name: 'TikTok Ads', color: '#00F5FF', invest: 800, sales: 1500, status: 'Atenção' },
    ]);

    const handleUpdate = (index, field, value) => {
        const newData = [...data];
        newData[index][field] = parseFloat(value) || 0;
        
        // Atualiza status baseado no novo ROI
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
            title: 'Custo Total (Fixo)', 
            desc: 'Valores fixos somados (ex: R$ 500 em anúncios).', 
            icon: <Wallet size={20} color="#39FF14" />,
            bgColor: 'rgba(57, 255, 20, 0.1)'
        },
        { 
            title: 'Custo Unitário (por Lead)', 
            desc: 'Custo por lead x número de leads (ex: 50 leads x R$ 5 = R$ 250).', 
            icon: <Users size={20} color="#00F5FF" />,
            bgColor: 'rgba(0, 245, 255, 0.1)'
        },
        { 
            title: 'Fórmula Lucro Real', 
            desc: 'ROI = (Receita – Investimento) / Investimento × 100%.', 
            icon: <TrendingUp size={20} color="#FFD700" />,
            bgColor: 'rgba(255, 215, 0, 0.1)'
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* CABEÇALHO */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: '800' }}>ROI (Retorno sobre Investimento)</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '6px' }}>
                        <Download size={14} /> EXPORTAR CSV
                    </button>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px', fontSize: '0.75rem' }}>
                        <Plus size={14} /> NOVO RELATÓRIO
                    </button>
                </div>
            </header>

            {/* SEÇÃO "COMO USAR" */}
            <section className="card" style={{ padding: '25px', background: 'rgba(255,255,255,0.02)' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '20px', opacity: 0.8 }}>Como você pode usar o ROI?</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                    {infoCards.map((card, i) => (
                        <div key={i} style={{ 
                            padding: '15px', 
                            borderRadius: '10px', 
                            border: '1px solid rgba(255,255,255,0.05)',
                            background: 'rgba(0,0,0,0.2)'
                        }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <div style={{ background: card.bgColor, padding: '10px', borderRadius: '8px' }}>
                                    {card.icon}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '4px' }}>{card.title}</div>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.5, lineHeight: '1.4' }}>{card.desc}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ 
                    marginTop: '20px', 
                    padding: '12px 15px', 
                    background: 'rgba(24, 119, 242, 0.1)', 
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid rgba(24, 119, 242, 0.2)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem' }}>
                        <Info size={16} color="#1877F2" />
                        <span>Aprenda como tirar o máximo proveito dos relatórios de ROI.</span>
                    </div>
                    <a href="#" style={{ color: '#1877F2', fontSize: '0.8rem', fontWeight: 'bold', textDecoration: 'none' }}>Leia o nosso guia</a>
                </div>
            </section>

            {/* TABELA DE INVESTIMENTO POR REDE SOCIAL */}
            <section className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '20px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>Investimento por Canal</h3>
                        <p style={{ fontSize: '0.75rem', opacity: 0.4, marginTop: '5px' }}>Você pode editar os valores abaixo para simular seu retorno em tempo real.</p>
                    </div>
                </div>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
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
                                    <td style={{ padding: '15px 25px', fontWeight: '700' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }}></div>
                                            {item.name}
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px 10px' }}>
                                        <input 
                                            type="number"
                                            value={item.invest}
                                            onChange={(e) => handleUpdate(i, 'invest', e.target.value)}
                                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px', padding: '5px 8px', width: '100px', fontSize: '0.8rem' }}
                                        />
                                    </td>
                                    <td style={{ padding: '15px 10px' }}>
                                        <input 
                                            type="number"
                                            value={item.sales}
                                            onChange={(e) => handleUpdate(i, 'sales', e.target.value)}
                                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-accent-green)', borderRadius: '4px', padding: '5px 8px', width: '100px', fontSize: '0.8rem', fontWeight: 'bold' }}
                                        />
                                    </td>
                                    <td style={{ padding: '15px 10px', color: roi > 100 ? 'var(--color-accent-cyan)' : '#fff' }}>
                                        {roi.toFixed(0)}%
                                    </td>
                                    <td style={{ padding: '15px 25px' }}>
                                        <span style={{ 
                                            background: item.status === 'Excelente' ? 'rgba(57, 255, 20, 0.1)' : item.status === 'Estável' ? 'rgba(0, 245, 255, 0.1)' : 'rgba(255, 77, 77, 0.1)',
                                            color: item.status === 'Excelente' ? '#39FF14' : item.status === 'Estável' ? '#00F5FF' : '#FF4D4D',
                                            padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold'
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
                            <td style={{ padding: '15px 25px' }}>TOTAL CONSOLIDADO</td>
                            <td style={{ padding: '15px 10px' }}>R$ {totalInvest.toLocaleString()}</td>
                            <td style={{ padding: '15px 10px', color: 'var(--color-accent-green)' }}>R$ {totalSales.toLocaleString()}</td>
                            <td style={{ padding: '15px 10px', color: 'var(--color-accent-cyan)' }}>{totalROI.toFixed(0)}%</td>
                            <td style={{ padding: '15px 25px' }}>-</td>
                        </tr>
                    </tfoot>
                </table>
            </section>
        </div>
    );
};

export default ROIReport;
