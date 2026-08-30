import React, { useState, useEffect, useContext, useRef } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { Phone, Video, MoreVertical, Paperclip, Smile, Send, Bot, User, CheckCheck, Clock } from 'lucide-react';

const Chats = () => {
  const { settings } = useContext(SettingsContext);
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [showCopilot, setShowCopilot] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const accentColor = settings?.primary_color || '#00F5FF';

  // 1. Busca a lista de leads reais do banco de dados
  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads');
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setLeads(result.data);
        if (!selectedLead && result.data.length > 0) {
          setSelectedLead(result.data[0]);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar leads para o chat:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Busca o histórico de mensagens do lead selecionado
  const fetchMessages = async (leadId) => {
    if (!leadId) return;
    try {
      const response = await fetch(`/api/leads/${leadId}/messages`);
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setMessages(result.data);
      }
    } catch (error) {
      console.error("Erro ao buscar mensagens do lead:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedLead?.id) {
      fetchMessages(selectedLead.id);
      const interval = setInterval(() => fetchMessages(selectedLead.id), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedLead?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 3. Envio de mensagem pelo atendente
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedLead?.id) return;

    const currentText = messageText;
    setMessageText('');

    // Adiciona otimisticamente na UI
    const tempMsg = {
      id: String(Date.now()),
      sender_type: 'agent',
      content: currentText,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      const response = await fetch(`/api/leads/${selectedLead.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: currentText,
          sender_type: 'agent'
        })
      });
      const result = await response.json();
      if (result.success && result.data) {
        setMessages(prev => prev.map(m => m.id === tempMsg.id ? result.data : m));
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  const filteredLeads = leads.filter(l => 
    l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.phone?.includes(searchTerm)
  );

  return (
    <div style={{ 
      display: 'flex', 
      height: '100%', 
      width: '100%',
      background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(20px)',
      overflow: 'hidden',
      color: '#fff',
      borderLeft: '1px solid rgba(255,255,255,0.08)',
    }}>
      
      {/* PAINEL 1: SIDEBAR DE CONVERSAS */}
      <div style={{ 
        width: '320px', 
        borderRight: '1px solid rgba(255,255,255,0.05)', 
        display: 'flex', 
        flexDirection: 'column',
        background: 'rgba(255,255,255,0.01)'
      }}>
        <div style={{ padding: '25px 20px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '18px', letterSpacing: '-0.02em' }}>Conversas</h2>
          <div style={{ position: 'relative' }}>
             <span style={{ position: 'absolute', left: '12px', top: '10px', opacity: 0.4 }}>🔍</span>
             <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar chats..." 
              style={{ 
                width: '100%', 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.05)', 
                padding: '10px 10px 10px 35px', 
                borderRadius: '12px', 
                fontSize: '0.85rem',
                color: '#fff',
                outline: 'none'
              }} 
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px 20px' }}>
          {filteredLeads.length === 0 ? (
            <div style={{ padding: '30px 15px', textAlign: 'center', opacity: 0.5, fontSize: '0.85rem' }}>
              Nenhum lead encontrado.
            </div>
          ) : (
            filteredLeads.map(lead => {
              const isSelected = selectedLead?.id === lead.id;
              const lastMsg = lead.messages?.[0]?.content || lead.notes || 'Sem mensagens...';
              return (
                <div 
                  key={lead.id} 
                  onClick={() => setSelectedLead(lead)}
                  style={{ 
                    padding: '14px 15px', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    gap: '12px',
                    borderRadius: '16px',
                    background: isSelected ? 'rgba(255,255,255,0.05)' : 'transparent',
                    marginBottom: '4px',
                    transition: '0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative'
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <div style={{ 
                      width: '46px', 
                      height: '46px', 
                      borderRadius: '14px', 
                      background: isSelected ? accentColor : 'rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isSelected ? '#000' : '#fff',
                      fontWeight: '700',
                      fontSize: '1.1rem'
                    }}>
                      {lead.name ? lead.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div style={{ position: 'absolute', bottom: -2, right: -2, width: '14px', height: '14px', borderRadius: '50%', background: '#22c55e', border: '3px solid #000' }}></div>
                  </div>
                  
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.9rem', color: isSelected ? accentColor : '#fff' }}>{lead.name}</strong>
                      <span style={{ fontSize: '0.65rem', opacity: 0.4 }}>
                        {lead.last_contacted_at ? new Date(lead.last_contacted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', opacity: 0.5, margin: '2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                       {lastMsg}
                    </p>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                       <span style={{ background: 'rgba(34, 197, 94, 0.15)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.6rem', color: '#22c55e' }}>{lead.pipeline_status || 'Início'}</span>
                       <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.6rem', opacity: 0.5 }}>{lead.source || 'WhatsApp'}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* PAINEL 2: CHAT AREA (TEMPO REAL) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.2)' }}>
        
        {/* Header do Chat */}
        {selectedLead ? (
          <div style={{ 
            padding: '15px 30px', 
            background: 'rgba(255,255,255,0.02)', 
            backdropFilter: 'blur(10px)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>{selectedLead?.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                   <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }}></div>
                   <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>Canal WhatsApp • {selectedLead?.phone}</span>
                </div>
             </div>
             <div style={{ display: 'flex', gap: '16px', alignItems: 'center', opacity: 0.6 }}>
                <a href={`https://wa.me/${selectedLead?.phone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ color: '#22c55e', textDecoration: 'none' }}>
                  <Phone size={18} />
                </a>
                <MoreVertical size={18} style={{ cursor: 'pointer' }} />
             </div>
          </div>
        ) : null}

        {/* Mensagens da Conversa */}
        <div style={{ 
          flex: 1, 
          padding: '30px', 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px',
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.01) 0%, transparent 70%)'
        }}>
          {!selectedLead ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
              <Bot size={48} style={{ marginBottom: '10px' }} />
              <p>Selecione uma conversa na barra lateral para visualizar as mensagens.</p>
            </div>
          ) : messages.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.4, gap: '8px' }}>
              <span style={{ fontSize: '2.2rem' }}>💬</span>
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600' }}>Nenhuma mensagem registrada no banco para este lead.</p>
              <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Envie uma mensagem abaixo para falar com o cliente no WhatsApp.</span>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isClient = msg.sender_type === 'client';
              const isBot = msg.sender_type === 'bot';
              return (
                <div key={msg.id || idx} style={{ 
                  alignSelf: isClient ? 'flex-start' : 'flex-end',
                  maxWidth: '75%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {isBot && <span style={{ fontSize: '0.65rem', color: accentColor, fontWeight: '800', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🤖 Concierge IA</span>}
                  {msg.sender_type === 'agent' && <span style={{ fontSize: '0.65rem', color: '#22c55e', fontWeight: '800', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', alignSelf: 'flex-end' }}>👤 Atendente Humano</span>}
                  
                  <div style={{
                    background: isClient ? 'rgba(255,255,255,0.06)' : `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                    color: isClient ? '#fff' : '#000',
                    padding: '12px 18px',
                    borderRadius: isClient ? '4px 18px 18px 18px' : '18px 18px 4px 18px',
                    boxShadow: isClient ? '0 4px 15px rgba(0,0,0,0.1)' : `0 8px 25px ${accentColor}20`,
                    position: 'relative',
                    whiteSpace: 'pre-wrap',
                    border: isClient ? '1px solid rgba(255,255,255,0.08)' : 'none'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.92rem', fontWeight: isClient ? '400' : '500' }}>{msg.content}</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                      <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>
                        {new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {!isClient && <CheckCheck size={12} />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input de Mensagem */}
        {selectedLead && (
          <form onSubmit={handleSendMessage} style={{ 
            padding: '20px 30px', 
            background: 'rgba(255,255,255,0.01)', 
            borderTop: '1px solid rgba(255,255,255,0.05)' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
               <div 
                 onClick={() => setShowCopilot(!showCopilot)}
                 style={{ width: '40px', height: '22px', background: showCopilot ? accentColor : 'rgba(255,255,255,0.1)', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: '0.3s' }}>
                  <div style={{ position: 'absolute', top: '3px', left: showCopilot ? '21px' : '3px', width: '16px', height: '16px', background: showCopilot ? '#000' : '#fff', borderRadius: '50%', transition: '0.3s' }}></div>
               </div>
               <span style={{ fontSize: '0.75rem', fontWeight: '700', color: showCopilot ? accentColor : '#fff' }}>Intervenção Humana (Agente IA Pausa Automática)</span>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input 
                  type="text" 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={`Responder para ${selectedLead.name} no WhatsApp...`}
                  style={{ 
                    width: '100%', 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255,255,255,0.08)', 
                    padding: '14px 20px', 
                    borderRadius: '16px', 
                    color: '#fff', 
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: '0.2s'
                  }} 
                  onFocus={(e) => e.target.style.border = `1px solid ${accentColor}`}
                  onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.08)'}
                />
              </div>
              <button 
                type="submit"
                disabled={!messageText.trim()}
                style={{ 
                  background: messageText.trim() ? accentColor : 'rgba(255,255,255,0.05)', 
                  border: 'none', 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '14px', 
                  color: '#000', 
                  cursor: messageText.trim() ? 'pointer' : 'default',
                  transition: '0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: messageText.trim() ? 1 : 0.5
                }}>
                <Send size={18} />
              </button>
            </div>
          </form>
        )}

      </div>

      {/* PAINEL 3: INTEL DO LEAD */}
      {selectedLead && (
        <div style={{ 
          width: '300px', 
          borderLeft: '1px solid rgba(255,255,255,0.05)', 
          display: 'flex', 
          flexDirection: 'column',
          background: 'rgba(0,0,0,0.1)',
          overflowY: 'auto'
        }}>
          <div style={{ padding: '30px 20px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
             <div style={{ 
               width: '90px', 
               height: '90px', 
               borderRadius: '28px', 
               background: `linear-gradient(45deg, ${accentColor}, #000)`, 
               color: '#000', 
               fontSize: '2.4rem', 
               display: 'flex', 
               alignItems: 'center', 
               justifyContent: 'center', 
               margin: '0 auto 15px', 
               fontWeight: '800' 
             }}>
               {selectedLead?.name ? selectedLead.name.charAt(0).toUpperCase() : '?'}
             </div>
             <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>{selectedLead?.name}</h3>
             <p style={{ fontSize: '0.75rem', opacity: 0.4, marginTop: '5px' }}>{selectedLead?.pipeline_status || 'Lead Ativo'}</p>
          </div>

          <div style={{ padding: '25px 20px' }}>
             <div style={{ marginBottom: '30px' }}>
                <h4 style={{ fontSize: '0.7rem', fontWeight: '800', opacity: 0.4, letterSpacing: '0.1em', marginBottom: '15px' }}>CONTATO INTEL</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.65rem', opacity: 0.5, marginBottom: '4px' }}>WHATSAPP</label>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: accentColor }}>{selectedLead?.phone}</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.65rem', opacity: 0.5, marginBottom: '4px' }}>CANAL DE ENTRADA</label>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{selectedLead?.source || 'WhatsApp Evolution'}</span>
                  </div>
                  {selectedLead?.notes && (
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px' }}>
                      <label style={{ display: 'block', fontSize: '0.65rem', opacity: 0.5, marginBottom: '4px' }}>NOTAS / RESUMO IA</label>
                      <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8, lineHeight: '1.3' }}>{selectedLead.notes}</p>
                    </div>
                  )}
                </div>
             </div>

             <div>
                <h4 style={{ fontSize: '0.7rem', fontWeight: '800', opacity: 0.4, letterSpacing: '0.1em', marginBottom: '15px' }}>ESTÁGIO NO FUNIL</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                   <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                     {selectedLead?.pipeline_status || 'Início de Atendimento'}
                   </span>
                </div>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Chats;
