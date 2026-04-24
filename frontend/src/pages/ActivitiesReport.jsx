import React, { useContext } from 'react';
import { Download, Plus, Search, Filter } from 'lucide-react';
import { SettingsContext } from '../context/SettingsContext';

const ActivitiesReport = () => {
    const { settings } = useContext(SettingsContext);
    const accentColor = settings?.primary_color || '#00F5FF';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Relatório por atividades</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '6px' }}>
                        <Download size={14} /> EXPORTAR CSV
                    </button>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px', fontSize: '0.75rem' }}>
                        <Plus size={14} /> ADICIONAR FILTRO
                    </button>
                </div>
            </header>

            <div className="card" style={{ padding: '30px', textAlign: 'center', opacity: 0.5, minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '50%', marginBottom: '20px' }}>
                    <Search size={40} opacity={0.3} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '10px' }}>Nenhuma atividade encontrada</h3>
                <p style={{ fontSize: '0.9rem', maxWidth: '400px' }}>Não foram encontradas atividades para os filtros selecionados. Tente ajustar o período ou os critérios de busca.</p>
            </div>
        </div>
    );
};

export default ActivitiesReport;
