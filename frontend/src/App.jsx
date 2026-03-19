import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

// Importando Telas
import Login from './pages/Login';
import ClientLayout from './layouts/ClientLayout';

// Mock de Dados para o Gráfico de Negócios (CRM)
const crmData = [
  { name: 'Seg', receita: 4500, leads: 120, vendas: 12 },
  { name: 'Ter', receita: 3000, leads: 85, vendas: 8 },
  { name: 'Qua', receita: 8800, leads: 200, vendas: 24 },
  { name: 'Qui', receita: 3900, leads: 150, vendas: 10 },
  { name: 'Sex', receita: 4800, leads: 180, vendas: 15 },
  { name: 'Sáb', receita: 6500, leads: 220, vendas: 18 },
  { name: 'Dom', receita: 3400, leads: 90, vendas: 9 },
];

// O "Banco de Dados Fictício" com 20 Clientes Exclusivos Solicitados
const mockLeads = [
  { id: 1, name: "Consultoria Master", contact: "Ricardo Nunes", status: "INÍCIO DE ATENDIMENTO", phone: "(11) 99888-1111" },
  { id: 2, name: "Escritório Beta", contact: "Maria Silva", status: "CONVERSANDO (Robô IA)", phone: "(21) 98777-2222" },
  { id: 3, name: "Construtora Horizonte", contact: "Carlos Costa", status: "AGENDAMENTO", phone: "(31) 97666-3333" },
  { id: 4, name: "Imobiliária Prime", contact: "Ana Paula", status: "FORMULÁRIO ENVIADO", phone: "(41) 96555-4444" },
  { id: 5, name: "Seguradora Protege", contact: "Lucas Ramos", status: "FOLLOW UP", phone: "(51) 95444-5555" },
  { id: 6, name: "Doceria Sweet", contact: "Julia Lima", status: "INÍCIO DE ATENDIMENTO", phone: "(61) 94333-6666" },
  { id: 7, name: "Clínica Vida", contact: "Fernanda Alves", status: "CONVERSANDO (Robô IA)", phone: "(71) 93222-7777" },
  { id: 8, name: "Engenharia Solida", contact: "Marcos Dias", status: "AGENDAMENTO", phone: "(81) 92111-8888" },
  { id: 9, name: "Escola Aprender", contact: "Patrícia Gomes", status: "FORMULÁRIO ENVIADO", phone: "(91) 91000-9999" },
  { id: 10, name: "AgroTech Sul", contact: "Roberto Mendes", status: "FOLLOW UP", phone: "(19) 99888-0000" },
  { id: 11, name: "Varejo Rápido", contact: "Thiago Rocha", status: "INÍCIO DE ATENDIMENTO", phone: "(12) 98777-1111" },
  { id: 12, name: "Contabilidade Exata", contact: "Camila Barros", status: "CONVERSANDO (Robô IA)", phone: "(13) 97666-2222" },
  { id: 13, name: "Advocacia Guedes", contact: "Felipe Guedes", status: "AGENDAMENTO", phone: "(14) 96555-3333" },
  { id: 14, name: "Arquitetura Design", contact: "Beatriz Moura", status: "FORMULÁRIO ENVIADO", phone: "(15) 95444-4444" },
  { id: 15, name: "Tech Solutions", contact: "Gabriel Farias", status: "FOLLOW UP", phone: "(16) 94333-5555" },
  { id: 16, name: "Distribuidora Alfa", contact: "Marina Duarte", status: "INÍCIO DE ATENDIMENTO", phone: "(17) 93222-6666" },
  { id: 17, name: "Cosméticos Bella", contact: "Rafael Nunes", status: "CONVERSANDO (Robô IA)", phone: "(18) 92111-7777" },
  { id: 18, name: "Farmácia Mais", contact: "Vanessa Castro", status: "AGENDAMENTO", phone: "(22) 91000-8888" },
  { id: 19, name: "Transportadora Veloz", contact: "Hugo Nogueira", status: "FORMULÁRIO ENVIADO", phone: "(24) 99888-9999" },
  { id: 20, name: "Eventos Fest", contact: "Bianca Mello", status: "FOLLOW UP", phone: "(27) 98777-0000" },
];

