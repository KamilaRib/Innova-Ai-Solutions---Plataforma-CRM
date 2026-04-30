import React, { useContext, useState } from 'react';
import { Target, Flag, CheckCircle2, Trophy, ChevronDown, Calendar } from 'lucide-react';
import { SettingsContext } from '../context/SettingsContext';

const GoalsReport = () => {
    const { settings } = useContext(SettingsContext);
    const accentColor = settings?.primary_color || '#00F5FF';

    // Estado do Mês Selecionado
    const [selectedMonth, setSelectedMonth] = useState('Junho');
    const [showFilter, setShowFilter] = useState(false);

    // Banco de Dados de Metas (Simulado)
    const database = {
        'Janeiro': [
            { label: 'Novos Leads Mensais', current: 600, target: 1000, color: '#00F5FF' },
            { label: 'Conversão de Vendas', current: 25, target: 40, color: '#39FF14' },
            { label: 'Alcance Instagram', current: 30000, target: 40000, color: '#E1306C' },
            { label: 'Ticket Médio (R$)', current: 2100, target: 2500, color: '#FFD700' },
        ],
        'Fevereiro': [
            { label: 'Novos Leads Mensais', current: 750, target: 1100, color: '#00F5FF' },
            { label: 'Conversão de Vendas', current: 30, target: 45, color: '#39FF14' },
            { label: 'Alcance Instagram', current: 35000, target: 45000, color: '#E1306C' },
            { label: 'Ticket Médio (R$)', current: 2400, target: 2800, color: '#FFD700' },
        ],
        'Março': [
            { label: 'Novos Leads Mensais', current: 840, target: 1200, color: '#00F5FF' },
            { label: 'Conversão de Vendas', current: 42, target: 50, color: '#39FF14' },
            { label: 'Alcance Instagram', current: 45000, target: 50000, color: '#E1306C' },
            { label: 'Ticket Médio (R$)', current: 2800, target: 3000, color: '#FFD700' },
        ],
        'Abril': [
            { label: 'Novos Leads Mensais', current: 950, target: 1300, color: '#00F5FF' },
            { label: 'Conversão de Vendas', current: 48, target: 55, color: '#39FF14' },
            { label: 'Alcance Instagram', current: 52000, target: 55000, color: '#E1306C' },
            { label: 'Ticket Médio (R$)', current: 2950, target: 3200, color: '#FFD700' },
        ],
        'Maio': [
            { label: 'Novos Leads Mensais', current: 1100, target: 1400, color: '#00F5FF' },
            { label: 'Conversão de Vendas', current: 52, target: 60, color: '#39FF14' },
            { label: 'Alcance Instagram', current: 61000, target: 65000, color: '#E1306C' },
            { label: 'Ticket Médio (R$)', current: 3100, target: 3400, color: '#FFD700' },
        ],
        'Junho': [
            { label: 'Novos Leads Mensais', current: 1250, target: 1500, color: '#00F5FF' },
            { label: 'Conversão de Vendas', current: 58, target: 65, color: '#39FF14' },
            { label: 'Alcance Instagram', current: 72000, target: 75000, color: '#E1306C' },
            { label: 'Ticket Médio (R$)', current: 3300, target: 3600, color: '#FFD700' },
        ]
    };

    const [goals, setGoals] = useState(database[selectedMonth]);

    // Atualiza metas quando o mês muda
    React.useEffect(() => {
        setGoals(database[selectedMonth]);
    }, [selectedMonth]);

    const handleUpdate = (index, field, value) => {
        const newGoals = [...goals];
        newGoals[index][field] = parseFloat(value) || 0;
        setGoals(newGoals);
    };

    const averageProgress = goals.reduce((acc, curr) => acc + (curr.target > 0 ? (curr.current / curr.target) * 100 : 0), 0) / goals.length;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '5px' }}>Relatório de Metas</h1>
                    <p style={{ opacity: 0.5 }}>Defina seus objetivos e acompanhe o progresso em tempo real.</p>
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
                            {Object.keys(database).map(m => (
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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                {goals.map((goal, i) => {
                    const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
                    return (
                        <div key={i} className="card" style={{ padding: '25px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ background: `${goal.color}15`, padding: '10px', borderRadius: '10px' }}>
                                        <Target size={20} color={goal.color} />
                                    </div>
                                    <span style={{ fontWeight: '700', fontSize: '1rem' }}>{goal.label}</span>
                                </div>
                                <span style={{ fontSize: '1.2rem', fontWeight: '900', color: goal.color }}>{progress.toFixed(1)}%</span>
                            </div>

                            <div style={{ background: 'rgba(255,255,255,0.05)', height: '12px', borderRadius: '6px', overflow: 'hidden', marginBottom: '20px' }}>
                                <div style={{ width: `${progress}%`, height: '100%', background: `linear-gradient(90deg, ${goal.color}88, ${goal.color})`, borderRadius: '6px', transition: '0.5s ease-in-out' }}></div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.7rem', opacity: 0.5, marginBottom: '5px', textTransform: 'uppercase' }}>Valor Atual</label>
                                    <input 
                                        type="number"
                                        value={goal.current}
                                        onChange={(e) => handleUpdate(i, 'current', e.target.value)}
                                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px', borderRadius: '6px', width: '100%', fontSize: '0.9rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.7rem', opacity: 0.5, marginBottom: '5px', textTransform: 'uppercase' }}>Meta Final</label>
                                    <input 
                                        type="number"
                                        value={goal.target}
                                        onChange={(e) => handleUpdate(i, 'target', e.target.value)}
                                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: goal.color, padding: '8px', borderRadius: '6px', width: '100%', fontSize: '0.9rem', fontWeight: 'bold' }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="card" style={{ marginTop: '30px', padding: '30px', background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.05), transparent)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ background: 'rgba(255, 215, 0, 0.1)', padding: '20px', borderRadius: '20px' }}>
                        <Trophy size={40} color="#FFD700" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '5px' }}>Destaque de {selectedMonth} 2026</h3>
                        <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Suas metas estão <strong>{averageProgress.toFixed(0)}% concluídas</strong> na média geral. {averageProgress >= 100 ? 'Parabéns, você atingiu todos os objetivos!' : 'Faltam poucos ajustes para fechar o mês com 100%!'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoalsReport;
