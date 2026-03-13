# Especificação: tRPC + Next.js App Router

## 1. Visão Geral

Implementar tRPC como camada de API/backend integrada com Next.js 16 App Router, suportando Server Components, Client Components e SSR.

## 2. Stack

- `@trpc/server` - Core tRPC
- `@trpc/client` - Client tRPC
- `@trpc/tanstack-react-query` - Integração React Query
- `@tanstack/react-query` - React Query v5
- `zod` - Validação de schemas
- `server-only` / `client-only` - Proteção de imports
- `superjson` (opcional) - Serialização de dados

## 3. Estrutura de Arquivos

```
src/
├── trpc/
│   ├── init.ts              # initTRPC, context, helpers
│   ├── query-client.ts      # QueryClient factory
│   ├── client.tsx           # Provider para Client Components
│   ├── server.tsx           # Proxy para Server Components
│   └── routers/
│       └── _app.ts          # AppRouter principal
├── app/
│   └── api/trpc/[trpc]/
│       └── route.ts        # API route handler
└── app/
    └── layout.tsx           # Adicionar TRPCReactProvider
```

## 4. Especificação Técnica

### 4.1 Backend (init.ts)

```typescript
import { initTRPC } from '@trpc/server';
import { cache } from 'react';

export const createTRPCContext = cache(async () => {
  return { 
    // db, session, headers, etc
  };
});

const t = initTRPC.create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
```

### 4.2 Router (routers/_app.ts)

```typescript
import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => ({
      greeting: `Hello ${input.text}`,
    })),
});

export type AppRouter = typeof appRouter;
```

### 4.3 API Route (app/api/trpc/[trpc]/route.ts)

```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '../../../../trpc/init';
import { appRouter } from '../../../../trpc/routers/_app';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
```

### 4.4 Server Components (trpc/server.tsx)

```typescript
import 'server-only';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { cache } from 'react';
import { createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from './routers/_app';

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

export const caller = appRouter.createCaller(createTRPCContext());

export function HydrateClient({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
```

### 4.5 Client Components (trpc/client.tsx)

```typescript
'use client';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { makeQueryClient } from './query-client';
import type { AppRouter } from './routers/_app';

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient;

function getQueryClient() {
  if (typeof window === 'undefined') return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

function getUrl() {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [httpBatchLink({ url: `${getUrl()}/api/trpc` })],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
```

## 5. Uso

### Server Component (prefaching)

```typescript
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

export default async function Page() {
  prefetch(trpc.hello.queryOptions({ text: 'world' }));
  
  return (
    <HydrateClient>
      <ClientComponent />
    </HydrateClient>
  );
}
```

### Client Component

```typescript
'use client';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';

export function ClientComponent() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.hello.queryOptions({ text: 'world' }));
  return <div>{data?.greeting}</div>;
}
```

### Server Caller (dados no servidor)

```typescript
import { caller } from '@/trpc/server';

export default async function Page() {
  const result = await caller.hello({ text: 'world' });
  return <div>{result.greeting}</div>;
}
```

## 6. TO-DO

- [x] Instalar dependências: `@trpc/server`, `@trpc/client`, `@trpc/tanstack-react-query`, `@tanstack/react-query`, `zod`, `server-only`, `client-only`
- [x] Criar `src/trpc/init.ts`
- [x] Criar `src/trpc/query-client.ts`
- [x] Criar `src/trpc/routers/_app.ts`
- [x] Criar `src/app/api/trpc/[trpc]/route.ts`
- [x] Criar `src/trpc/server.tsx`
- [x] Criar `src/trpc/client.tsx`
- [x] Adicionar `TRPCReactProvider` em `src/app/layout.tsx`
- [x] Implementar procedimento `stats` para métricas
- [ ] Integrar FooterStats com tRPC + NumberFlow (implementado)
- [ ] Testar SSR/hydration (build OK)

## 7. Perguntas em Aberto

1. **Superjson para serialização?**
   - ✅观望 Decidir depois (opcional)

2. **Routers iniciais:**
   - ✅ submissions (create, get, list)
   - ✅ roasts (get by submission)
   - ✅ leaderboard (get rankings)

3. **Autenticação/Context?**
   - ✅ Sistema anónimo (sem auth)
