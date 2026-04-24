import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const CookiesPolicy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Política de Cookies | Innova AI Solutions';
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
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '10px' }}>Política de Cookies</h1>

        <section style={{ marginBottom: '30px', color: 'rgba(255,255,255,0.7)' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '15px' }}>1. O que são Cookies?</h2>
          <p>
            Cookies são pequenos arquivos de texto armazenados no seu dispositivo (computador, smartphone ou tablet) pelo navegador de internet quando você visita nosso site. 
            Eles permitem que o site se lembre de suas ações e preferências por um período de tempo, proporcionando uma experiência de navegação mais contínua e personalizada.
          </p>
        </section>

        <section style={{ marginBottom: '30px', color: 'rgba(255,255,255,0.7)' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '15px' }}>2. Como e Por Que Usamos Cookies</h2>
          <p>A Innova AI Solutions utiliza cookies para diversas finalidades, incluindo:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
            <li><strong>Cookies Estritamente Necessários:</strong> Essenciais para fazer o Plataforma CRM e o site funcionarem adequadamente. Incluem, por exemplo, cookies que permitem o acesso a áreas seguras do site ou controle de sessão de login.</li>
            <li><strong>Cookies de Autenticação (Sessão):</strong> Usados para manter as sessões iniciadas ativas (por exemplo, OAuth das plataformas conectadas como Facebook e n8n).</li>
            <li><strong>Cookies de Desempenho e Analytics:</strong> Nos ajudam a entender como os visitantes interagem com o site, fornecendo relatórios anonimizados sobre as métricas de tráfego, fontes e taxas de rejeição.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '30px', color: 'rgba(255,255,255,0.7)' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '15px' }}>3. Cookies de Terceiros e Integrações</h2>
          <p>
            Em alguns casos, também usamos cookies fornecidos por terceiros confiáveis. 
            Como este portal se conecta e oferece serviços de APIs da Meta, OpenAI e infraestruturas automatizadas web, recursos incorporados desses serviços também podem configurar cookies. Não temos controle sobre esses cookies de terceiros.
          </p>
        </section>

        <section style={{ marginBottom: '30px', color: 'rgba(255,255,255,0.7)' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '15px' }}>4. Gestão e Consentimento</h2>
          <p>
            Você pode impedir a configuração de cookies ajustando as configurações na maioria dos navegadores de internet. 
            No entanto, esteja ciente de que desativar alguns tipos de cookies ou os cookies estritamente necessários poderá afetar diretamente o funcionamento de partes da nossa plataforma CRM (ex: desconectá-lo da conta).
          </p>
        </section>

        <section style={{ marginBottom: '30px', color: 'rgba(255,255,255,0.7)' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '15px' }}>5. Dúvidas sobre Cookies?</h2>
          <p>Se tiver perguntas ou precisar de mais informações sobre nossa utilização de Cookies, entre em contato:</p>
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

export default CookiesPolicy;
