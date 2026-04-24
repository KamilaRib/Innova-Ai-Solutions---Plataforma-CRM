import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const TermsOfUse = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Termos de Uso | Innova AI Solutions';
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
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '10px' }}>Termos de Uso</h1>

        <section style={{ marginBottom: '30px', color: 'rgba(255,255,255,0.7)' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '15px' }}>1. Aceitação dos Termos</h2>
          <p>
            Ao acessar ou utilizar a Plataforma CRM da Innova AI Solutions, bem como conectar suas contas de redes sociais 
            e serviços de mensageria (Meta, WhatsApp, etc.), você concorda em cumprir e estar vinculado a estes Termos de Uso.
          </p>
        </section>

        <section style={{ marginBottom: '30px', color: 'rgba(255,255,255,0.7)' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '15px' }}>2. Descrição do Serviço</h2>
          <p>
            Nossa plataforma oferece serviços de Automação, CRM e Inteligência Artificial. Fornecemos ferramentas para captura, 
            análise e gestão de leads por meio de conexões via API com os canais do Usuário.
          </p>
        </section>

        <section style={{ marginBottom: '30px', color: 'rgba(255,255,255,0.7)' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '15px' }}>3. Uso Adequado e Restrições</h2>
          <p>O usuário se compromete a:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
            <li>Não utilizar a plataforma para disseminar spam, mensagens ilícitas, abusivas ou que violem os termos de serviço das plataformas integradas (ex: Políticas do WhatsApp e Facebook).</li>
            <li>Garantir a veracidade e a titularidade dos dados que trafegam na plataforma.</li>
            <li>Não tentar descompilar, fazer engenharia reversa ou tentar obter o código-fonte da aplicação ou APIs conectadas.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '30px', color: 'rgba(255,255,255,0.7)' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '15px' }}>4. Contas de Terceiros e APIs</h2>
          <p>
            O serviço pode se conectar com plataformas de terceiros, como a Meta, OpenAI, n8n, etc. Ao usar nosso serviço, 
            você também concorda em cumprir os Termos e Condições dessas empresas terceiras naquilo que diz respeito 
            à troca contínua de mensagens. A Innova AI Solutions não se responsabiliza pelo bloqueio de contas nas plataformas terceiras por violação das suas diretrizes de envio.
          </p>
        </section>

        <section style={{ marginBottom: '30px', color: 'rgba(255,255,255,0.7)' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '15px' }}>5. Limitação de Responsabilidade</h2>
          <p>
            Em nenhuma circunstância a Innova AI Solutions será responsabilizada por lucros cessantes, perdas de vendas, 
            ou pela impossibilidade de usar nosso serviço decorrente de interrupções de APIs parceiras. Nosso serviço 
            é fornecido "no estado em que se encontra".
          </p>
        </section>

        <section style={{ marginBottom: '30px', color: 'rgba(255,255,255,0.7)' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '15px' }}>6. Modificação dos Termos</h2>
          <p>
            Reservamo-nos o direito de alterar estes Termos de Uso a qualquer momento. Modificações entrarão em vigor 
            mediante publicação em nosso site.
          </p>
        </section>
      </main>
      
      {/* FOOTER */}
      <footer style={{ padding: '30px 0', borderTop: '1px solid rgba(255, 255, 255, 0.05)', textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)' }}>
        © 2023 Innova AI Solutions. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default TermsOfUse;
