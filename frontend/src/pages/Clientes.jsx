import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, Search, Plus, Phone, Mail, Globe, MapPin, 
  Calendar, MessageSquare, Bot, ArrowUpRight, CheckCircle2, 
  Clock, Sparkles, Filter, MoreVertical, Edit3, ShieldCheck
} from 'lucide-react';

const mockClients = [
  {
    id: '1',
    name: 'TechFlow Soluções Digitais',
    cnpj: '45.123.890/0001-34',
    sector: 'Tecnologia & SaaS',
    address: 'Av. Paulista, 1000 - Bela Vista, São Paulo/SP',
    website: 'https://techflow.com.br',
    email: 'contato@techflow.com.br',
    status: 'Ativo',
    contactName: 'Guilherme Siqueira',
    contactRole: 'Diretor Comercial',
    contactPhone: '+55 11 98765-4321',
    lastContact: 'Há 20 minutos',
    history: [
      { sender: 'lead', time: '10:15', text: 'Olá! Gostaria de saber mais sobre as automações de WhatsApp e integração com CRM.' },
      { sender: 'bot', time: '10:16', text: 'Olá Guilherme! A Innova AI oferece uma esteira autônoma completa que qualifica leads no WhatsApp e atualiza o seu funil em tempo real. Qual é o volume médio de atendimentos diários da sua empresa?' },
      { sender: 'lead', time: '10:18', text: 'Hoje recebemos por volta de 150 leads por dia através de campanhas no YouTube e Instagram.' },
      { sender: 'bot', time: '10:19', text: 'Perfeito! Para esse volume, nossa esteira com Agente GPT-4o e webhook n8n garante resposta instantânea sem filas. Gostaria de agendar uma demonstração técnica com nosso especialista?' },
      { sender: 'lead', time: '10:20', text: 'Sim, quinta-feira às 15h seria excelente.' }
    ]
  },
  {
    id: '2',
    name: 'Clinica Bella Pelle',
    cnpj: '28.987.654/0001-12',
    sector: 'Saúde & Estética',
    address: 'Rua Oscar Freire, 450 - Jardins, São Paulo/SP',
    website: 'https://bellapelle.med.br',
    email: 'atendimento@bellapelle.med.br',
    status: 'Em Negociação',
    contactName: 'Dra. Camila Duarte',
    contactRole: 'Sócia Proprietária',
    contactPhone: '+55 11 99123-8877',
    lastContact: 'Hoje às 09:30',
    history: [
      { sender: 'lead', time: '09:28', text: 'Vocês realizam confirmação de consultas e lembretes automáticos?' },
      { sender: 'bot', time: '09:29', text: 'Sim, Dra. Camila! Nosso Concierge IA envia lembretes interativos e sincroniza os agendamentos diretamente no Google Calendar e no painel da clínica.' }
    ]
  },
  {
    id: '3',
    name: 'Vanguard Engenharia e Imóveis',
    cnpj: '33.555.777/0001-99',
    sector: 'Imobiliário & Construção',
    address: 'Av. Brigadeiro Faria Lima, 2200 - Itaim Bibi, São Paulo/SP',
    website: 'https://vanguardimoveis.com.br',
    email: 'vendas@vanguardimoveis.com.br',
    status: 'Novo Lead',
    contactName: 'Roberto Albuquerque',
    contactRole: 'Gerente de Vendas',
    contactPhone: '+55 11 97654-3210',
    lastContact: 'Ontem',
    history: [
      { sender: 'lead', time: '16:40', text: 'Preciso de um sistema para classificar leads que chegam nos anúncios de lançamentos.' },
      { sender: 'bot', time: '16:41', text: 'Excelente, Roberto. Nossa IA qualifica a renda e interesse do comprador e move o card diretamente para a etapa correta no seu Kanban.' }
    ]
  }
];

