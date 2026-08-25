require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const buildDesc = ({ subtitle, problema, solucao, impacto, aplicacoes }) => `${subtitle}

O PROBLEMA
${problema}

A SOLUÇÃO INNOVA
${solucao}

O IMPACTO
${impacto}

APLICAÇÕES PRÁTICAS
${aplicacoes.map(a => `- ${a}`).join('\n')}`;

const produtos = [
  {
    name: 'IA & Automação',
    category: 'AUTOMAÇÃO',
    desc: buildDesc({
      subtitle: 'Agentes inteligentes, automação de processos e RPA',
      problema: 'Tarefas repetitivas e manuais que consomem tempo valioso da equipe, geram erros operacionais e limitam a capacidade de escala.',
      solucao: 'Desenvolvimento e implementação de agentes autônomos com Inteligência Artificial, automação robótica de processos (RPA) e fluxos integrados que executam rotinas com precisão 24 horas por dia.',
      impacto: 'Redução drástica de tempo gasto em operações manuais, eliminação de gargalos e aumento da capacidade produtiva sem necessidade de inchar a equipe.',
      aplicacoes: [
        'Agentes de IA para triagem e atendimento em linguagem natural',
        'Automação de rotinas administrativas, financeiras e operacionais (RPA)',
        'Processamento inteligente de documentos e dados',
        'Fluxos automatizados de notificação e follow-up'
      ]
    })
  },
  {
    name: 'CRM & Atendimento',
    category: 'CRM',
    desc: buildDesc({
      subtitle: 'Jornadas inteligentes, relacionamento e gestão de oportunidades',
      problema: 'Mensagens acumuladas no WhatsApp, contatos sem resposta rápida e oportunidades comerciais perdidas por falta de histórico e acompanhamento estruturado.',
      solucao: 'Estruturação de funis de atendimento omnichannel, implantação e customização de CRM com distribuição automática de conversas e regras de qualificação.',
      impacto: 'Tempo de primeira resposta reduzido para segundos, maior taxa de conversão de leads e visibilidade completa do funil de vendas.',
      aplicacoes: [
        'Centralização de canais de atendimento (WhatsApp, Web, Redes)',
        'Estruturação de funis de vendas e pós-venda no CRM',
        'Qualificação e direcionamento automático de leads para atendentes',
        'Histórico unificado de relacionamento e métricas de atendimento'
      ]
    })
  },
  {
    name: 'Software & Integrações',
    category: 'CONSULTORIA',
    desc: buildDesc({
      subtitle: 'Aplicações modernas, APIs e conexão entre plataformas',
      problema: 'Ferramentas legadas e sistemas que não conversam entre si, forçando a equipe a copiar e colar dados manualmente entre planilhas e softwares.',
      solucao: 'Criação de conectores, APIs seguras e desenvolvimento de sistemas sob medida para a realidade do seu negócio.',
      impacto: 'Fluxo contínuo de dados entre todas as ferramentas da empresa, com indicadores em tempo real para tomada de decisão ágil e segura.',
      aplicacoes: [
        'Integração entre ERPs, CRMs, gateways e ferramentas de marketing',
        'Desenvolvimento de aplicações web e portais operacionais',
        'Dashboards executivos com indicadores de performance em tempo real',
        'Modernização e evolução de sistemas existentes'
      ]
    })
  },
  {
    name: 'Dados & Inteligência',
    category: 'CONSULTORIA',
    desc: buildDesc({
      subtitle: 'Curadoria, qualidade e estruturação de dados para decisões, automações e Inteligência Artificial',
      problema: 'Dados duplicados, incompletos, despadronizados e espalhados entre planilhas, sistemas e diferentes fontes reduzem a confiabilidade das análises e dificultam automações, integrações e iniciativas de Inteligência Artificial.',
      solucao: 'Estruturamos processos de curadoria, organização, padronização, validação e integração de dados para aumentar sua qualidade e prepará-los para análises, dashboards, automações e aplicações de Inteligência Artificial.',
      impacto: 'Bases mais consistentes reduzem retrabalho, aumentam a confiabilidade das informações e criam uma fundação mais sólida para decisões, automações e projetos de IA.',
      aplicacoes: [
        'Curadoria e organização de dados',
        'Identificação de duplicidades e validação de consistência',
        'Integração de diferentes fontes de dados',
        'Estruturação de indicadores e apoio à criação de dashboards',
        'Limpeza e padronização de bases',
        'Classificação e estruturação de informações',
        'Preparação de dados para IA e Machine Learning',
        'Apoio à qualidade e governança de dados'
      ]
    })
  },
  {
    name: 'Marketing & Aquisição Digital',
    category: 'CONSULTORIA',
    desc: buildDesc({
      subtitle: 'Geração de demanda qualificada e conversão previsível',
      problema: 'Investimento em marketing sem previsibilidade de retorno, atração de contatos desqualificados e falta de conexão entre aquisição e operação.',
      solucao: 'Planejamento e execução de estratégias digitais estruturadas para atrair o perfil ideal de cliente, conectadas diretamente ao fluxo de atendimento e CRM.',
      impacto: 'Leads mais qualificados chegando aos canais comerciais, redução do custo por oportunidade e clareza no retorno sobre o investimento (ROI).',
      aplicacoes: [
        'Estratégias de atração focadas no público decisor B2B',
        'Automação de nutrição e régua de relacionamento',
        'Páginas de alta conversão integradas ao WhatsApp e CRM',
        'Acompanhamento de métricas de aquisição e custo por oportunidade'
      ]
    })
  }
];

async function main() {
  for (const p of produtos) {
    await prisma.product.create({
      data: {
        name: p.name,
        price: 0,
        category: p.category,
        desc: p.desc,
        image_url: ''
      }
    });
    console.log(`✅ Produto cadastrado: ${p.name}`);
  }
}

main()
  .catch(e => console.error('Erro:', e.message))
  .finally(() => prisma.$disconnect());
