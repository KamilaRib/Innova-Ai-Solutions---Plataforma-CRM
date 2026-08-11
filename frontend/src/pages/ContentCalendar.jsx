import React, { useContext, useState, useEffect } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { Instagram, Facebook, Youtube, Share2, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus, Sparkles, X, Send, Filter, ChevronDown, List } from 'lucide-react';

const TikTokIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle' }}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-1.26-.88-2.22-2.19-2.68-3.64-.03 4.14-.02 8.28-.02 12.43-2.01 1.05-4.44 1.26-6.63.61-2.19-.65-4.17-2.31-5.18-4.38-1.01-2.07-1.01-4.63 0-6.7 1.01-2.07 2.99-3.73 5.18-4.38.74-.22 1.5-.3 2.26-.29V8.04c-.42-.05-.85-.06-1.27.02-1.31.25-2.51 1.06-3.23 2.2-.72 1.14-.88 2.53-.45 3.84.43 1.31 1.5 2.39 2.83 2.8.29.09.6.14.9.14 1.62-.05 3.14-1.22 3.63-2.76.04-.13.06-.27.07-.41V.02z" />
  </svg>
);

const ContentCalendar = () => {
    const { settings } = useContext(SettingsContext);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [idea, setIdea] = useState("");
    const [platform, setPlatform] = useState("instagram");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("10:00");
    const [tone, setTone] = useState("profissional");
    const [generatedContent, setGeneratedContent] = useState(null);
    const [scheduledPosts, setScheduledPosts] = useState([]); // Vazio para produção

    const [showStatusFilter, setShowStatusFilter] = useState(false);
    const [showChannelsFilter, setShowChannelsFilter] = useState(false);
    const [viewMode, setViewMode] = useState('calendar');

    // Filter states
    const allStatusList = ['Rascunho', 'Em pause', 'Publicados', 'Agendados', 'Não publicadas', 'Em aprovação', 'Para alteração'];
    const allChannelsList = ['Facebook', 'X', 'Instagram', 'Instagram Stories', 'LinkedIn Pages', 'YouTube', 'Pinterest', 'Facebook Stories', 'Google Meu Negócio', 'Reels', 'TikTok', 'Threads', 'WhatsApp'];
    
    const [selectedStatus, setSelectedStatus] = useState([...allStatusList]);
    const [selectedChannels, setSelectedChannels] = useState([...allChannelsList]);

    const handleStatusToggle = (status) => {
        if (status === 'Todos') {
            setSelectedStatus(selectedStatus.length === allStatusList.length ? [] : [...allStatusList]);
        } else {
            setSelectedStatus(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]);
        }
    };

    const handleChannelToggle = (channel) => {
        if (channel === 'Todos') {
            setSelectedChannels(selectedChannels.length === allChannelsList.length ? [] : [...allChannelsList]);
        } else {
            setSelectedChannels(prev => prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]);
        }
    };

    // Funções de Navegação
    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    // Lógica de Geração dos Dias
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    // Criar array de dias para o grid (incluindo espaços vazios do início)
    const calendarDays = [];
    // Dias do mês anterior para preencher o início
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
        calendarDays.push({ day: prevMonthDays - i, currentMonth: false });
    }
    // Dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push({ day: i, currentMonth: true });
    }
    // Completar até 35 ou 42 células (6 linhas)
    const remainingCells = 42 - calendarDays.length;
    for (let i = 1; i <= remainingCells; i++) {
        calendarDays.push({ day: i, currentMonth: false });
    }

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
                    caption: data.caption || `🚀 ${idea}\n\nLegenda gerada estrategicamente pela Innova IA.`,
                    hashtags: data.hashtags || "#inovacao #marketing #crm"
                });
            } else {
                setGeneratedContent({
                    caption: `🚀 ${idea}\n\nEste é um exemplo de legenda gerada para ${platform}.`,
                    hashtags: "#inovacao #marketing"
                });
            }
        } catch (error) {
            console.error(error);
            setGeneratedContent({
                caption: `🚀 ${idea}\n\nConteúdo gerado com sucesso.`,
                hashtags: "#crm #inovacao"
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSchedule = () => {
        alert("Post agendado com sucesso!");
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
                        <button className="btn-icon" style={{ padding: '8px' }} onClick={handlePrevMonth}><ChevronLeft size={20} /></button>
                        <div style={{ padding: '0 20px', display: 'flex', alignItems: 'center', fontWeight: '700', textTransform: 'capitalize', minWidth: '160px', justifyContent: 'center' }}>
                            {monthName} {year}
                        </div>
                        <button className="btn-icon" style={{ padding: '8px' }} onClick={handleNextMonth}><ChevronRight size={20} /></button>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center', margin: '0 10px' }}>
                        <button 
                            onClick={() => setViewMode('list')} 
                            style={{ background: 'transparent', border: 'none', color: viewMode === 'list' ? 'var(--color-accent-green)' : 'var(--color-text-muted)', cursor: 'pointer', padding: '5px', borderBottom: viewMode === 'list' ? '2px solid var(--color-accent-green)' : '2px solid transparent' }}
                        >
                            <List size={20} />
                        </button>
                        <button 
                            onClick={() => setViewMode('calendar')} 
                            style={{ background: 'transparent', border: 'none', color: viewMode === 'calendar' ? 'var(--color-accent-green)' : 'var(--color-text-muted)', cursor: 'pointer', padding: '5px', borderBottom: viewMode === 'calendar' ? '2px solid var(--color-accent-green)' : '2px solid transparent' }}
                        >
                            <CalendarIcon size={20} />
                        </button>
                    </div>

                    <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} />
                        <span>Novo Post</span>
                    </button>
                </div>
            </header>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ display: 'flex', gap: '10px', position: 'relative' }}>
                    <button type="button" style={{ display: 'flex', gap: '5px', alignItems: 'center', fontSize: '0.75rem', fontWeight: 'bold', background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                       Filtros:
                    </button>
                    
                    <div style={{ position: 'relative' }}>
                        <button type="button" onClick={() => {setShowStatusFilter(!showStatusFilter); setShowChannelsFilter(false);}} style={{ display: 'flex', gap: '5px', alignItems: 'center', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid #f97316', color: '#f97316', background: 'rgba(249, 115, 22, 0.1)', padding: '4px 10px', borderRadius: '15px', cursor: 'pointer' }}>
                           <Plus size={14} /> Status <ChevronDown size={14} />
                        </button>
                        {showStatusFilter && (
                            <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '5px', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', width: '220px', zIndex: 50, color: '#fff', padding: '15px' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Status do post</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto', paddingRight: '5px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', cursor: 'pointer', opacity: 0.8 }}>
                                        <input type="checkbox" checked={selectedStatus.length === allStatusList.length} onChange={() => handleStatusToggle('Todos')} style={{ accentColor: 'var(--color-accent-green)', cursor: 'pointer' }} /> Todos
                                    </label>
                                    {allStatusList.map(s => (
                                        <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', cursor: 'pointer', opacity: 0.8 }}>
                                            <input type="checkbox" checked={selectedStatus.includes(s)} onChange={() => handleStatusToggle(s)} style={{ accentColor: 'var(--color-accent-green)', cursor: 'pointer' }} /> {s}
                                        </label>
                                    ))}
                                </div>
                                <button type="button" className="btn-primary" onClick={() => setShowStatusFilter(false)} style={{ width: '100%', marginTop: '15px', padding: '8px', fontSize: '0.8rem' }}>Aplicar</button>
                            </div>
                        )}
                    </div>

                    <div style={{ position: 'relative' }}>
                        <button type="button" onClick={() => {setShowChannelsFilter(!showChannelsFilter); setShowStatusFilter(false);}} style={{ display: 'flex', gap: '5px', alignItems: 'center', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid #3b82f6', color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', padding: '4px 10px', borderRadius: '15px', cursor: 'pointer' }}>
                           <Share2 size={14} /> Canais <ChevronDown size={14} />
                        </button>
                        {showChannelsFilter && (
                            <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '5px', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', width: '250px', zIndex: 50, color: '#fff', padding: '15px' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Selecionar canais</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto', paddingRight: '5px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', cursor: 'pointer', opacity: 0.8 }}>
                                        <input type="checkbox" checked={selectedChannels.length === allChannelsList.length} onChange={() => handleChannelToggle('Todos')} style={{ accentColor: 'var(--color-accent-green)', cursor: 'pointer' }} /> Todos
                                    </label>
                                    {allChannelsList.map(c => (
                                        <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', cursor: 'pointer', opacity: 0.8 }}>
                                            <input type="checkbox" checked={selectedChannels.includes(c)} onChange={() => handleChannelToggle(c)} style={{ accentColor: 'var(--color-accent-green)', cursor: 'pointer' }} /> {c}
                                        </label>
                                    ))}
                                </div>
                                <button type="button" className="btn-primary" onClick={() => setShowChannelsFilter(false)} style={{ width: '100%', marginTop: '15px', padding: '8px', fontSize: '0.8rem' }}>Aplicar</button>
                            </div>
                        )}
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem', opacity: 0.6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1877F2' }}></div> Facebook</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E1306C' }}></div> Instagram</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E' }}></div> TikTok</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF0000' }}></div> YouTube</div>
                </div>
            </div>

            {viewMode === 'calendar' ? (
                <div style={{ 
                    flex: 1, 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(7, 1fr)', 
                    gridTemplateRows: 'auto repeat(6, 1fr)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.02)'
                }}>
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                        <div key={day} style={{ 
                            padding: '12px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '800', 
                            opacity: 0.4, textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.05)',
                            background: 'rgba(255,255,255,0.03)'
                        }}>
                            {day}
                        </div>
                    ))}

                    {calendarDays.map((d, i) => {
                        const isToday = d.currentMonth && d.day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                        const dayPosts = scheduledPosts.filter(p => p.day === d.day && d.currentMonth);

                        return (
                            <div key={i} style={{ 
                                padding: '10px', 
                                borderRight: '1px solid rgba(255,255,255,0.05)', 
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                opacity: d.currentMonth ? 1 : 0.15,
                                backgroundColor: isToday ? 'rgba(0, 245, 255, 0.03)' : 'transparent',
                                minHeight: '100px',
                                display: 'flex', flexDirection: 'column', gap: '6px'
                            }}>
                                <div style={{ 
                                    fontSize: '0.85rem', fontWeight: isToday ? '900' : '400',
                                    color: isToday ? 'var(--color-accent-cyan)' : 'inherit'
                                }}>
                                    {d.day}
                                </div>

                                {dayPosts.map(post => (
                                    <div key={post.id} style={{
                                        background: `${post.color}15`, borderLeft: `3px solid ${post.color}`,
                                        padding: '6px 8px', borderRadius: '4px', cursor: 'pointer',
                                        display: 'flex', flexDirection: 'column', gap: '2px'
                                    }}>
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
            ) : (
                <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '40px' }}>
                        <List size={40} style={{ opacity: 0.3, marginBottom: '10px', margin: '0 auto' }} />
                        <p>Nenhum post agendado para exibir na visualização em lista.</p>
                    </div>
                </div>
            )}

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