export default function Clientes() {
  const [clients, setClients] = useState(mockClients);
  const [selectedClient, setSelectedClient] = useState(mockClients[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dados');

  const [newClient, setNewClient] = useState({
    name: '',
    cnpj: '',
    sector: '',
    address: '',
    website: '',
    email: '',
    contactName: '',
    contactRole: '',
    contactPhone: ''
  });

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cnpj.includes(searchTerm) ||
    c.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateClient = (e) => {
    e.preventDefault();
    if (!newClient.name) return;

    const created = {
      ...newClient,
      id: String(Date.now()),
      status: 'Novo Lead',
      lastContact: 'Agora',
      history: [
        { sender: 'bot', time: 'Agora', text: 'Cadastro criado no sistema. Aguardando primeira mensagem no WhatsApp.' }
      ]
    };

    setClients([created, ...clients]);
    setSelectedClient(created);
    setIsModalOpen(false);
    setNewClient({
      name: '', cnpj: '', sector: '', address: '', website: '', email: '',
      contactName: '', contactRole: '', contactPhone: ''
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', gap: '20px' }}>
      
      {/* HEADER DA PÁGINA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'var(--color-accent)', margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 size={28} />
            Módulo de Clientes & Empresas
          </h1>
          <p style={{ margin: '4px 0 0', opacity: 0.7, fontSize: '0.9rem' }}>
            Visão hierárquica de contas comerciais, responsáveis e histórico inteligente n8n.
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          style={{
            background: 'var(--color-accent)',
            color: '#000',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(0, 132, 255, 0.3)'
          }}
        >
          <Plus size={18} />
          Nova Empresa
        </button>
      </div>

      {/* CONTAINER SPLIT VIEW */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '380px 1fr', 
        gap: '20px', 
        flex: 1, 
        minHeight: 0 
      }}>
        
        {/* COLUNA ESQUERDA: LISTA DE EMPRESAS */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          
          {/* SEARCH BAR */}
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '8px 12px',
              gap: '10px'
            }}>
              <Search size={16} style={{ opacity: 0.5 }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por empresa, CNPJ ou setor..."
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  width: '100%',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          {/* LISTA */}
          <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {filteredClients.map((client) => {
              const isSelected = selectedClient?.id === client.id;
              return (
                <div
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    background: isSelected 
                      ? 'linear-gradient(90deg, rgba(0, 132, 255, 0.15), rgba(0, 132, 255, 0.03))' 
                      : 'rgba(255, 255, 255, 0.02)',
                    border: isSelected 
                      ? '1px solid rgba(0, 132, 255, 0.5)' 
                      : '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', color: isSelected ? 'var(--color-accent)' : '#fff' }}>
                      {client.name}
                    </h4>
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: client.status === 'Ativo' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                      color: client.status === 'Ativo' ? 'var(--color-accent-green)' : '#ccc'
                    }}>
                      {client.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '4px' }}>
                    CNPJ: {client.cnpj}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', opacity: 0.5, marginTop: '8px' }}>
                    <span>{client.sector}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {client.lastContact}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUNA DIREITA: DETALHES & HISTÓRICO INTELIGENTE */}
        {selectedClient ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            
            {/* CABEÇALHO DO CLIENTE */}
            <div style={{ 
              padding: '20px 24px', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(0, 0, 0, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#fff' }}>{selectedClient.name}</h2>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    background: 'rgba(34, 197, 94, 0.15)',
                    color: 'var(--color-accent-green)',
                    border: '1px solid rgba(34, 197, 94, 0.3)'
                  }}>
                    {selectedClient.status}
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', opacity: 0.6, fontSize: '0.85rem' }}>
                  {selectedClient.sector} • CNPJ: {selectedClient.cnpj}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Edit3 size={15} /> Editar
                </button>
              </div>
            </div>

            {/* ABAS */}
            <div style={{ 
              display: 'flex', 
              gap: '20px', 
              padding: '0 24px', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              background: 'rgba(0, 0, 0, 0.1)'
            }}>
              {[
                { id: 'dados', label: 'Dados da Empresa', icon: Building2 },
                { id: 'contato', label: 'Responsável Comercial', icon: Users },
                { id: 'historico', label: 'Histórico n8n / WhatsApp', icon: Sparkles }
              ].map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      borderBottom: active ? '2px solid var(--color-accent)' : '2px solid transparent',
                      color: active ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.6)',
                      padding: '14px 0',
                      cursor: 'pointer',
                      fontWeight: active ? '600' : '400',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* CONTEÚDO DAS ABAS */}
            <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              
              {/* ABA 1: DADOS DA EMPRESA */}
              {activeTab === 'dados' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="card" style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <div style={{ opacity: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '6px' }}>CNPJ</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '500' }}>{selectedClient.cnpj}</div>
                  </div>

                  <div className="card" style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <div style={{ opacity: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '6px' }}>Setor / Nicho</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '500' }}>{selectedClient.sector}</div>
                  </div>

                  <div className="card" style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <div style={{ opacity: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '6px' }}>E-mail Corporativo</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '500' }}>{selectedClient.email}</div>
                  </div>

                  <div className="card" style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <div style={{ opacity: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '6px' }}>Website Oficial</div>
                    <a href={selectedClient.website} target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {selectedClient.website} <ArrowUpRight size={14} />
                    </a>
                  </div>

                  <div className="card" style={{ gridColumn: 'span 2', padding: '16px', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <div style={{ opacity: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '6px' }}>Endereço Completo</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={16} color="var(--color-accent)" /> {selectedClient.address}
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 2: RESPONSÁVEL COMERCIAL */}
              {activeTab === 'contato' && (
                <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="card" style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.02)', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0084FF, #003C74)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      color: '#000',
                      fontSize: '1.2rem'
                    }}>
                      {selectedClient.contactName.charAt(0)}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedClient.contactName}</h3>
                      <p style={{ margin: '2px 0 0', opacity: 0.6, fontSize: '0.85rem' }}>{selectedClient.contactRole}</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="card" style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)' }}>
                      <div style={{ opacity: 0.5, fontSize: '0.75rem', marginBottom: '6px' }}>WhatsApp Comercial</div>
                      <a 
                        href={`https://wa.me/${selectedClient.contactPhone.replace(/\D/g, '')}`} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ color: '#0084FF', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Phone size={15} /> {selectedClient.contactPhone}
                      </a>
                    </div>

                    <div className="card" style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)' }}>
                      <div style={{ opacity: 0.5, fontSize: '0.75rem', marginBottom: '6px' }}>Último Contato</div>
                      <div style={{ fontSize: '0.9rem' }}>{selectedClient.lastContact}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 3: HISTÓRICO INTELIGENTE N8N */}
              {activeTab === 'historico' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'rgba(0, 132, 255, 0.08)',
                    border: '1px solid rgba(0, 132, 255, 0.2)',
                    fontSize: '0.85rem',
                    color: 'var(--color-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <Bot size={18} />
                    <span>Diálogo capturado em tempo real pelo <strong>Agente AI Concierge (n8n)</strong> via Evolution API.</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                    {selectedClient.history?.map((msg, idx) => {
                      const isBot = msg.sender === 'bot';
                      return (
                        <div 
                          key={idx}
                          style={{
                            alignSelf: isBot ? 'flex-start' : 'flex-end',
                            maxWidth: '75%',
                            padding: '12px 16px',
                            borderRadius: isBot ? '12px 12px 12px 2px' : '12px 12px 2px 12px',
                            background: isBot ? 'rgba(255, 255, 255, 0.05)' : 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))',
                            border: isBot ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(34, 197, 94, 0.4)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', gap: '15px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: isBot ? '#00F5FF' : '#22c55e' }}>
                              {isBot ? '🤖 Concierge IA' : `👤 ${selectedClient.contactName}`}
                            </span>
                            <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>{msg.time}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.4' }}>{msg.text}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>
        ) : null}
      </div>

      {/* MODAL: NOVA EMPRESA */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: '#12151a',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '30px',
            width: '550px',
            maxWidth: '90vw'
          }}>
            <h2 style={{ margin: '0 0 15px', color: 'var(--color-accent)' }}>Cadastrar Nova Empresa</h2>
            
            <form onSubmit={handleCreateClient} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                className="input-field"
                placeholder="Nome da Empresa *"
                required
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input
                  className="input-field"
                  placeholder="CNPJ"
                  value={newClient.cnpj}
                  onChange={(e) => setNewClient({ ...newClient, cnpj: e.target.value })}
                />
                <input
                  className="input-field"
                  placeholder="Setor / Nicho"
                  value={newClient.sector}
                  onChange={(e) => setNewClient({ ...newClient, sector: e.target.value })}
                />
              </div>
              <input
                className="input-field"
                placeholder="Endereço Completo"
                value={newClient.address}
                onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input
                  className="input-field"
                  placeholder="Website"
                  value={newClient.website}
                  onChange={(e) => setNewClient({ ...newClient, website: e.target.value })}
                />
                <input
                  className="input-field"
                  placeholder="E-mail"
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                />
              </div>

              <div style={{ marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '8px' }}>Responsável Comercial</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input
                    className="input-field"
                    placeholder="Nome do Contato"
                    value={newClient.contactName}
                    onChange={(e) => setNewClient({ ...newClient, contactName: e.target.value })}
                  />
                  <input
                    className="input-field"
                    placeholder="WhatsApp"
                    value={newClient.contactPhone}
                    onChange={(e) => setNewClient({ ...newClient, contactPhone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  style={{ background: 'var(--color-accent)', color: '#000', border: 'none', padding: '8px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Salvar Empresa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
