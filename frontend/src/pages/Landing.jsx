import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Users, Play, ShieldAlert, Cpu, Sparkles, MessageSquare, 
  Calendar, Video, Image, FileSpreadsheet, ArrowRight, UserCheck 
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  const handleWhatsAppClick = () => {
    // Simula link para testar o bot inteligente em produção
    window.open('https://wa.me/5500000000000?text=Quero%20testar%20o%20Concierge%20Inteligente', '_blank');
  };

  return (
    <div className="landing-container" style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', overflowY: 'auto' }}>
      <style>{`
        @media (max-width: 768px) {
          .landing-header {
            padding: 15px 20px !important;
          }
          .landing-hero-title {
            font-size: 2.2rem !important;
            line-height: 1.2 !important;
            letter-spacing: -1px !important;
          }
          .landing-hero-subtitle {
            font-size: 1rem !important;
            margin-bottom: 25px !important;
          }
          .landing-section-title {
            font-size: 1.7rem !important;
          }
          .landing-grid-split {
            gap: 30px !important;
          }
        }
      `}</style>

      {/* Header */}
      <header className="landing-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid var(--color-border)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0, cursor: 'pointer' }} onClick={() => navigate('/')}>
          INNOVA <span style={{ color: 'var(--color-accent-green)' }}>AI</span> <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 400, opacity: 0.6, marginLeft: '6px' }}>CRM</span>
        </h1>
        <button className="btn-primary" onClick={() => navigate('/login')}>Entrar no CRM</button>
      </header>

      {/* Hero Section */}
      <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '80px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '30px', fontSize: '0.8rem', color: 'var(--color-accent-green)', fontWeight: 600, marginBottom: '24px' }}>
          <Sparkles size={14} /> O Primeiro CRM do Mundo Controlado por Agentes IA n8n
        </div>
        <h1 className="landing-hero-title" style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-1.5px', marginBottom: '24px' }}>
          Sua máquina autônoma de <span style={{ color: 'var(--color-accent-green)' }}>atração e vendas</span> no WhatsApp.
        </h1>
        <p className="landing-hero-subtitle" style={{ fontSize: '1.15rem', color: 'var(--color-text-muted)', maxWidth: '700px', marginBottom: '40px', lineHeight: 1.6 }}>
          O único ecossistema que posta conteúdos virais nas suas redes sociais para atrair contatos e utiliza IA conversacional premium no WhatsApp para qualificar e fechar negócios 24/7.
        </p>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '60px' }}>
          <button className="btn-primary" style={{ fontSize: '0.85rem', padding: '16px 36px' }} onClick={handleWhatsAppClick}>
            Ver a Máquina em Ação <ArrowRight size={16} style={{ marginLeft: '8px', verticalAlign: 'middle', display: 'inline-block' }} />
          </button>
          <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.03)', color: '#fff', border: '1px solid var(--color-border)', boxShadow: 'none' }} onClick={() => navigate('/login')}>
            Acessar Painel
          </button>
        </div>
        
        {/* Mockup do CRM */}
        <div className="card" style={{ width: '100%', maxWidth: '850px', padding: '10px', background: '#0d1117', borderTop: '2px solid rgba(34, 197, 94, 0.4)', borderRadius: '20px', overflow: 'hidden' }}>
          <img src="/src/assets/hero.png" alt="CRM Dashboard Mockup" style={{ width: '100%', borderRadius: '12px', display: 'block' }} />
        </div>
      </section>

      {/* Dobra 2: Ciclo de Automação */}
      <section style={{ padding: '80px 20px', background: 'radial-gradient(circle at bottom, #12151a 0%, #0a0b0d 100%)', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className="landing-section-title" style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '16px' }}>O Ciclo Autônomo da Máquina</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '60px' }}>Como a IA da Innova substitui a operação repetitiva de ponta a ponta</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px', position: 'relative' }}>
            {/* Passo 1 */}
            <div className="card" style={{ flex: '1 1 220px', padding: '24px', margin: 0, textAlign: 'left', minHeight: '220px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent-green)', marginBottom: '20px' }}>
                <Video size={20} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '10px' }}>1. Atração Autônoma</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Nossos robôs do n8n criam e postam Shorts no YouTube de forma automática para trazer leads orgânicos.
              </p>
            </div>

            {/* Passo 2 */}
            <div className="card" style={{ flex: '1 1 220px', padding: '24px', margin: 0, textAlign: 'left', minHeight: '220px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent-green)', marginBottom: '20px' }}>
                <MessageSquare size={20} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '10px' }}>2. Entrada no WhatsApp</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                O lead engajado clica no link das redes sociais e cai diretamente no canal oficial do seu WhatsApp.
              </p>
            </div>

            {/* Passo 3 */}
            <div className="card" style={{ flex: '1 1 220px', padding: '24px', margin: 0, textAlign: 'left', minHeight: '220px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent-green)', marginBottom: '20px' }}>
                <Cpu size={20} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '10px' }}>3. Atendimento e CRM</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                A IA atende em linguagem natural, tira dúvidas, extrai CPF/E-mail e registra o cliente no CRM sozinho.
              </p>
            </div>

            {/* Passo 4 */}
            <div className="card" style={{ flex: '1 1 220px', padding: '24px', margin: 0, textAlign: 'left', minHeight: '220px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent-green)', marginBottom: '20px' }}>
                <Calendar size={20} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '10px' }}>4. Fechamento Agendado</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Se o cliente solicitar reunião, a IA agenda no seu Google Calendar e atualiza o Kanban para "Agendamento".
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dobra 3: Motor de Atração */}
      <section style={{ padding: '80px 20px', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="landing-grid-split" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '60px' }}>
            <div style={{ flex: '1 1 400px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-accent-green)', letterSpacing: '2px', marginBottom: '12px' }}>Geração de Conteúdo</div>
              <h2 className="landing-section-title" style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1.2, marginBottom: '24px' }}>IA que gera tráfego para sua marca.</h2>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '30px' }}>
                Esqueça a rotina estressante de publicar criativos. Nossa integração com o n8n e Google Vertex AI cria imagens fotorealistas, roteiriza descrições virais e posta no YouTube de forma automática.
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--color-accent-green)', display: 'inline-flex' }}><Sparkles size={16} /></span>
                  Automação de Uploads de YouTube Shorts agendados por IA.
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--color-accent-green)', display: 'inline-flex' }}><Sparkles size={16} /></span>
                  Integração com Google Imagen 3 e Veo 3 para peças visuais de anúncios.
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--color-accent-green)', display: 'inline-flex' }}><Sparkles size={16} /></span>
                  Calendário integrado para você planejar criativos visualmente.
                </li>
              </ul>
            </div>
            <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="card" style={{ display: 'flex', gap: '20px', alignItems: 'center', margin: 0, padding: '24px' }}>
                <Video size={24} style={{ color: 'var(--color-accent-green)', flexShrink: 0 }} />
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '4px' }}>YouTube Shorts Automático</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Cria copies inteligentes a partir de temas e agenda a postagem automática.</p>
                </div>
              </div>
              <div className="card" style={{ display: 'flex', gap: '20px', alignItems: 'center', margin: 0, padding: '24px' }}>
                <Image size={24} style={{ color: 'var(--color-accent-green)', flexShrink: 0 }} />
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '4px' }}>Multimídia Cloud (Imagen/Veo)</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Gerador de imagem e vídeo integrado ao painel principal.</p>
                </div>
              </div>
              <div className="card" style={{ display: 'flex', gap: '20px', alignItems: 'center', margin: 0, padding: '24px' }}>
                <Calendar size={24} style={{ color: 'var(--color-accent-green)', flexShrink: 0 }} />
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '4px' }}>Calendário de Conteúdo</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Visualização e gerenciamento simplificado das agendas sociais.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dobra 4: Motor de Vendas */}
      <section style={{ padding: '80px 20px', background: 'radial-gradient(circle at top right, #12151a 0%, #0a0b0d 100%)', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="landing-grid-split" style={{ display: 'flex', flexWrap: 'wrap-reverse', alignItems: 'center', gap: '60px' }}>
            <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="card" style={{ padding: '24px', margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-accent-green)' }}>CLIENTE VS CONCIERGE IA</span>
                  <span style={{ padding: '2px 8px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '4px', fontSize: '0.7rem', color: 'var(--color-accent-green)', fontWeight: 700 }}>LIVE</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '10px 14px', borderRadius: '12px', fontSize: '0.8rem', maxWidth: '80%' }}>
                    Olá, gostaria de saber o preço do plano profissional e se tem integração.
                  </div>
                  <div style={{ alignSelf: 'flex-end', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '10px 14px', borderRadius: '12px', fontSize: '0.8rem', maxWidth: '80%', color: '#fff' }}>
                    Olá! O plano Pro é R$ 299/mês. Sim, temos integração oficial n8n! Qual seu e-mail para eu te enviar a proposta formal?
                  </div>
                  <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '10px 14px', borderRadius: '12px', fontSize: '0.8rem', maxWidth: '80%' }}>
                    É comercial@empresa.com. Meu CNPJ é 12.345.678/0001-99.
                  </div>
                  <div style={{ alignSelf: 'flex-end', background: 'rgba(34, 197, 94, 0.2)', border: '1px solid var(--color-accent-green)', padding: '10px 14px', borderRadius: '12px', fontSize: '0.8rem', maxWidth: '80%', color: '#fff' }}>
                    ⚡ <em>IA cadastrou o CNPJ e moveu o lead para "Agendamento" no Kanban!</em>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-accent-green)', letterSpacing: '2px', marginBottom: '12px' }}>Vendas & Conversão</div>
              <h2 className="landing-section-title" style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1.2, marginBottom: '24px' }}>Atendimento híbrido de alta performance.</h2>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '30px' }}>
                Não perca vendas por atraso na resposta. A IA qualifica e captura informações fiscais automaticamente. E quando você precisar intervir, basta um clique no CRM para silenciar a automação e reassumir no WhatsApp.
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--color-accent-green)', display: 'inline-flex' }}><UserCheck size={16} /></span>
                  Pausa inteligente e reativação automática da IA ao intervir.
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--color-accent-green)', display: 'inline-flex' }}><UserCheck size={16} /></span>
                  Auto-preenchimento de contatos e cadastros via WhatsApp.
                  </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--color-accent-green)', display: 'inline-flex' }}><UserCheck size={16} /></span>
                  Painel Kanban atualizado de forma autônoma pela IA.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '100px 20px', textAlign: 'center', background: 'radial-gradient(circle, rgba(34, 197, 94, 0.05) 0%, transparent 80%)', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="landing-section-title" style={{ fontSize: '2.6rem', fontWeight: 900, marginBottom: '24px', letterSpacing: '-1px' }}>Pronto para colocar sua empresa no piloto automático?</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '40px', lineHeight: 1.6 }}>
            Teste a experiência real. Converse agora com o nosso robô demonstrativo no WhatsApp e sinta como ele capta dados e agenda compromissos na prática.
          </p>
          <button className="btn-primary" style={{ fontSize: '0.9rem', padding: '18px 40px' }} onClick={handleWhatsAppClick}>
            Falar com o Concierge IA no WhatsApp
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 20px', borderTop: '1px solid var(--color-border)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '20px' }}>
          <Link to="/login" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Login CRM</Link>
          <a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Suporte</a>
        </div>
        <p>© 2026 Innova AI Solutions. Todos os direitos reservados. Projeto White-Label CRM.</p>
      </footer>
    </div>
  );
}
