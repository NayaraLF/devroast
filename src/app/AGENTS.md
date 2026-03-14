# Padrões de App Router (src/app/)

## Estrutura de Arquivos

```
src/app/
├── actions.ts              # Server Actions (global)
├── layout.tsx             # Root layout
├── page.tsx               # Homepage
├── globals.css            # Tailwind theme
├── leaderboard/
│   └── page.tsx           # Leaderboard page (SSR)
└── result/[id]/
    └── page.tsx           # Result page com UUID dinâmico
```

## Server Actions

### Padrão de Implementação

```ts
// src/app/actions.ts
"use server";

import { db } from "@/db";
import { submissions, roasts, leaderboard } from "@/db/schema";

export async function submitCode({
  code,
  language,
  roastMode,
}: {
  code: string;
  language: string;
  roastMode: boolean;
}) {
  // Lógica de negócio
  // Retornar dados tipados
  return {
    submissionId: string;
    score: string;
    feedback: string;
    improvements: string[];
  };
}
```

### Regras

- Usar `"use server"` no topo do arquivo
- Tipar inputs e retornos
- Usar para operações de banco (CRUD)
- Não usar para mutations complexas que requerem client state

## Pages

### Server Components (Padrão)

```ts
// src/app/leaderboard/page.tsx
export default async function LeaderboardPage() {
  // Fetch data diretamente no componente (SSR)
  const data = await getLeaderboard();
  
  return (
    <div>
      {/* Render */}
    </div>
  );
}
```

### Client Components

```ts
// src/components/code-input.tsx
"use client";

export function CodeInputSection() {
  const [code, setCode] = useState("");
  // Estado client-side
}
```

## Dynamic Routes

###Parâmetro UUID

```ts
// src/app/result/[id]/page.tsx
export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // id é UUID
}
```

## Boas Práticas

1. **SSR para páginas públicas** - Melhor indexação SEO
2. **Server Actions para mutations** - Executar no server
3. **Client Components apenas quando necessário** - Estado interativo
4. **Tipar tudo** - Interfaces para props e retornos
5. **Usar Promise.all para queries paralelas** - Quando múltiplas queries são independentes, executar em paralelo para melhor performance

### Promise.all para Queries Paralelas

```ts
// ✅ Bom - queries em paralelo
export async function getPageData() {
  const [leaderboard, stats, recentRoasts] = await Promise.all([
    getLeaderboard(),
    getStats(),
    getRecentRoasts(),
  ]);

  return { leaderboard, stats, recentRoasts };
}

// ❌ Evitar - queries sequenciais
export async function getPageData() {
  const leaderboard = await getLeaderboard();
  const stats = await getStats();  // espera leaderboard
  const recentRoasts = await getRecentRoasts();  // espera stats
  return { leaderboard, stats, recentRoasts };
}
```

## Suspense para Loading States

```ts
import { Suspense } from "react";
import { ComponentSkeleton } from "./component-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<ComponentSkeleton />}>
      <Component />
    </Suspense>
  );
}
```

## Estrutura de Página Completa

```
src/app/
├── page.tsx                    # Homepage (Client + Server Actions)
├── actions.ts                  # Server Actions global
├── leaderboard/
│   └── page.tsx                # Leaderboard (SSR)
├── result/[id]/
│   └── page.tsx                # Result detail (SSR)
└── components/
    └── code-block/
        └── page.tsx             # Page de exemplo de componente
```
