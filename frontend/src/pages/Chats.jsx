import React, { useState, useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { mockLeads } from '../data/mockData';

const Chats = () => {
  const { settings } = useContext(SettingsContext);
  const [selectedLead, setSelectedLead] = useState(mockLeads[0]);
  const [message, setMessage] = useState('');
  const [showCopilot, setShowCopilot] = useState(true);
  
  // Cores dinâmicas do Branding
  const accentColor = settings?.primary_color || '#00F5FF';

  // Simulação de histórico
  const [chatHistory, setChatHistory] = useState({
    1: [
      { id: 101, sender: 'client', text: 'Poderia me ajudar?', time: '11:57 AM' },
      { id: 102, sender: 'bot', text: 'Claro! 😊\n\nEu sou o assistente virtual da ' + (settings?.business_name || 'Innova AI') + '.\nComo posso ser útil hoje?', time: '11:58 AM', sentByBot: true },
    ],
    2: [
      { id: 201, sender: 'client', text: 'Oi, o robô parou de responder.', time: '10:15 AM' },
    ]
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'agent',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    };

    setChatHistory({
      ...chatHistory,
      [selectedLead.id]: [...(chatHistory[selectedLead.id] || []), newMessage]
    });
    setMessage('');
  };

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
      
      {/* PAINEL 1: SIDEBAR (DARK GLASS) */}
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
          {mockLeads.map(lead => (
            <div 
              key={lead.id} 
              onClick={() => setSelectedLead(lead)}
              style={{ 
                padding: '14px 15px', 
                cursor: 'pointer', 
                display: 'flex', 
                gap: '12px',
                borderRadius: '16px',
                background: selectedLead?.id === lead.id ? 'rgba(255,255,255,0.05)' : 'transparent',
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
                  background: selectedLead?.id === lead.id ? accentColor : 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: selectedLead?.id === lead.id ? '#000' : '#fff',
                  fontWeight: '700',
                  fontSize: '1.1rem'
                }}>
                  {lead.name.charAt(0)}
                </div>
                <div style={{ position: 'absolute', bottom: -2, right: -2, width: '14px', height: '14px', borderRadius: '50%', background: '#22c55e', border: '3px solid #000' }}></div>
              </div>
              
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.9rem', color: selectedLead?.id === lead.id ? accentColor : '#fff' }}>{lead.name}</strong>
                  <span style={{ fontSize: '0.7rem', opacity: 0.4 }}>14:22</span>
                </div>
                <p style={{ fontSize: '0.78rem', opacity: 0.5, margin: '2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                   {chatHistory[lead.id]?.[0]?.text || 'Sem mensagens...'}
                </p>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                   <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.6rem', color: accentColor }}>LIVE</span>
                   <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.6rem', opacity: 0.5 }}>Atendente</span>
                </div>
              </div>
              {lead.id === 2 && <div style={{ background: accentColor, color: '#000', borderRadius: '6px', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>2</div>}
            </div>
          ))}
        </div>
      </div>

      {/* PAINEL 2: CHAT AREA (PREMIUM DARK) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.2)' }}>
        
        {/* Header Profissional */}
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
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>{selectedLead?.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }}></div>
                 <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>Canal WhatsApp</span>
              </div>
           </div>
           <div style={{ display: 'flex', gap: '20px', alignItems: 'center', opacity: 0.6 }}>
              <span style={{ cursor: 'pointer' }}>📞</span>
              <span style={{ cursor: 'pointer' }}>📹</span>
              <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }}></div>
              <span style={{ cursor: 'pointer' }}>⋮</span>
           </div>
        </div>

        {/* Mensagens (Estilo Premium) */}
        <div style={{ 
          flex: 1, 
          padding: '30px', 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px',
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.01) 0%, transparent 70%)'
        }}>
          {(chatHistory[selectedLead?.id] || []).map((msg, idx) => (
            <div key={idx} style={{ 
              alignSelf: msg.sender === 'client' ? 'flex-start' : 'flex-end',
              maxWidth: '75%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {msg.sentByBot && <span style={{ fontSize: '0.65rem', color: accentColor, fontWeight: '800', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Response</span>}
              <div style={{
                background: msg.sender === 'client' ? 'rgba(255,255,255,0.04)' : `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                color: msg.sender === 'client' ? '#fff' : '#000',
                padding: '14px 20px',
                borderRadius: msg.sender === 'client' ? '4px 20px 20px 20px' : '20px 20px 4px 20px',
                boxShadow: msg.sender === 'client' ? '0 4px 15px rgba(0,0,0,0.1)' : `0 8px 25px ${accentColor}20`,
                position: 'relative',
                whiteSpace: 'pre-wrap',
                border: msg.sender === 'client' ? '1px solid rgba(255,255,255,0.05)' : 'none'
              }}>
                <p style={{ margin: 0, fontSize: '0.92rem', fontWeight: msg.sender === 'client' ? '400' : '500' }}>{msg.text}</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>{msg.time}</span>
                  {msg.sender !== 'client' && <span style={{ fontSize: '0.7rem' }}>✓✓</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input & Copilot (Glassmorphism) */}
        <div style={{ 
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
             <span style={{ fontSize: '0.75rem', fontWeight: '700', color: showCopilot ? accentColor : '#fff' }}>OpenAI Suggestions {showCopilot ? 'ON' : 'OFF'}</span>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '12px', opacity: 0.4 }}>
               <span style={{ fontSize: '1.2rem', cursor: 'pointer' }}>📎</span>
               <span style={{ fontSize: '1.2rem', cursor: 'pointer' }}>😊</span>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escreva sua mensagem profissional..." 
                style={{ 
                  width: '100%', 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid rgba(255,255,255,0.05)', 
                  padding: '14px 20px', 
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: '0.2s'
                }} 
                onFocus={(e) => e.target.style.border = `1px solid ${accentColor}`}
                onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.05)'}
              />
            </div>
            <button 
              onClick={handleSendMessage}
              style={{ 
                background: message.trim() ? accentColor : 'rgba(255,255,255,0.05)', 
                border: 'none', 
                width: '48px', 
                height: '48px', 
                borderRadius: '14px', 
                fontSize: '1.2rem', 
                color: '#000', 
                cursor: 'pointer',
                transition: '0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: message.trim() ? 1 : 0.5
              }}>
              ➤
            </button>
          </div>
        </div>

      </div>

      {/* PAINEL 3: INTEL (DEEP DARK) */}
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
             {selectedLead?.name.charAt(0)}
           </div>
           <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>{selectedLead?.name}</h3>
           <p style={{ fontSize: '0.75rem', opacity: 0.4, marginTop: '5px' }}>Lead Premium • São Paulo, BR</p>
        </div>

        <div style={{ padding: '25px 20px' }}>
           <div style={{ marginBottom: '30px' }}>
              <h4 style={{ fontSize: '0.7rem', fontWeight: '800', opacity: 0.4, letterSpacing: '0.1em', marginBottom: '15px' }}>CONTATO INTEL</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.65rem', opacity: 0.5, marginBottom: '4px' }}>TELEFONE</label>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: accentColor }}>+55 11 91318-8020</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.65rem', opacity: 0.5, marginBottom: '4px' }}>CANAL DE ENTRADA</label>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>WhatsApp Cloud Official</span>
                </div>
              </div>
           </div>

           <div>
              <h4 style={{ fontSize: '0.7rem', fontWeight: '800', opacity: 0.4, letterSpacing: '0.1em', marginBottom: '15px' }}>TAGS & SEGMENTOS</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                 <span style={{ background: 'rgba(0, 245, 255, 0.1)', color: accentColor, padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', border: `1px solid ${accentColor}33` }}>Vip Customer</span>
                 <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', border: '1px solid rgba(255,255,255,0.1)' }}>+ Adicionar</span>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
};

export default Chats;



