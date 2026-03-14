# Padrões de Database (Drizzle ORM)

## Estrutura de Arquivos

```
src/db/
├── index.ts      # Conexão com banco
├── schema.ts     # Definição das tabelas
├── seed.ts       # Seed do banco
└── migrations/   # Migrações Drizzle
```

## Configuração

### Drizzle Config (`drizzle.config.ts`)

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### Conexão (`src/db/index.ts`)

```ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema, casing: "snake_case" });
```

## Padrões de Schema

### 1. Nomeação de Colunas

- **Não repetrir nomes** - Drizzle gera snake_case automaticamente
- Usar camelCase no código TypeScript

```ts
// ✅ Bom - Drizzle gera "created_at" automaticamente
export const submissions = pgTable("submissions", {
  id: uuid().primaryKey().defaultRandom(),
  code: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

// ❌ Evitar - nome escrito duas vezes
export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull(),
});
```

### 2. Sem Relações Nativas

- Não usar `.references()` do Drizzle
- Escrever queries raw com joins manualmente

```ts
// ✅ Bom - sem relação nativa
export const roasts = pgTable("roasts", {
  id: uuid().primaryKey().defaultRandom(),
  submissionId: uuid().notNull(),
  // sem .references()
});

// ❌ Evitar
export const roasts = pgTable("roasts", {
  id: uuid().primaryKey().defaultRandom(),
  submissionId: uuid().notNull()
    .references(() => submissions.id, { onDelete: "cascade" }),
});
```

### 3. Índices

- Não criar índices desnecessários
- PK e FK já são indexados automaticamente pelo PostgreSQL
- Apenas adicionar unique constraint quando necessário

```ts
export const leaderboard = pgTable("leaderboard", {
  id: uuid().primaryKey().defaultRandom(),
  ipHash: varchar({ length: 64 }).notNull(), // unique por natureza
  // não precisa de .unique() explícito para ipHash
});
```

## Queries

### Usar Raw SQL

- Preferir `db.execute()` para queries complexas
- Evitar `.query` builder para mais controle

```ts
// ✅ Bom - raw SQL
const result = await db.execute`
  SELECT * FROM submissions
  WHERE status = 'completed'
  ORDER BY created_at DESC
`;

// Também funciona com joins
const withRoasts = await db.execute`
  SELECT s.*, r.score, r.feedback
  FROM submissions s
  JOIN roasts r ON s.id = r.submission_id
  WHERE s.ip_hash = ${ipHash}
`;
```

## Scripts

```bash
npm run db:push   # Cria/atualiza tabelas (desenvolvimento)
npm run db:seed   # Popula banco com dados fake
npm run db:studio # Abre UI do Drizzle
```

## Docker Compose

O projeto usa PostgreSQL via Docker Compose na porta 5434:

```bash
docker-compose up -d  # Inicia banco
```
