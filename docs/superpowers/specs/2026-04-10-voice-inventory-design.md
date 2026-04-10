# Documento de Arquitetura: Sistema de Estoque por Voz (WhatsApp)

## 1. Visão Geral do Projeto
Este projeto tem como objetivo construir um sistema de gestão de estoque no qual os usuários finais (funcionários) iteram através de comandos de voz em um número de WhatsApp exclusivo, sem precisar aprender plataformas novas. Por outro lado, a gestão do sistema visualiza os recursos e indicadores através de um Web Dashboard instalado em um domínio customizado que oferece um visual premium e gerencial.

## 2. Arquitetura Proposta

A arquitetura será dividida em 3 camadas principais:
1. **Interface de Interação (Frontend/Voz)**
2. **Orquestração e Inteligência (Middleware)**
3. **Persistência de Dados e Dashboard (Backend/UI)**

### 2.1 Interface de Interação
- **WhatsApp Cloud API**: Configuração de um número comercial dedicado do qual serão recebidos os comandos (mensagens de áudio/texto).
- **Tratamento Inicial**: O webhook do WhatsApp envia a notificação das mensagens em tempo real para o n8n.

### 2.2 Orquestração e Cérebro (n8n + OpenAI)
O n8n atuará como o middleware do ecossistema.
- **Transcrição de Voz**: O n8n extrai o arquivo de áudio recebido e o envia para a **API OpenAI Whisper** para convertê-lo em texto com precisão gramatical.
- **Interpretação e Function Calling**: O texto transcrito é enviado ao **OpenAI GPT-4o**. O LLM é instruído com o contexto do que é a empresa e possui funções mapeadas (*Function Calling*):
    - `adicionar_estoque(nomeProduto, quantidade)`
    - `remover_estoque(nomeProduto, quantidade)`
    - `consultar_estoque(nomeProduto)`
- **Execução Real**: Com base na resposta da IA, o n8n realiza a operação via API no Banco de Dados (ex: insere "adicionado 50 lâmpadas").
- **Resposta**: O n8n recebe o status de sucesso do banco, gera uma frase em linguagem natural via OpenAI ("Certo, adicionei 50 lâmpadas ao estoque") e envia devolta ao usuário via WhatsApp.

### 2.3 Persistência e Dashboard
- **Banco de Dados Relacional**: Postgres ou Supabase. Utilizado para armazenar produtos, histórico de transações e saldos consolidados.
- **Painel Administrativo (Web App)**:
    - Construído em tecnologias modernas (como Next.js ou Vite + React).
    - Tabelas e gráficos consumindo os dados diretamente e em tempo real do banco de dados.
    - Hospedado em um **domínio personalizado** para a cliente (ex: `estoque.nomedacliente.com.br`).
    - Autenticação e telas seguras e minimalistas.

## 3. Fluxo de Uso (User Story)

**Adicionando itens ao estoque**
1. O funcionário clica no botão de áudio no WhatsApp: *"Acabou de chegar uma remessa com 50 garrafas."*
2. Segundos depois, o bot no WhatsApp responde: *"Perfeito! 50 garrafas registradas. O nosso estoque atual é de 120 garrafas."*

**Acompanhamento pelo WebApp**
1. A Dona do negócio visualiza as transações atualizadas num Dashboard do seu celular/PC abrindo seu próprio link da web, sem ter encostado no WhatsApp.

## 4. Requisitos de Infraestrutura
- n8n Workflow Automation (Auto-hospedado ou Cloud).
- API Oficial de WhatsApp Cloud (Facebook Developer App).
- Conta de API OpenAI Billed (para Whisper, GPT-4 e eventual TTS).
- Um Backend as a Service ou Banco de Dados (Supabase/Postgres).
- Hospedagem para o Web App (Vercel ou similar).
- Compra de domínio.