const Dashboard = () => (
  <div>
    <h1 style={{ color: 'var(--color-accent-cyan)' }}>Dashboard Executivo (Performance)</h1>
    <p style={{ color: 'var(--color-light)', opacity: 0.8, marginBottom: '20px' }}>
      Monitoramento estratégico do seu funil comercial, vendas fechadas pelo Motor de IA e conversão de leads.
    </p>

    {/* Resumo de Negócios Superior */}
    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
      <div className="card" style={{ flex: 1, borderTop: '4px solid var(--color-accent-green)' }}>
        <h3 style={{ fontSize: '1rem', opacity: 0.7 }}>Receita Mensal Bruta</h3>
        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-accent-green)' }}>R$ 145.200</p>
        <small style={{ color: '#00F5FF' }}>▲ +18% vs último mês</small>
      </div>
      <div className="card" style={{ flex: 1, borderTop: '4px solid var(--color-accent-cyan)' }}>
        <h3 style={{ fontSize: '1rem', opacity: 0.7 }}>Vendas Concluídas</h3>
        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-accent-cyan)' }}>842</p>
        <small style={{ color: '#39FF14' }}>▲ +5% Taxa de Conversão</small>
      </div>
      <div className="card" style={{ flex: 1, borderTop: '4px solid var(--color-light)' }}>
        <h3 style={{ fontSize: '1rem', opacity: 0.7 }}>Novos Clientes (Leads)</h3>
        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-light)' }}>3.450</p>
        <small style={{ opacity: 0.5 }}>Captados via WhatsApp Cloud</small>
      </div>
    </div>

    {/* Área dos Gráficos de Vendas */}
    <div style={{ display: 'flex', gap: '20px', height: '350px' }}>
      <div className="card" style={{ flex: 1, padding: '15px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ marginBottom: '10px', color: 'var(--color-accent-green)' }}>Evolução de Receita Diária</h3>
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={crmData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={14} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={14} />
              <Tooltip contentStyle={{ backgroundColor: '#0B132B', borderColor: '#39FF14', color: '#fff', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Line name="Faturamento em (R$)" type="monotone" dataKey="receita" stroke="#39FF14" strokeWidth={3} dot={{ r: 4, fill: '#0B132B', stroke: '#39FF14', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#39FF14' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ flex: 1, padding: '15px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ marginBottom: '10px', color: 'var(--color-accent-cyan)' }}>Captações vs Fechamentos</h3>
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={crmData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={14} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={14} />
              <Tooltip contentStyle={{ backgroundColor: '#0B132B', borderColor: '#00F5FF', color: '#fff', borderRadius: '8px' }} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar name="Leads Captados" dataKey="leads" fill="#00F5FF" radius={[4, 4, 0, 0]} />
              <Bar name="Vendas (Ganhos)" dataKey="vendas" fill="#F8F9FA" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
);

const StatusLegend = () => (
  <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap', padding: '10px 0' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'var(--color-accent-green)' }}></div>
      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Atendimento Pronto</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'var(--color-accent-cyan)' }}></div>
      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>IA Conversando</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#FFD700' }}></div>
      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reunião / Agendado</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}></div>
      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Outros Estágios</span>
    </div>
  </div>
);

const Kanban = () => {
  const columns = ['INÍCIO DE ATENDIMENTO', 'CONVERSANDO (Robô IA)', 'AGENDAMENTO', 'FORMULÁRIO ENVIADO', 'FOLLOW UP'];
  
  return (
    <div style={{ paddingRight: '20px' }}>
      <h1 style={{ color: 'var(--color-accent-green)', marginBottom: '5px' }}>Leads (Quadro Vivo)</h1>
      <p style={{ opacity: 0.8, marginBottom: '25px' }}>O Kanban dinâmico sincronizado em tempo real com nosso Robô Virtual.</p>
      
      <StatusLegend />
      
      <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
        {columns.map(col => (
          <div key={col} className="card" style={{ flexShrink: 0, width: '320px', minHeight: '650px', display: 'flex', flexDirection: 'column', padding: '20px', marginTop: 0 }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '20px', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
              <span>{col}</span>
              <span style={{ opacity: 0.5 }}>{mockLeads.filter(l => l.status === col).length}</span>
            </h3>
            
            {/* Rendereiza os Cards Virtuais da Coluna */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {mockLeads.filter(l => l.status === col).map(lead => (
                <div key={lead.id} style={{
                  background: 'rgba(0,0,0,0.5)', padding: '18px', borderRadius: '10px',
                  borderLeft: `5px solid ${col === 'CONVERSANDO (Robô IA)' ? 'var(--color-accent-cyan)' : col === 'AGENDAMENTO' ? '#FFD700' : 'var(--color-accent-green)'}`,
                  cursor: 'pointer',
                  transition: '0.2s',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                }}>
                  <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--color-light)', marginBottom: '8px' }}>{lead.name}</strong>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', opacity: 0.8, marginBottom: '4px' }}>
                     👤 {lead.contact}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', opacity: 0.8 }}>
                     📱 {lead.phone}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BaseContatos = () => (
  <div>
    <h1 style={{ color: 'var(--color-accent-cyan)', marginBottom: '10px' }}>Base de Contatos (Listagem Global)</h1>
    <p style={{ opacity: 0.8, marginBottom: '30px' }}>Todos os Leads captados no seu sistema SaaS, em modo tabela estruturada.</p>

    <StatusLegend />

    <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
          <tr>
            <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Empresa / Lead (Cliente final)</th>
            <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Representante</th>
            <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>WhatsApp</th>
            <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Estágio do Funil</th>
            <th style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Ação Rápida</th>
          </tr>
        </thead>
        <tbody>
          {mockLeads.map(lead => (
            <tr key={lead.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}>
              <td style={{ padding: '20px', color: 'var(--color-light)' }}><strong>{lead.name}</strong></td>
              <td style={{ padding: '20px', opacity: 0.8 }}>{lead.contact}</td>
              <td style={{ padding: '20px', opacity: 0.8 }}>{lead.phone}</td>
              <td style={{ padding: '20px' }}>
                <span style={{ 
                  background: lead.status === 'CONVERSANDO (Robô IA)' ? 'rgba(0, 245, 255, 0.1)' : 'rgba(57, 255, 20, 0.1)', 
                  color: lead.status === 'CONVERSANDO (Robô IA)' ? 'var(--color-accent-cyan)' : 'var(--color-accent-green)', 
                  padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' 
                }}>
                  {lead.status}
                </span>
              </td>
              <td style={{ padding: '20px' }}>
                <button style={{ background: 'transparent', border: '1px solid var(--color-accent-cyan)', color: 'var(--color-accent-cyan)', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Ver Histórico
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const Chats = () => (
  <div>
    <h1 style={{ color: 'var(--color-accent-cyan)' }}>Modo Humano (Intervenção de Usuários)</h1>
    <p>Visão de WhatsApp Web para intervir num chat que a IA não souber responder.</p>
    <div className="card">Ao enviar, ativamos `bot_paused = true`. A Inteligência Artificial é pausada para esse Lead.</div>
  </div>
);

const Settings = () => (
  <div>
    <h1 style={{ color: 'var(--color-light)', marginBottom: '10px' }}>Configurações Globais</h1>
    <p style={{ opacity: 0.8, marginBottom: '30px' }}>
      Gerencie as credenciais do seu número oficial (WhatsApp Cloud) e as rotas de conexão Webhook do motor de Inteligência Artificial.
    </p>

    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      <div className="card" style={{ flex: '1 1 400px', borderTop: '4px solid #39FF14' }}>
        <h3 style={{ color: '#39FF14', marginBottom: '20px' }}>WhatsApp Cloud API (Meta)</h3>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Phone Number ID</label>
        <input className="input-field" type="text" placeholder="Ex: 104578129..." />
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Access Token Principal</label>
        <input className="input-field" type="password" placeholder="EAADxyz123..." />
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Token de Verificação (Criado por você)</label>
        <input className="input-field" type="text" placeholder="SuaSenhaSecretaCRM" />
        <button className="btn-primary" style={{ marginTop: '10px' }}>Salvar Configurações (Meta)</button>
      </div>

      <div className="card" style={{ flex: '1 1 400px', borderTop: '4px solid #00F5FF' }}>
        <h3 style={{ color: '#00F5FF', marginBottom: '15px' }}>Roteamento de Webhooks (Motor de IA)</h3>
        <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '25px', lineHeight: '1.4' }}>
          Defina as URLs que receberão instantaneamente as novas mensagens do WhatsApp para tomada de decisão autônoma do Robô.
        </p>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#00F5FF' }}>Webhook URL: Recebimentos de Chat (Eventos)</label>
        <input className="input-field" type="url" placeholder="https://seu-motor-ia.com/webhook/novas-mensagens" />
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#00F5FF' }}>Webhook URL: Gatilho de Follow-Up Agendado</label>
        <input className="input-field" type="url" placeholder="https://seu-motor-ia.com/webhook/disparar-lead-frio" />
        <button className="btn-primary" style={{ marginTop: '10px', background: 'transparent', color: '#00F5FF', border: '1px solid #00F5FF', boxShadow: 'none' }}>
          Testar Conexões (Post)
        </button>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/app" element={<ClientLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="kanban" element={<Kanban />} />
          <Route path="chats" element={<Chats />} />
          <Route path="leads" element={<BaseContatos />} />
          <Route path="agendamentos" element={<div>Painel de Agendamentos / Google Calendar Sync</div>} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
