import React, { useContext } from 'react';
import { Download, Phone, PhoneIncoming, PhoneOutgoing, Clock } from 'lucide-react';
import { SettingsContext } from '../context/SettingsContext';

const CallsReport = () => {
    const { settings } = useContext(SettingsContext);
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Relatório de chamada</h1>
                <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '6px' }}>
                    <Download size={14} /> EXPORTAR CSV
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '10px' }}>
                <div className="card" style={{ padding: '20px', background: 'rgba(57, 255, 20, 0.05)', borderLeft: '4px solid #39FF14' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                       <span style={{ fontSize: '0.7rem', fontWeight: '800', opacity: 0.5 }}>CHAMADAS ATENDIDAS</span>
                       <PhoneIncoming size={16} color="#39FF14" />
                   </div>
                   <div style={{ fontSize: '1.8rem', fontWeight: '900', marginTop: '10px' }}>248</div>
                </div>
                <div className="card" style={{ padding: '20px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                       <span style={{ fontSize: '0.7rem', fontWeight: '800', opacity: 0.5 }}>CHAMADAS PERDIDAS</span>
                       <PhoneOutgoing size={16} color="#FF4D4D" />
                   </div>
                   <div style={{ fontSize: '1.8rem', fontWeight: '900', marginTop: '10px' }}>12</div>
                </div>
                <div className="card" style={{ padding: '20px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                       <span style={{ fontSize: '0.7rem', fontWeight: '800', opacity: 0.5 }}>DURAÇÃO MÉDIA</span>
                       <Clock size={16} opacity={0.5} />
                   </div>
                   <div style={{ fontSize: '1.8rem', fontWeight: '900', marginTop: '10px' }}>4m 20s</div>
                </div>
            </div>

            <div className="card" style={{ padding: '50px', textAlign: 'center', opacity: 0.3 }}>
                <Phone size={40} style={{ marginBottom: '15px' }} />
                <p>O registro detalhado de chamadas via WhatsApp API será exibido aqui após a integração com a Evolution API.</p>
            </div>
        </div>
    );
};

export default CallsReport;
