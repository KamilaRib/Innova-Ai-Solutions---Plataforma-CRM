import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  MessageSquare, 
  BarChart3, 
  Rocket, 
  Globe, 
  Palette, 
  Smartphone, 
  Monitor, 
  ChevronDown, 
  ChevronRight,
  ArrowRight,
  Bot,
  Layers,
  Cpu,
  LogIn,
  ChevronLeft,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Menu,
  X
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.title = 'Innova AI Solutions — Tecnologia que Transforma Negócios';
  }, []);

  const slides = [
    { img: '/carousel/IMAGEM 01.jpg', label: 'Transformação Digital & IA' },
    { img: '/carousel/IMAGEM 02.jpg', label: 'Análise de Dados em Tempo Real' },
    { img: '/carousel/IMAGEM 04.png', label: 'ROI & Métricas de Marketing Digital' },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);


  const services = [
    { 
      id: 1, 
      title: "Desenvolvimento Web com Automação", 
      desc: "Sites modernos integrados a CRM, formulários inteligentes e fluxos automatizados. Captamos leads e organizamos contatos enquanto você foca no seu negócio.",
      icon: <Rocket size={24} color="#22C55E" />
    },
    { 
      id: 2, 
      title: "UI/UX Design", 
      desc: "Interfaces modernas e intuitivas com foco em usabilidade, navegação clara e estética profissional. Transformamos visitantes em usuários engajados.",
      icon: <Palette size={24} color="#22C55E" />
    },
    { 
      id: 3, 
      title: "Desenvolvimento Web", 
      desc: "Sites responsivos, rápidos e seguros, construídos com tecnologias atualizadas. Plataformas otimizadas para crescer junto com o seu negócio.",
      icon: <Monitor size={24} color="#22C55E" />
    },
    { 
      id: 4, 
      title: "Desenvolvimento de Aplicativos", 
      desc: "Apps modernos, funcionais e intuitivos com foco em desempenho, usabilidade e escalabilidade. Conectamos sua marca ao seu público de forma prática.",
      icon: <Smartphone size={24} color="#22C55E" />
    },
    { 
      id: 5, 
      title: "Gestão de Redes Sociais", 
      desc: "Planejamento, criação de conteúdo e produção de vídeos com IA para fortalecer sua presença digital. Mais alcance, engajamento e relevância.",
      icon: <Globe size={24} color="#22C55E" />
    },
    { 
      id: 6, 
      title: "Automatização do WhatsApp", 
      desc: "Chatbots, respostas automáticas e fluxos inteligentes para captar leads e conduzir clientes pelo funil de vendas 24h por dia.",
      icon: <MessageSquare size={24} color="#22C55E" />
    },
    { 
      id: 7, 
      title: "RPA para Indústrias", 
      desc: "Automação de processos robóticos para ambientes industriais. Reduzimos erros, aumentamos a produtividade e liberamos sua equipe.",
      icon: <Cpu size={24} color="#22C55E" />
    },
    { 
      id: 8, 
      title: "Inteligência Artificial", 
      desc: "Implementação de sistemas autônomos que operam, aprendem e tomam decisões. Escale seu negócio sem multiplicar seus custos.",
      icon: <Bot size={24} color="#22C55E" />
    }
  ];

  const faqs = [
    { q: "O que é transformação digital de verdade?", a: "Transformação digital não é comprar software novo. É uma mudança profunda na forma como sua empresa pensa, opera e entrega valor. Envolve abandonar processos manuais e integrar tecnologia em todas as áreas." },
    { q: "Por que a mudança de cultura é o maior desafio?", a: "Porque tecnologia é fácil de instalar — mentalidade é difícil de transformar. Equipes acostumadas com planilhas e processos analógicos resistem naturalmente ao novo." },
    { q: "Como sair do analógico sem parar a operação?", a: "O segredo é a transição gradual e paralela. Não se abandona o analógico de uma vez — você constrói o digital ao lado, testa, valida e vai migrando por partes. Zero risco de parar a operação." },
    { q: "O que são sistemas travados e como eles prejudicam meu negócio?", a: "Sistemas travados são softwares legados que não se comunicam entre si, exigem intervenção manual constante e travam o crescimento da empresa. Eles criam silos de informação e aumentam erros." },
    { q: "O que são sistemas autônomos e por que contratar?", a: "Sistemas autônomos operam, aprendem e tomam decisões com mínima intervenção humana. Um CRM que qualifica leads automaticamente, um assistente que vende 24h. Escale sem contratar mais gente." },
    { q: "O que é automação de processos e como ela funciona na prática?", a: "Automação é fazer com que tarefas repetitivas aconteçam sozinhas. Um pedido entra → NF emitida → estoque atualizado → rastreio enviado → registrado no CRM. Tudo automático, em segundos." },
    { q: "Como a Inteligência Artificial transforma empresas na prática?", a: "Agentes de IA que respondem clientes com linguagem natural, algoritmos que preveem quais leads vão comprar, sistemas que geram relatórios em segundos. A IA amplia o que sua equipe consegue fazer." },
    { q: "Qual o roteiro para começar a transformação digital hoje?", a: "1. Diagnóstico → 2. Cultura → 3. Priorização → 4. Implantação → 5. Evolução. Aplicamos esse roteiro para garantir zero risco e ROI mensurável desde o primeiro sprint." },
    { q: "Quanto tempo até ver resultados reais?", a: "Com automações pontuais, os primeiros resultados aparecem em 30 dias. Uma transformação mais ampla gera impacto significativo em 3 a 6 meses. O importante é começar agora." },
    { q: "Minha empresa está pronta para a transformação digital?", a: "Nenhuma empresa está 100% pronta — e está tudo bem. Se sua empresa ainda usa planilhas para processos críticos ou perde tempo com retrabalho, você não está pronto, você está atrasado. Comece hoje." }
  ];

  return (
    <div id="home-top" className="home-container" style={{ backgroundColor: '#05070a', color: '#f8fafc', minHeight: '100vh', height: '100vh', overflowY: 'auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* HEADER / NAVBAR */}
      <header style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: isMobile ? '15px 20px' : '20px 60px', backdropFilter: 'blur(12px)', background: 'rgba(5, 7, 10, 0.7)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '12px', cursor: 'pointer' }} onClick={() => document.getElementById('home-top').scrollTo({ top: 0, behavior: 'smooth' })}>
          <div style={{ background: '#22C55E', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: '900', fontSize: '0.75rem' }}>AI</div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
            <span style={{ fontWeight: 'bold', fontSize: 'clamp(0.9rem, 4vw, 1.2rem)', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>INNOVA <span style={{ color: '#22C55E' }}>AI</span> SOLUTIONS</span>
            {!isMobile && <span style={{ color: '#22C55E', fontSize: '11px', fontWeight: '400', letterSpacing: '0.2px' }}>Transformação Digital & Automações Inteligentes</span>}
          </div>
        </div>

        {isMobile ? (
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        ) : (
          <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <button 
              onClick={() => navigate('/login')}
              style={{ 
                background: '#22C55E', border: 'none', color: '#000', 
                padding: '10px 22px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px', transition: '0.3s'
              }}
            >
              <LogIn size={16} />
              LOGIN
            </button>
          </nav>
        )}
      </header>

      {/* MOBILE MENU OVERLAY */}
      {isMobile && isMobileMenuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: '#05070a', display: 'flex', flexDirection: 'column',
          padding: '100px 30px', gap: '25px'
        }}>
          <button 
            onClick={() => navigate('/login')}
            style={{ 
              background: '#22C55E', border: 'none', color: '#000', 
              padding: '15px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: '800', width: '100%'
            }}
          >LOGIN</button>
        </div>
      )}

      {/* HERO CAROUSEL */}
      <section style={{ position: 'relative', width: '100%', height: isMobile ? '65vh' : '100vh', overflow: 'hidden' }}>
        {/* SLIDES */}
        {slides.map((slide, idx) => (
          <div 
            key={idx}
            style={{
              position: 'absolute', inset: 0, 
              backgroundImage: `url('${slide.img}')`,
              backgroundSize: isMobile ? 'contain' : 'cover', 
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: currentSlide === idx ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              backgroundColor: '#05070a'
            }}
          />
        ))}

        {/* DARK OVERLAY */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(5,7,10,0.4) 0%, rgba(5,7,10,0.1) 50%, rgba(5,7,10,0.6) 100%)' }} />

        {/* PREV / NEXT ARROWS */}
        {!isMobile && (
          <>
            <button onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)} style={{ position: 'absolute', left: '30px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, backdropFilter: 'blur(8px)' }}>
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextSlide} style={{ position: 'absolute', right: '30px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, backdropFilter: 'blur(8px)' }}>
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* SLIDE DOTS */}
        <div style={{ position: 'absolute', bottom: '35px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 20 }}>
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              style={{ width: currentSlide === idx ? '28px' : '8px', height: '8px', borderRadius: '4px', background: currentSlide === idx ? '#22C55E' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.3s ease' }}
            />
          ))}
        </div>
      </section>


      {/* SERVICES GRID */}
      <section id="servicos" style={{ padding: isMobile ? '60px 20px' : '100px 60px', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '70px', maxWidth: '800px', margin: '0 auto 70px auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 6vw, 2.5rem)', fontWeight: '900', lineHeight: '1.1', marginBottom: '20px' }}>
            Escolha a estratégia digital <span style={{ color: '#22C55E' }}>certa</span> para impulsionar o seu negócio
          </h2>
          <p style={{ opacity: 0.55, fontSize: 'clamp(0.85rem, 3.5vw, 1rem)', lineHeight: '1.6' }}>
            Nossas soluções foram desenvolvidas para atender diferentes necessidades empresariais. Avalie as opções disponíveis e identifique a que melhor se alinha aos objetivos, ao momento e à visão de crescimento da sua empresa.
          </p>
        </div>
        <div style={{ 
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '20px', maxWidth: '1200px', margin: '0 auto' 
        }}>
          {services.map(service => (
            <div key={service.id} style={{ 
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', 
              padding: '35px', borderRadius: '24px', transition: '0.3s', cursor: 'pointer'
            }} onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.2)';
            }} onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
            }}>
              <div style={{ marginBottom: '20px' }}>{service.icon}</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#fff' }}>{service.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section id="transformacao" style={{ 
        padding: isMobile ? '60px 20px' : '120px 60px', textAlign: 'center', 
        background: 'linear-gradient(180deg, transparent, rgba(34, 197, 94, 0.03), transparent)' 
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ fontSize: '0.65rem', color: '#22C55E', letterSpacing: '3px', marginBottom: '15px' }}>// POR QUE A INNOVA</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 8vw, 3rem)', fontWeight: '900', marginBottom: '25px', lineHeight: '1.05' }}>
            Sua transformação digital <span style={{ color: '#22C55E' }}>começa aqui</span>
          </h2>
          <p style={{ fontSize: '1rem', opacity: 0.65, marginBottom: '20px', lineHeight: '1.8' }}>
            Coloque sua empresa no próximo nível com soluções digitais que realmente fazem a diferença. 
            Na Innova AI Solutions, ajudamos você a modernizar processos, automatizar tarefas e criar 
            experiências que aproximam sua marca dos seus clientes.
          </p>
          <p style={{ fontSize: '1rem', opacity: 0.65, marginBottom: '50px', lineHeight: '1.8' }}>
            Comece hoje mesmo sua jornada de crescimento digital. Junte-se à Innova AI Solutions e 
            transforme a maneira como sua empresa se conecta, vende e evolui no mundo online.
          </p>
          <a 
            href="https://wa.me/5511915476392?text=Ol%C3%A1!%20Quero%20transformar%20meu%20neg%C3%B3cio%20com%20a%20Innova%20AI%20Solutions."
            target="_blank" rel="noopener noreferrer"
            style={{ 
              background: '#22C55E', color: '#fff', textDecoration: 'none',
              padding: '18px 45px', borderRadius: '50px', fontWeight: '900', fontSize: '1rem',
              display: 'inline-flex', alignItems: 'center', gap: '12px',
              boxShadow: '0 0 30px rgba(34, 197, 94, 0.3)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            FALAR NO WHATSAPP
          </a>
        </div>
      </section>


      {/* FAQ SECTION */}
      <section style={{ padding: isMobile ? '60px 20px' : '100px 60px', background: 'rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ fontSize: '0.7rem', color: '#22C55E', letterSpacing: '3px', marginBottom: '10px' }}>// DÚVIDAS FREQUENTES</div>
          <h2 style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: '900' }}>
            Tudo que você precisa <span style={{ color: '#22C55E' }}>saber</span>
          </h2>
          <p style={{ opacity: 0.5, marginTop: '10px', fontSize: '0.9rem' }}>Respondemos as perguntas mais comuns sobre nossos serviços, processos e formas de trabalho.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '850px', margin: '0 auto' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{ 
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', 
              borderRadius: '20px', overflow: 'hidden', transition: '0.3s all ease',
              borderLeft: activeFaq === idx ? '3px solid #22C55E' : '3px solid transparent'
            }}>
              <div 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                style={{ padding: '24px 30px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontWeight: '600', fontSize: '1rem', color: activeFaq === idx ? '#22C55E' : '#fff' }}>{faq.q}</span>
                <div style={{ transition: '0.3s transform ease', transform: activeFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  <ChevronDown size={20} color={activeFaq === idx ? "#22C55E" : "rgba(255,255,255,0.3)"} />
                </div>
              </div>
              <div style={{ 
                maxHeight: activeFaq === idx ? '500px' : '0',
                opacity: activeFaq === idx ? 1 : 0,
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: activeFaq === idx ? '0 30px 24px 30px' : '0 30px'
              }}>
                <div style={{ color: 'rgba(255,255,255,0.55)', lineHeight: '1.8', fontSize: '0.95rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: isMobile ? '60px 20px 30px 20px' : '70px 60px 30px 60px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1.2fr', gap: isMobile ? '40px' : '60px', maxWidth: '1200px', margin: '0 auto 60px auto' }}>
          {/* BRAND */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <div style={{ background: '#22C55E', color: '#000', padding: '2px 8px', borderRadius: '4px', fontWeight: '900', fontSize: '0.85rem' }}>AI</div>
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: '1px' }}>Innova <span style={{ color: '#22C55E' }}>AI</span> Solutions</span>
            </div>
            <p style={{ opacity: 0.4, fontSize: '0.85rem', lineHeight: '1.7', maxWidth: '280px' }}>Tecnologia inteligente para transformar o seu negócio e automatizar o seu futuro.</p>
            <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
              {[
                { 
                  label: 'IG', 
                  color: '#E4405F',
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>, 
                  url: 'https://www.instagram.com/innova_solutioons/' 
                },
                { 
                  label: 'FB', 
                  color: '#1877F2',
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>, 
                  url: 'https://web.facebook.com/Innovaaisolutions' 
                },
                { 
                  label: 'IN', 
                  color: '#0A66C2',
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>, 
                  url: 'https://www.linkedin.com/in/innova-ai-solutions-2389a7384/' 
                },
                { 
                  label: 'YT', 
                  color: '#FF0000',
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>, 
                  url: 'https://www.youtube.com/@InnovaAISolutionss' 
                }
              ].map(s => (
                <a 
                  key={s.label} 
                  href={s.url}
                  target={s.url !== '#' ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: '0.3s' }}
                  onMouseOver={e => { 
                    e.currentTarget.style.color = s.color; 
                    e.currentTarget.style.borderColor = s.color + '66'; 
                    e.currentTarget.style.background = s.color + '11'; 
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseOut={e => { 
                    e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; 
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; 
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; 
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
          {/* LINKS RÁPIDOS */}
          <div>
            <h4 style={{ fontSize: '0.7rem', letterSpacing: '2px', color: '#22C55E', marginBottom: '20px', textTransform: 'uppercase' }}>Links Rápidos</h4>
            {[
              { label: 'Política de Privacidade', path: '/privacy' },
              { label: 'Termos de Uso', path: '/terms' },
              { label: 'Política de Cookies', path: '/cookies' }
            ].map(link => (
              <div 
                key={link.label} 
                style={{ marginBottom: '12px', fontSize: '0.85rem', opacity: 0.5, cursor: 'pointer' }} 
                onClick={() => navigate(link.path)}
                onMouseOver={e => e.target.style.opacity = 1}
                onMouseOut={e => e.target.style.opacity = 0.5}
              >
                {link.label}
              </div>
            ))}
          </div>
          {/* CONTATO */}
          <div>
            <h4 style={{ fontSize: '0.7rem', letterSpacing: '2px', color: '#22C55E', marginBottom: '20px', textTransform: 'uppercase' }}>Contato & Escritório</h4>
            <div style={{ fontSize: '0.85rem', opacity: 0.5, marginBottom: '10px' }}>📱 +55 11 91547-6392</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.5, marginBottom: '10px' }}>✉️ contato@innovaaisolutions.com.br</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.5 }}>📍 Estrada do Campo Limpo, 560 — São Paulo, SP — Brasil</div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '30px', textAlign: 'center', fontSize: '0.8rem', opacity: 0.3 }}>
          © 2023 <span style={{ color: '#22C55E', opacity: 1 }}>Innova AI Solutions</span>. Todos os direitos reservados.
        </div>
      </footer>

      {/* BOTÃO FLUTUANTE WHATSAPP */}
      <a 
        href="https://wa.me/5511915476392?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20as%20solu%C3%A7%C3%B5es%20da%20Innova%20AI."
        target="_blank" rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          backgroundColor: '#25D366',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3), 0 0 20px rgba(37, 211, 102, 0.4)',
          zIndex: 9999,
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          cursor: 'pointer',
          textDecoration: 'none'
        }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4), 0 0 30px rgba(37, 211, 102, 0.6)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3), 0 0 20px rgba(37, 211, 102, 0.4)';
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
};

export default Home;
