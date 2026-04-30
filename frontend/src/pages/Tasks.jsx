import React, { useContext, useState } from 'react';
import { Calendar, User, Link as LinkIcon, MessageSquare, CheckCircle2, MoreVertical, Plus, Info } from 'lucide-react';
import { SettingsContext } from '../context/SettingsContext';

const Tasks = () => {
  const { settings } = useContext(SettingsContext);
  const accentColor = settings?.primary_color || '#00F5FF';
  const [tasks, setTasks] = useState([]); // Iniciando vazio para produção

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Tarefas</h1>
          <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>Gerencie suas atividades e acompanhamentos estratégicos</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px' }}>
            <button style={{ background: 'transparent', border: 'none', color: '#fff', padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '6px' }}>DIA</button>
            <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '6px' }}>SEMANA</button>
            <button style={{ background: 'transparent', border: 'none', color: '#fff', padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '6px' }}>MÊS</button>
          </div>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '0.85rem' }}>
            <Plus size={16} />
            <span>NOVO EVENTO</span>
          </button>
        </div>
      </header>

      <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ overflowX: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                <th style={{ padding: '15px 20px', width: '40px' }}><input type="checkbox" /></th>
                <th style={{ padding: '15px 10px', fontWeight: 'bold', opacity: 0.6 }}>DATA DE VENCIMENTO</th>
                <th style={{ padding: '15px 10px', fontWeight: 'bold', opacity: 0.6 }}>USUÁRIO RESPONSÁVEL</th>
                <th style={{ padding: '15px 10px', fontWeight: 'bold', opacity: 0.6 }}>OBJETO</th>
                <th style={{ padding: '15px 10px', fontWeight: 'bold', opacity: 0.6 }}>TIPO DE EVENTO</th>
                <th style={{ padding: '15px 10px', fontWeight: 'bold', opacity: 0.6 }}>COMENTÁRIO</th>
                <th style={{ padding: '15px 10px', fontWeight: 'bold', opacity: 0.6, textAlign: 'right' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '100px 20px', textAlign: 'center', opacity: 0.3 }}>
                    <Calendar size={48} style={{ marginBottom: '15px', display: 'block', margin: '0 auto' }} />
                    Nenhuma tarefa pendente para o período selecionado.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: '0.2s' }} className="table-row-hover">
                    <td style={{ padding: '15px 20px' }}><input type="checkbox" /></td>
                    <td style={{ padding: '15px 10px', opacity: 0.8 }}>{task.date}</td>
                    <td style={{ padding: '15px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>U</div>
                        <span>Usuário</span>
                      </div>
                    </td>
                    <td style={{ padding: '15px 10px', color: accentColor, fontWeight: '500' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <LinkIcon size={14} />
                        {task.object}
                      </div>
                    </td>
                    <td style={{ padding: '15px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#39FF14' }}>
                        <CheckCircle2 size={14} />
                        <span>{task.type}</span>
                      </div>
                    </td>
                    <td style={{ padding: '15px 10px', opacity: 0.6, maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {task.comment}
                    </td>
                    <td style={{ padding: '15px 10px', textAlign: 'right' }}>
                      <button style={{ background: 'transparent', border: 'none', color: '#fff', opacity: 0.3, cursor: 'pointer' }}>
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* RODAPÉ DESCRITIVO FORMAL */}
        <div style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
          <Info size={18} color={accentColor} style={{ marginTop: '2px', flexShrink: 0 }} />
          <p style={{ fontSize: '0.8rem', opacity: 0.6, lineHeight: '1.5', margin: 0 }}>
            <strong>Nota Institucional:</strong> As tarefas aqui listadas destinam-se ao gerenciamento de contatos manuais com leads qualificados como "frios", 
            visando o reengajamento estratégico após a conclusão do fluxo de acompanhamento automatizado realizado pelo Agente de IA.
          </p>
        </div>
      </div>
      
      <style>{`
        .table-row-hover:hover {
          background: rgba(255,255,255,0.02);
        }
        input[type="checkbox"] {
          accent-color: ${accentColor};
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Tasks;
