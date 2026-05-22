# Sistema Clínica

Novo projeto SaaS multi-clínicas criado do zero em Next.js 15, TypeScript, TailwindCSS, Shadcn UI e Supabase.

## Stack

- Next.js 15 com App Router
- TypeScript em modo strict
- TailwindCSS com componentes no padrão Shadcn UI
- Supabase Auth, Database e RLS
- Deploy preparado para Vercel

## Rotas iniciais

- `/` página institucional do SaaS
- `/[clinicSlug]` landing page pública por clínica
- `/login` autenticação
- `/master` painel master
- `/app` painel da clínica
- `/app/clientes`
- `/app/agenda`
- `/app/procedimentos`
- `/app/profissionais`
- `/app/tarefas`
- `/app/financeiro`
- `/app/chat`
- `/api/whatsapp/webhook` reserva técnica para integração futura

## Configuração local

1. Instale as dependências:

```bash
npm install
```

2. Copie as variáveis:

```bash
cp .env.example .env.local
```

3. Preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

4. Rode o projeto:

```bash
npm run dev
```

## Supabase

A migration inicial está em `supabase/migrations/0001_initial_schema.sql` e contém:

- clínicas
- perfis
- clientes
- agenda
- procedimentos
- profissionais
- tarefas
- financeiro
- chat interno
- campos reservados para WhatsApp
- Row Level Security por clínica e perfil master

## Deploy na Vercel

Configure as mesmas variáveis de `.env.example` no projeto da Vercel. O arquivo `vercel.json` já define o framework Next.js.
