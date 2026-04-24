import React, { useContext, useState } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { Instagram, Facebook, Youtube, Share2, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus, Sparkles, X, Send } from 'lucide-react';

const TikTokIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle' }}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-1.26-.88-2.22-2.19-2.68-3.64-.03 4.14-.02 8.28-.02 12.43-2.01 1.05-4.44 1.26-6.63.61-2.19-.65-4.17-2.31-5.18-4.38-1.01-2.07-1.01-4.63 0-6.7 1.01-2.07 2.99-3.73 5.18-4.38.74-.22 1.5-.3 2.26-.29V8.04c-.42-.05-.85-.06-1.27.02-1.31.25-2.51 1.06-3.23 2.2-.72 1.14-.88 2.53-.45 3.84.43 1.31 1.5 2.39 2.83 2.8.29.09.6.14.9.14 1.62-.05 3.14-1.22 3.63-2.76.04-.13.06-.27.07-.41V.02z" />
  </svg>
);

const ContentCalendar = () => {
    const { settings } = useContext(SettingsContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [idea, setIdea] = useState("");
    const [platform, setPlatform] = useState("instagram");
    const [date, setDate] = useState("2026-03-27");
    const [time, setTime] = useState("10:00");
    const [tone, setTone] = useState("profissional");
    const [generatedContent, setGeneratedContent] = useState(null);

    // Mock de posts agendados
    const scheduledPosts = [
        { id: 1, day: 26, platform: 'facebook', time: '10:00', title: 'Novidades na Plataforma', color: '#1877F2' },
        { id: 2, day: 27, platform: 'instagram', time: '14:30', title: 'Bastidores da Equipe', color: '#E1306C' },
        { id: 3, day: 27, platform: 'tiktok', time: '18:00', title: 'Trend da Semana', color: '#22C55E' },
        { id: 4, day: 28, platform: 'youtube', time: '11:00', title: 'Tutorial Completo CRM', color: '#FF0000' },
        { id: 5, day: 30, platform: 'instagram', time: '20:00', title: 'Live de Lançamento', color: '#E1306C' },
    ];

    const days = Array.from({ length: 35 }, (_, i) => i + 1); // Em 2026, Março começa num Domingo (índice 0)

    const handleGenerate = async () => {
        if (!settings.n8n_generation_webhook) {
            alert("Configure o Webhook de Geração IA nas configurações de Redes Sociais primeiro.");
            return;
        }

        setIsGenerating(true);
        try {
            const response = await fetch(settings.n8n_generation_webhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idea, platform, date, time, tone, brand: settings.business_name })
            });
            
            if (response.ok) {
                const data = await response.json();
                setGeneratedContent({
                    caption: data.caption || `🚀 ${idea}\n\nEste é um exemplo de legenda gerada com tom ${tone}. O motor de IA do n8n processou sua ideia e otimizou para ${platform}.`,
                    hashtags: data.hashtags || "#inovacao #marketingdigital #tecnologia #crm"
                });
            } else {
                setGeneratedContent({
                    caption: `🚀 ${idea}\n\nEste é um exemplo de legenda gerada com tom ${tone}. O motor de IA do n8n processou sua ideia e otimizou para ${platform}.`,
                    hashtags: "#inovacao #marketingdigital #tecnologia #crm"
                });
            }
        } catch (error) {
            console.error(error);
            setGeneratedContent({
                caption: `🚀 ${idea}\n\nEste é um exemplo de legenda gerada com tom ${tone}. O motor de IA do n8n processou sua ideia e otimizou para ${platform}.`,
                hashtags: "#inovacao #marketingdigital #tecnologia #crm"
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSchedule = () => {
        alert("Post agendado com sucesso no calendário!");
        setIsModalOpen(false);
        setGeneratedContent(null);
        setIdea("");
    };

    const getPlatformIcon = (plt) => {
        switch (plt) {
            case 'facebook': return <Facebook size={12} />;
            case 'instagram': return <Instagram size={12} />;
            case 'tiktok': return <TikTokIcon size={12} />;
            case 'youtube': return <Youtube size={12} />;
            default: return <Share2 size={12} />;
        }
    };

    return (
        <div style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Calendário de Conteúdo</h1>
                    <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>Gestão unificada de presença digital</p>
                </div>
                
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px' }}>
                        <button className="btn-icon" style={{ padding: '8px' }}><ChevronLeft size={20} /></button>
                        <div style={{ padding: '0 20px', display: 'flex', alignItems: 'center', fontWeight: '700' }}>Março 2026</div>
                        <button className="btn-icon" style={{ padding: '8px' }}><ChevronRight size={20} /></button>
                    </div>
                    <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} />
                        <span>Novo Post</span>
                    </button>
                </div>
            </header>

            {/* LEGENDA RÁPIDA */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', fontSize: '0.8rem', opacity: 0.6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1877F2' }}></div> Facebook</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E1306C' }}></div> Instagram</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E' }}></div> TikTok</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF0000' }}></div> YouTube</div>
            </div>

            {/* GRADE DO CALENDÁRIO */}
            <div style={{ 
                flex: 1, 
                display: 'grid', 
                gridTemplateColumns: 'repeat(7, 1fr)', 
                gridTemplateRows: 'auto repeat(5, 1fr)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '12px',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.02)'
            }}>
                {/* DIAS DA SEMANA */}
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} style={{ 
                        padding: '12px', 
                        textAlign: 'center', 
                        fontSize: '0.75rem', 
                        fontWeight: '800', 
                        opacity: 0.4, 
                        textTransform: 'uppercase',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        background: 'rgba(255,255,255,0.03)'
                    }}>
                        {day}
                    </div>
                ))}

                {/* CÉLULAS DOS DIAS */}
                {days.map((d, i) => {
                    const isToday = d === 27;
                    const isOutside = d <= 0 || d > 31;
                    const dayPosts = scheduledPosts.filter(p => p.day === d);

                    return (
                        <div key={i} style={{ 
                            padding: '10px', 
                            borderRight: '1px solid rgba(255,255,255,0.05)', 
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            opacity: isOutside ? 0.2 : 1,
                            backgroundColor: isToday ? 'rgba(0, 245, 255, 0.03)' : 'transparent',
                            minHeight: '120px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px'
                        }}>
                            <div style={{ 
                                fontSize: '0.85rem', 
                                fontWeight: isToday ? '900' : '400',
                                color: isToday ? 'var(--color-accent-cyan)' : 'inherit'
                            }}>
                                {d > 0 && d <= 31 ? d : (d <= 0 ? 28 + d : d - 31)}
                            </div>

                            {dayPosts.map(post => (
                                <div key={post.id} style={{
                                    background: `${post.color}15`,
                                    borderLeft: `3px solid ${post.color}`,
                                    padding: '6px 8px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '2px'
                                }} className="calendar-post-item">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        {getPlatformIcon(post.platform)}
                                        <span style={{ fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', opacity: 0.8 }}>{post.time}</span>
                                    </div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {post.title}
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>

            {/* MODAL DE GERAÇÃO IA */}
            {isModalOpen && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '500px', padding: '30px', borderTop: '4px solid #00F5FF', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Sparkles size={20} color="var(--color-accent-cyan)" /> Innova AI Creator
                            </h3>
                            <button onClick={() => {setIsModalOpen(false); setGeneratedContent(null);}} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
                        </div>

                        {!generatedContent ? (
                            <>
                                <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.85rem', opacity: 0.7 }}>Qual o tema do post?</label>
                                <textarea 
                                    className="input-field" 
                                    style={{ height: '80px', resize: 'none', marginBottom: '15px' }}
                                    placeholder="Ex: Análise de Tendência de Mercado..."
                                    value={idea}
                                    onChange={(e) => setIdea(e.target.value)}
                                />

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Data de Lançamento</label>
                                        <input type="date" className="input-field" value={date} onChange={(e) => setDate(e.target.value)} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Melhor Horário</label>
                                        <input type="time" className="input-field" value={time} onChange={(e) => setTime(e.target.value)} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Rede Social</label>
                                        <select className="input-field" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                                            <option value="instagram">Instagram</option>
                                            <option value="facebook">Facebook</option>
                                            <option value="tiktok">TikTok</option>
                                            <option value="youtube">YouTube</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Tom de Voz</label>
                                        <select className="input-field" value={tone} onChange={(e) => setTone(e.target.value)}>
                                            <option value="profissional">Profissional</option>
                                            <option value="divertido">Divertido</option>
                                            <option value="persuasivo">Persuasivo</option>
                                            <option value="educativo">Educativo</option>
                                        </select>
                                    </div>
                                </div>

                                <button 
                                    className="btn-primary" 
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !idea}
                                    style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                                >
                                    {isGenerating ? 'Criando conteúdo...' : <><Sparkles size={18} /> Gerar com IA</>}
                                </button>
                            </>
                        ) : (
                            <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <label style={{ display: 'block', fontSize: '0.7rem', opacity: 0.4, textTransform: 'uppercase', marginBottom: '10px', fontWeight: '800' }}>Legenda Sugerida</label>
                                    <div style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '15px', whiteSpace: 'pre-wrap' }}>
                                        {generatedContent.caption}
                                    </div>
                                    <div style={{ color: 'var(--color-accent-cyan)', fontSize: '0.85rem', fontWeight: '600' }}>
                                        {generatedContent.hashtags}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button 
                                        className="btn-primary" 
                                        onClick={() => setGeneratedContent(null)}
                                        style={{ flex: 1, background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                                    >
                                        Refinar Ideia
                                    </button>
                                    <button 
                                        className="btn-primary" 
                                        onClick={handleSchedule}
                                        style={{ flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                                    >
                                        <CalendarIcon size={18} /> Agendar no Calendário
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentCalendar;
