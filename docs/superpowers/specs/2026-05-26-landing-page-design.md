# Especificação de Design: Landing Page - Máquina Unificada de Marketing e Vendas

**Data:** 2026-05-26  
**Status:** Aprovado  
**Objetivo:** Criar uma Landing Page institucional de alta conversão integrada ao projeto de frontend do CRM, demonstrando o ciclo completo de atração (automação de redes sociais n8n) e conversão (CRM + WhatsApp AI Concierge).

---

## 1. Visão Geral
A Landing Page será integrada diretamente no projeto de frontend em React/Vite como uma página pública, acessível a partir da rota principal (`/` ou `/landing`). Ela utilizará o sistema de estilos premium do CRM (tema escuro, efeitos glassmorphism e bordas neon verde).

O objetivo principal da página é educar potenciais clientes e captar leads, demonstrando a potência do ecossistema Innova AI.

---

## 2. Arquitetura e Rotas

*   **Arquivo do Componente:** [Landing.jsx](file:///c:/Users/kamil/Projects/Plataforma%20CRM/frontend/src/pages/Landing.jsx) (Novo)
*   **Rota Pública:** `/landing` cadastrada em [App.jsx](file:///c:/Users/kamil/Projects/Plataforma%20CRM/frontend/src/App.jsx) redirecionando a página inicial pública para ela se o usuário não estiver logado.
*   **Responsividade:** Design Mobile-First, com animações suaves e redimensionamento adequado de imagens e cards em dispositivos móveis.

---

## 3. Estrutura do Layout (Dobra a Dobra)

### 3.1 Hero Section (Dobra 1)
*   **Conteúdo:**
    *   Logotipo da Innova AI no topo esquerdo.
    *   Botão "Entrar no CRM" no topo direito (redireciona para `/login`).
    *   Título (H1): *"Sua máquina autônoma de atração e vendas movida a Inteligência Artificial."*
    *   Subtítulo (P): *"O único ecossistema que posta conteúdos nas suas redes sociais para atrair leads e usa IA no WhatsApp para qualificar e fechar negócios 24/7."*
    *   Chamada para Ação (CTA Button): *"Quero Ver a Máquina em Ação"* (rolagem suave para a demonstração final).
*   **Visual:** Mockup 3D premium do painel do CRM com efeito de brilho verde-neon nas bordas, gerado via IA.

### 3.2 O Ciclo Autônomo (Dobra 2)
*   **Conteúdo:**
    *   Título (H2): *"Como funciona o ciclo de automação?"*
    *   Subtítulo (P): *"Quatro passos simples que transformam estranhos em clientes sem esforço operacional."*
    *   **Fluxograma Interativo:**
        1.  **Atração:** Robô n8n gera/posta Shorts no YouTube.
        2.  **Captura:** Cliente clica no link e cai no WhatsApp Oficial.
        3.  **Atendimento:** O Concierge IA atende, extrai dados e cria o cliente no banco.
        4.  **Fechamento:** O CRM atualiza o Kanban e agenda no Google Calendar.
*   **Visual:** Conectores visuais entre os quatro passos com animações de pulso de luz (Keyframe CSS) indicando o fluxo do lead.

### 3.3 Motor de Atração (Redes Sociais & Conteúdo) (Dobra 3)
*   **Conteúdo:**
    *   Título (H2): *"Atração Autônoma de Leads"*
    *   Subtítulo (P): *"Deixe a IA cuidar da consistência da sua presença digital."*
    *   **Cards de Recursos (Grid 3 Colunas):**
        *   *Postador de Shorts:* Demonstração visual do agendamento e postagem direta no YouTube.
        *   *Calendário de Conteúdo:* Mockup simplificado do calendário inteligente do CRM.
        *   *Gerador Multimídia:* Destaque para a integração do Imagen 3 e Veo 3 para criação instantânea de criativos para anúncios.
*   **Visual:** Cards premium 3D com efeito hover de elevação e brilho neon verde.

### 3.4 Motor de Vendas (CRM & Chat Híbrido) (Dobra 4)
*   **Conteúdo:**
    *   Título (H2): *"Vendas no Piloto Automático, Controle na sua Mão"*
    *   Subtítulo (P): *"Atendimento humano e IA integrados na mesma tela."*
    *   **Cards de Recursos (Grid 3 Colunas):**
        *   *Concierge GPT-4o:* O assistente inteligente que conversa de forma consultiva no WhatsApp.
        *   *Pausa de Intervenção Humana:* Demonstração do botão "Pausar IA" do CRM, garantindo que o vendedor humano tome o controle quando desejar.
        *   *Dashboard BI:* Gráficos de leads ativos e logs detalhados de consumo de API.
*   **Visual:** Animações interativas de balão de chat demonstrando o diálogo entre cliente, IA e Atendente.

### 3.5 Footer & CTA Final (Dobra 5)
*   **Conteúdo:**
    *   Título (H2): *"Pronto para automatizar suas vendas?"*
    *   Subtítulo (P): *"Clique abaixo para testar o nosso Concierge Inteligente em tempo real no WhatsApp."*
    *   Botão Principal (CTA): *"Testar Concierge no WhatsApp"* (Link de API do WhatsApp).
    *   Copyright e Links Institucionais.

---

## 4. Estilo Visual e Elementos UI
*   **Paleta de Cores:**
    *   Fundo: `#0a0b0d` (Deep Slate Black)
    *   Superfície: `#12151a` (Glassy Dark Grey)
    *   Acento Primário: `#22c55e` (Vibrant Green)
    *   Brilho Acento: `rgba(34, 197, 94, 0.4)` (Neon Green Glow)
*   **Tipografia:** `Inter` para leitura clara e títulos impactantes.
*   **Micro-animações:**
    *   Efeito Hover 3D nos cards.
    *   Pulso de luz no fluxograma do Ciclo.
    *   Efeito de texto digitando no exemplo de chat.

---

## 5. Plano de Verificação

### 5.1 Verificação Visual e Layout
*   Executar o servidor de desenvolvimento (`npm run dev`) e testar em múltiplas resoluções de tela utilizando o modo responsivo do navegador (DevTools).
*   Garantir compatibilidade cross-browser (Chrome, Safari, Edge, Firefox).

### 5.2 Verificação de Rotas e Navegação
*   Validar se o acesso à raiz (`/`) redireciona corretamente para `/landing` se o usuário não estiver logado.
*   Confirmar que o botão "Entrar no CRM" navega com sucesso para `/login`.
*   Testar a rolagem suave dos links âncora internos.
