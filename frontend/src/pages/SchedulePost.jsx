import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, LayoutTemplate, X, Edit3, Cloud } from 'lucide-react';

const IntegrationsModal = ({ onClose }) => {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px', margin: '20px', padding: 0 }}>
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <h3 style={{ margin: 0, color: '#fff' }}>Integrações</h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Conecte o Google Drive, Dropbox ou OneDrive para importar arquivos.</p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>
        
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {[
            { name: 'Google Drive', action: 'Conectar' },
            { name: 'Dropbox', action: 'Acessar' },
            { name: 'OneDrive', action: 'Conectar' }
          ].map(integration => (
            <div key={integration.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
                <Cloud size={20} /> {integration.name}
              </div>
              <button className="btn-primary" style={{ padding: '6px 16px', fontSize: '0.8rem' }}>{integration.action}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const brandColors = {
  'Instagram': '#E1306C',
  'Facebook': '#1877F2',
  'TikTok': '#00f2fe',
  'LinkedIn Pages': '#0A66C2',
  'LinkedIn Pessoal': '#0A66C2',
  'YouTube': '#FF0000',
  'Google Meu Negócio': '#4285F4',
  'Threads': '#FFFFFF',
  'Pinterest': '#E60023',
  'X': '#FFFFFF',
  'WhatsApp': '#25D366'
};

const SchedulePost = () => {
  const [postText, setPostText] = useState('');
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [hoveredChannel, setHoveredChannel] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('');
  const [showIntegrationsModal, setShowIntegrationsModal] = useState(false);

  const mockProfiles = [
    { id: '1', name: 'Innova AI Solutions' },
    { id: '2', name: 'Cliente B - Loja' },
    { id: '3', name: 'Agência (Interno)' }
  ];

  const toggleChannel = (channel) => {
    setSelectedChannels(prev => 
      prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '20px' }}>
      <div>
        <h1 style={{ color: 'var(--color-text-main)', marginBottom: '5px' }}>Agendar Post</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Crie e programe conteúdo para suas redes sociais.</p>
      </div>
      
      <div style={{ display: 'flex', flex: 1, gap: '24px' }}>
        {/* Coluna Esquerda - Formulário */}
        <div className="card" style={{ flex: 1, margin: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
           
           <div>
             <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-text-muted)', marginBottom: '10px' }}>1. Selecione perfis</label>
             <select 
               className="input-field" 
               value={selectedProfile} 
               onChange={(e) => setSelectedProfile(e.target.value)}
               style={{ maxWidth: '300px', cursor: 'pointer' }}
             >
               <option value="">Selecione um grupo ou perfil...</option>
               {mockProfiles.map(p => (
                 <option key={p.id} value={p.id}>{p.name}</option>
               ))}
             </select>
           </div>

           <div>
             <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-text-muted)', marginBottom: '10px' }}>2. Selecione canais</label>
             <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
               {[
                 'Instagram', 'Facebook', 'TikTok', 'LinkedIn Pages', 'LinkedIn Pessoal', 
                 'YouTube', 'Google Meu Negócio', 'Threads', 'Pinterest', 'X', 'WhatsApp'
               ].map(ch => {
                 const isSelected = selectedChannels.includes(ch);
                 const isHovered = hoveredChannel === ch;
                 const brandColor = brandColors[ch] || 'var(--color-accent)';
                 
                 return (
                   <button 
                     key={ch}
                     onClick={() => toggleChannel(ch)}
                     onMouseEnter={() => setHoveredChannel(ch)}
                     onMouseLeave={() => setHoveredChannel(null)}
                     style={{
                       padding: '8px 16px',
                       borderRadius: '8px',
                       fontWeight: 'bold',
                       fontSize: '0.85rem',
                       cursor: 'pointer',
                       transition: 'all 0.2s',
                       border: (isSelected || isHovered) ? `1px solid ${brandColor}` : '1px solid rgba(255,255,255,0.1)',
                       background: isSelected ? `${brandColor}20` : isHovered ? `${brandColor}10` : 'rgba(255,255,255,0.05)',
                       color: (isSelected || isHovered) ? brandColor : 'var(--color-text-muted)'
                     }}
                   >
                     {ch}
                   </button>
                 );
               })}
             </div>
           </div>

           <div>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
               <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-text-muted)' }}>3. Texto do post</label>
               <button style={{ 
                 display: 'flex', alignItems: 'center', gap: '5px', 
                 background: 'transparent', border: '1px solid var(--color-accent-cyan)', 
                 color: 'var(--color-accent-cyan)', borderRadius: '15px', 
                 padding: '4px 10px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' 
               }}>
                 Criar legenda - IA <Sparkles size={12} />
               </button>
             </div>
             <textarea
               className="input-field"
               style={{ minHeight: '180px', resize: 'vertical', lineHeight: '1.5' }}
               placeholder="Escreva sua legenda aqui..."
               value={postText}
               onChange={e => setPostText(e.target.value)}
             />
             <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '5px' }}>
               {postText.length} caracteres
             </div>
           </div>

           <div>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }}>
               <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-text-muted)' }}>4. Mídias (Imagens, vídeos ou documentos)</label>
               <div style={{ display: 'flex', gap: '8px' }}>
                 <button style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'transparent', border: '1px solid #f97316', color: '#f97316', borderRadius: '15px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>
                   <Edit3 size={12} /> Editor
                 </button>
                 <button style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '5px', background: 'linear-gradient(45deg, #FF0080, #7928CA)', border: 'none', color: '#fff', borderRadius: '15px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>
                   <Sparkles size={12} /> Gerar Mídia - IA
                   <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#FFB800', color: '#000', fontSize: '0.55rem', padding: '2px 4px', borderRadius: '4px', border: '1px solid #000' }}>EXPERTISE</span>
                 </button>
                 <button onClick={() => setShowIntegrationsModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#3b82f6', border: 'none', color: '#fff', borderRadius: '15px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>
                   Integrações <Cloud size={12} />
                 </button>
               </div>
             </div>
             <div style={{ 
               border: '2px dashed rgba(255,255,255,0.2)', 
               borderRadius: '12px', 
               padding: '40px 20px', 
               textAlign: 'center',
               background: 'rgba(0,0,0,0.2)',
               cursor: 'pointer',
               transition: 'all 0.3s'
             }}
             onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.background = 'rgba(0, 132, 255, 0.05)'; }}
             onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.background = 'rgba(0,0,0,0.2)'; }}
             >
               <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Arraste a imagem ou clique para fazer upload</p>
             </div>
           </div>

           <div>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
               <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-text-muted)' }}>5. Data e horário das publicações</label>
               <button style={{ 
                 display: 'flex', alignItems: 'center', gap: '5px', 
                 background: 'transparent', border: '1px solid var(--color-accent-cyan)', 
                 color: 'var(--color-accent-cyan)', borderRadius: '15px', 
                 padding: '4px 10px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' 
               }}>
                 Melhores horários - IA <Sparkles size={12} />
               </button>
             </div>
             <div style={{ display: 'flex', gap: '15px' }}>
               <input 
                 type="datetime-local" 
                 className="input-field"
                 style={{ flex: 1, maxWidth: '250px' }}
                 value={scheduleDate}
                 onChange={e => setScheduleDate(e.target.value)}
               />
             </div>
           </div>

           <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', gap: '15px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
             <button style={{ 
               padding: '10px 24px', 
               borderRadius: '10px', 
               background: 'rgba(255,255,255,0.1)', 
               color: '#fff', 
               border: 'none', 
               fontWeight: 'bold', 
               cursor: 'pointer' 
             }}>
               Salvar Rascunho
             </button>
             <button className="btn-primary">
               Agendar Agora
             </button>
           </div>
        </div>

        {/* Coluna Direita - Preview Interativo */}
        <div className="card" style={{ flex: 1, margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
           <div style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-text-muted)' }}>
             Preview do Celular
           </div>

           {/* Dispositivo Mobile (Mock) */}
           <div style={{
             width: '320px',
             height: '650px',
             background: '#fff',
             borderRadius: '35px',
             border: '10px solid #000',
             overflow: 'hidden',
             position: 'relative',
             boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
             display: 'flex',
             flexDirection: 'column'
           }}>
             
             {/* Notch */}
             <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', height: '25px', width: '120px', background: '#000', borderBottomLeftRadius: '15px', borderBottomRightRadius: '15px', zIndex: 10 }}></div>
             
             {/* Cabeçalho do App (Instagram fake) */}
             <div style={{ background: '#fff', padding: '40px 15px 15px', borderBottom: '1px solid #dbdbdb', zIndex: 0 }}>
               <span style={{ fontWeight: 'bold', color: '#000', fontSize: '1.2rem', fontFamily: 'sans-serif' }}>Instagram</span>
             </div>

             {/* Corpo do Feed */}
             <div style={{ flex: 1, background: '#fff', overflowY: 'auto' }}>
               
               {/* Cabeçalho do Post */}
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 15px' }}>
                 <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', padding: '2px' }}>
                   <div style={{ width: '100%', height: '100%', background: '#fff', borderRadius: '50%', border: '2px solid #fff' }}></div>
                 </div>
                 <span style={{ fontWeight: 'bold', color: '#000', fontSize: '0.9rem' }}>Sua Marca</span>
               </div>

               {/* Área da Imagem */}
               <div style={{ width: '100%', aspectRatio: '1/1', background: '#f0f0f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#999', borderTop: '1px solid #efefef', borderBottom: '1px solid #efefef' }}>
                 <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ marginBottom: '10px' }}>
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                 </svg>
                 Sem Imagem
               </div>

               {/* Ações (Curtir, Comentar) */}
               <div style={{ display: 'flex', gap: '15px', padding: '12px 15px', color: '#000' }}>
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
               </div>

               {/* Legenda em tempo real */}
               <div style={{ padding: '0 15px 20px', fontSize: '0.9rem', color: '#000' }}>
                 <span style={{ fontWeight: 'bold', marginRight: '8px' }}>Sua Marca</span>
                 <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                   {postText || "O texto do seu post aparecerá aqui no preview em tempo real..."}
                 </span>
               </div>
             </div>
           </div>
        </div>
      </div>
      {showIntegrationsModal && <IntegrationsModal onClose={() => setShowIntegrationsModal(false)} />}
    </div>
  );
};

export default SchedulePost;
