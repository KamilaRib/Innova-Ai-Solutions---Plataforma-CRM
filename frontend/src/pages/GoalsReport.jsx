import React, { useContext } from 'react';
import { Target, Flag, CheckCircle2, Trophy } from 'lucide-react';
import { SettingsContext } from '../context/SettingsContext';

const GoalsReport = () => {
    const { settings } = useContext(SettingsContext);
    const accentColor = settings?.primary_color || '#00F5FF';

    const [goals, setGoals] = React.useState([
        { label: 'Novos Leads Mensais', current: 840, target: 1200, color: accentColor },
        { label: 'Conversão de Vendas', current: 42, target: 50, color: '#39FF14' },
        { label: 'Alcance Instagram', current: 45000, target: 50000, color: '#E1306C' },
        { label: 'Ticket Médio (R$)', current: 2800, target: 3000, color: '#FFD700' },
    ]);

    const handleUpdate = (index, field, value) => {
        const newGoals = [...goals];
        newGoals[index][field] = parseFloat(value) || 0;
        setGoals(newGoals);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '5px' }}>Relatório de Metas</h1>
                    <p style={{ opacity: 0.5 }}>Defina seus objetivos e acompanhe o progresso em tempo real.</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>MÊS DE REFERÊNCIA: </span>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--color-accent-cyan)' }}>MARÇO 2026</strong>
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
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '5px' }}>Destaque de Março 2026</h3>
                        <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Suas metas estão <strong>84% concluídas</strong> na média geral. Faltam poucos ajustes para fechar o mês com 100%!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoalsReport;
