# Design Spec: Módulo Clientes / CRM

**Data:** 2026-03-27
**Status:** Aprovado
**Objetivo:** Criar um módulo de gestão de clientes/empresas com visão hierárquica e integração com histórico n8n/Supabase.

## Arquitetura de Interface

### 1. Navegação
- Novo item no menu lateral principal: `CLIENTES` (Entre Dashboard e Kanban).
- Ícone: `Users` (Lucide-React).

### 2. Layout Hierárquico (Split View)
- **Esquerda (Sidebar interna):** Lista de Empresas captadas.
  - Campos: Nome da Empresa, CNPJ (pequeno).
  - Filtro de busca por nome.
- **Direita (Painel de Detalhes):** 
  - **Cabeçalho:** Nome da Empresa + Botão de edição geral.
  - **Dados da Empresa:** CNPJ, Endereço, Site, Setor (Editáveis).
  - **Responsável Comercial:** Agente associado, Cargo, Último contato (Editáveis).
  - **Histórico Inteligente:** Visualização estilo chat das perguntas feitas pelo Agente n8n e respostas salvas no Supabase.

## Fluxo de Dados
- **Manual:** Botão "+ Novo Cadastro" permite inserir empresa e responsável manualmente.
- **Automático:** Leads processados pelo n8n via WhatsApp preenchem o histórico e os dados básicos no Supabase, que são refletidos na interface.

## Tecnologias
- **Frontend:** React + Lucide Icons.
- **Estado:** React State para edição local (mockup inicial).
- **Integração:** Preparado para Supabase SDK.

## Próximos Passos
1. Criar componente `Clientes.jsx`.
2. Registrar rota `/app/clients` no `App.jsx`.
3. Adicionar menu no `ClientLayout.jsx`.
4. Implementar layout split-pane.
