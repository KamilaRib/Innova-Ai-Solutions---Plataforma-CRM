import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Política de Privacidade | Innova AI Solutions';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ backgroundColor: '#05070a', color: '#f8fafc', minHeight: '100vh', height: '100vh', overflowY: 'auto', fontFamily: 'Inter, sans-serif' }}>
      {/* HEADER MINIMALISTA */}
      <header style={{ 
        position: 'sticky', top: 0, zIndex: 1000, 
        display: 'flex', alignItems: 'center', gap: '20px',
        padding: '20px 60px', backdropFilter: 'blur(12px)', background: 'rgba(5, 7, 10, 0.7)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={24} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ background: '#00F5FF', color: '#000', padding: '2px 8px', borderRadius: '4px', fontWeight: '900', fontSize: '0.85rem' }}>AI</div>
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '1px' }}>INNOVA</span>
        </div>
      </header>

      {/* CONTEUDO */}
      <main style={{ maxWidth: '800px', margin: '60px auto', padding: '0 30px', lineHeight: '1.8' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '10px' }}>Política de Privacidade</h1>

        <section style={{ marginBottom: '30px', color: 'rgba(255,255,255,0.7)' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '15px' }}>1. Introdução</h2>
          <p>
            A Innova AI Solutions ("nós", "nosso") respeita sua privacidade e está comprometida em proteger seus dados pessoais. 
            Esta Política de Privacidade explica como coletamos, usamos, divulgamos e guardamos suas informações quando você utiliza nosso site e serviços de automação (Plataforma CRM).
          </p>
        </section>

        <section style={{ marginBottom: '30px', color: 'rgba(255,255,255,0.7)' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '15px' }}>2. Informações que Coletamos</h2>
          <p>Podemos coletar e processar os seguintes dados:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
            <li><strong>Informações de Identificação Pessoal:</strong> Nome, endereço de e-mail, número de telefone (como seu WhatsApp).</li>
            <li><strong>Dados de Integração (Meta, Facebook, Instagram, WhatsApp):</strong> Para o funcionamento de nossos serviços de automação em IA, captamos fluxos de mensagens de acordo com os termos de uso das respectivas plataformas, com permissão expressa durante o login OAuth.</li>
            <li><strong>Dados de Uso:</strong> Informações técnicas sobre como você acessa nossa plataforma (IP, cookies, dispositivo).</li>
          </ul>
        </section>

        <section style={{ marginBottom: '30px', color: 'rgba(255,255,255,0.7)' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '15px' }}>3. Como Usamos as Informações</h2>
          <p>Utilizamos os dados coletados para:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
            <li>Fornecer, manter e melhorar nossos serviços (incluindo o Bot de IA e integrações).</li>
            <li>Atender obrigações contratuais (como enviar mensagens automáticas pré-configuradas no CRM).</li>
            <li>Monitorar e analisar o uso e tendências para melhorar a experiência do usuário.</li>
            <li>Cumprir obrigações legais e regulatórias.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '30px', color: 'rgba(255,255,255,0.7)' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '15px' }}>4. Compartilhamento de Dados</h2>
          <p>
            Não vendemos nem comercializamos suas informações pessoais. Podemos compartilhar informações estritamente necessárias 
            com provedores de serviços terceirizados (como provedores de hospedagem de nuvem, APIs de linguagem e os serviços da Meta) 
            apenas para a facilitação dos nossos serviços.
          </p>
        </section>

        <section style={{ marginBottom: '30px', color: 'rgba(255,255,255,0.7)' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '15px' }}>5. Seus Direitos</h2>
          <p>
            Você tem o direito de solicitar o acesso, correção ou exclusão dos seus dados pessoais. Para plataformas vinculadas (como exclusão de dados do Facebook), 
            você pode revogar o acesso a qualquer momento nas configurações do seu perfil social ou entrar em contato conosco para apagar definitivamente seu cadastro em nossa base.
          </p>
        </section>

        <section style={{ marginBottom: '30px', color: 'rgba(255,255,255,0.7)' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '15px' }}>6. Contato</h2>
          <p>Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato através de:</p>
          <p style={{ marginTop: '10px' }}><strong>E-mail:</strong> contato@innovaaisolutions.com.br</p>
          <p><strong>Telefone:</strong> +55 11 91547-6392</p>
        </section>
      </main>
      
      {/* FOOTER */}
      <footer style={{ padding: '30px 0', borderTop: '1px solid rgba(255, 255, 255, 0.05)', textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)' }}>
        © 2023 Innova AI Solutions. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
