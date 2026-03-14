DevRoast - Código Aberto de Roast automation

Resumo rápido
- App web baseada em Next.js 16 com App Router, TypeScript e TailwindCSS.
- Persiste dados de submissões, roast e leaderboard em PostgreSQL via Drizzle ORM.
- Gera OG images dinamicamente via Takumi para cards de resultados compartilháveis.
- Usa IA para gerar feedback automático de código (Gemini via Google Generative AI).
- API interna via TRPC para consumo no frontend e server actions para mutations.
- Scripts de seed/migrations com drizzle-kit; Docker Compose para DB local.

Quem deve usar
- Desenvolvedores que queiram um fluxo rápido de avaliação de código com feedback automático e OG images prontos para redes sociais.

Arquitetura de alto nível
- Frontend: Next.js 16 App Router + React + TypeScript + Tailwind.
- Backend: Server Actions (mutations), TRPC (endpoints) e uma camada minimal de API baseada em SQL via Drizzle ORM.
- Persistência: PostgreSQL com Drizzle ORM (tabelas submissions, roasts, leaderboard).
- Geração de OG images: Takumi (ImageResponse) com rota dinâmica /result/[id]/image.
- IA: Gemini via Google Generative AI para geração de feedback e melhorias sugeridas.
- Infra: Docker Compose para banco local; scripts drizzle-kit para migrations/seeds.
- Observabilidade: logs simples via console; erros capturados com try/catch no fluxo de IA.

Stacks e tecnologias (o que faz o quê)
- Next.js 16 App Router: roteamento, SSR/SSG e APIs de backend com route handlers.
- React 18+: componentes funcionais, hooks (useState, useEffect), client/server components conforme necessidade.
- TypeScript: tipagem estática para actions, APIs e dados do DB.
- Tailwind CSS v4: estilização rápida com classes utilitárias; Tailwind Variants para variantes de componentes.
- Drizzle ORM (PostgreSQL): modelagem de schema com snake_case e query builder simples; elimina orquestração pesada de migrations.
- PostgreSQL: banco de dados relacional para submissions, roasts e leaderboard.
- Takumi (@takumi-rs/image-response): renderização de OG images a partir de JSX; suporta WebP/PNG/JPEG; utilizado para OG cards de resultados.
- Google Generative AI (Gemini): geração de feedback automático de código via API AI (quando chave disponível).
- TRPC: camada de API tipo-safe entre frontend e backend (client/server).\n+- Docker Compose: facilita rodar Postgres localmente para desenvolvimento sem instalar manualmente.
- Open Graph: metadata dinâmico para redes sociais via route image e generateMetadata.
- Lint/Format: Biome (lint/format) para manter consistência de código.

Estrutura do projeto (principais pastas e arquivos)
- src/app/:
  - layout.tsx: layout raiz com Navbar e provider TRPC.
  - page.tsx: homepage com CodeInput e widgets (leaderboard, stats).
  - actions.ts: server actions para mutações de código (submissões/roasts/leaderboard).
  - result/[id]/:
    - page.tsx: página de resultado detalhado (comuring open graph meta e dados reais).
    - image/route.tsx: rota OG image dinâmica gerada com Takumi.
  - components/: componentes de UI específicos da página (code-input, share-button, etc).
- src/db/:
  - index.ts: conexão com o DB via drizzle.
  - schema.ts: definicão das tabelas submissions, roasts, leaderboard.
  - seed.ts: seed de dados de exemplo.
- src/trpc/:
  - server.tsx, routers/*, cliente (client.tsx): API typesafe para frontend.
- docker-compose.yml: postgres 16-alpine para desenvolvimento local (porta 5434).
- next.config.ts: configuração do Next.js (serverExternalPackages para Takumi).
- .env (não commitado): DATABASE_URL, GOOGLE_API_KEY, etc.

APIs utilizadas e como foram usadas
- Banco de Dados (Drizzle ORM + PostgreSQL)
  - Tabelas: submissions, roasts, leaderboard.
  - Criação/atualização de registros via server actions (submitCode) e consultas diretas (db.execute, db.insert, db.select, db.update).
  - Conexão: src/db/index.ts usa drizzle com driver postgres-js e a URL de conexão via DATABASE_URL.
  - Seeds/migrations: drizzle-kit push, drizzle-kit studio, drizzle-kit migrate (quando aplicável).
- OG Image com Takumi
  - Rota: /result/[id]/image (route.tsx) gera ImageResponse com JSX para o OG card.
  - Open Graph: generateMetadata/headers atualizam via /result/[id]/image para redes sociais.
  - engine Takumi: usa @takumi-rs/image-response para renderizar a imagem (2x, 1200x630).
- IA de código (Gemini via Google Generative AI)
  - API: @google/generative-ai; host de Gemini para gerar score/feedback/improvements.
  - Fluxo: actions.ts -> generateFeedbackWithAI(code, language, roastMode) -> retorna score/feedback/improvements usados pelo frontend e DB.
- API interna (TRPC)
  - Client/Server TRPC: src/trpc/{client,server}.tsx; frontend usa TRPCReactProvider em layout.tsx; endpoints expostos via src/app/api/trpc/[trpc]/route.ts.
- UI e utilitários
  - UI: components/ui (button, card, code-block, etc) com Tailwind classes e tv variants.
  - Code highlighting: shiki para render de código no server (quando exibindo código com CodeBlock).
  - Vecas utilitárias: lucide-react para ícones; tailwind-merge para composição de classes; dotenv para variáveis de ambiente.

APIs e Pontos de Integração (visão prática)
- TRPC (API interna)
  - Endpoint base: /api/trpc
  - Fluxo: frontend chama via TRPC (appRouter) para obter stats (getLeaderboard / getStats)
  - Exemplo de uso no frontend:
    ```ts
    import { trpc } from '@/trpc/client'
    const { data } = trpc.stats.useQuery()
    ```
- Server Actions (execução de mutações)
  - submitCode(code, language, roastMode): persiste submissão e roast no DB; gera score/feedback/improvements via IA.
  - Retorno: { submissionId, roastId, score, feedback, improvements }
- DB com Drizzle ORM (PostgreSQL)
  - Tabelas: submissions, roasts, leaderboard
  - Operações: insert, select, update com db.execute/db.insert/db.select/db.update
- OG Image com Takumi
  - Rota OG: /result/[id]/image -> gera ImageResponse com JSX para OG card (2x, 1200x630)
- IA com Gemini (Google Generative AI)
  - Fluxo: Gemini gera score/feedback/improvements; utilizado em generateFeedbackWithAI em actions.ts
- Open Graph Metadata Dinâmico
  - generateMetadata para /result/[id] aponta para a imagem OG gerada dinamicamente

Diagrama de Fluxo (ASCII)
Cliente -> Next.js App Router -> TRPC/Server Actions -> DB (Drizzle) -> Takumi OG Image route
                     |---------------------------------------------------------|
                                  Open Graph metadata e OG image

Observabilidade, Deploy e Manutenção
- Ambiente local com Docker Compose (Postgres) e drizzle-kit para migrations/seeding
- Variáveis de ambiente: DATABASE_URL, GOOGLE_API_KEY etc.
- Build e deploy com Next.js (Vercel, Netlify, ou host semelhante)
- Checklist de produção: checar migrations, dados consistentes, chaves de IA seguras, URLs de OG image resolvidas

Como configurar e rodar localmente
