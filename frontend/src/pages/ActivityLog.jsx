import React, { useContext } from 'react';
import { Download, Search, List } from 'lucide-react';
import { SettingsContext } from '../context/SettingsContext';

const ActivityLog = () => {
    const { settings } = useContext(SettingsContext);
    
    const logs = [
        { id: 1, date: '27/03/2026 04:20', user: 'Kamila Ribeiro', action: 'Lead Ganho', object: 'Lead #15519511' },
        { id: 2, date: '27/03/2026 04:15', user: 'Sistema IA', action: 'Mensagem Enviada', object: 'Lead #15522451' },
        { id: 3, date: '27/03/2026 03:50', user: 'Kamila Ribeiro', action: 'Tarefa Concluída', object: 'Follow-up comercial' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Registro de atividade</h1>
                <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '6px' }}>
                    <Download size={14} /> EXPORTAR CSV
                </button>
            </header>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <th style={{ padding: '15px 25px', opacity: 0.4 }}>DATA/HORA</th>
                            <th style={{ padding: '15px 10px', opacity: 0.4 }}>USUÁRIO</th>
                            <th style={{ padding: '15px 10px', opacity: 0.4 }}>AÇÃO</th>
                            <th style={{ padding: '15px 10px', opacity: 0.4 }}>OBJETO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                <td style={{ padding: '15px 25px', opacity: 0.6 }}>{log.date}</td>
                                <td style={{ padding: '15px 10px', fontWeight: '700' }}>{log.user}</td>
                                <td style={{ padding: '15px 10px' }}>{log.action}</td>
                                <td style={{ padding: '15px 10px', opacity: 0.6 }}>{log.object}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActivityLog;
