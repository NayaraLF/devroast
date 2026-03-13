# Especificação: Drizzle ORM + PostgreSQL

## 1. Visão Geral

Este documento especifica a implementação do Drizzle ORM com PostgreSQL para o projeto DevRoast. O banco de dados armazenará dados relacionados a submissions de código, reviews/roasts, leaderboard e estatísticas.

## 2. Funcionalidades do Sistema

Com base na análise do código existente:

- **Code Input**: Usuários enviam código para análise
- **Roast Mode**: Modo sarcástico vs construtivo
- **Leaderboard**: Rankings de melhores/piores códigos
- **Estatísticas**: Contagem de códigos processados, média de scores

## 3. Estrutura do Banco de Dados

### 3.1 Tabelas

#### `users`
Armazena informações dos usuários (mesmo que anônimos inicialmente, pode ser expandido para auth).

| Coluna | Tipo | Descrição |
|--------|------|------------|
| id | uuid | PK, identificador único |
| username | varchar(50) | Nome de usuário (opcional) |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |

#### `submissions`
Armazena os códigos enviados pelos usuários.

| Coluna | Tipo | Descrição |
|--------|------|------------|
| id | uuid | PK, identificador único |
| user_id | uuid | FK para users (opcional, pode ser NULL para anônimos) |
| code | text | Código fonte enviado |
| language | varchar(30) | Linguagem detectada/selecionada |
| roast_mode | boolean | true = sarcástico, false = construtivo |
| status | enum | pending, processing, completed, failed |
| created_at | timestamp | Data de envio |
| updated_at | timestamp | Data de atualização |

#### `roasts`
Armazena os reviews/roasts gerados para cada submission.

| Coluna | Tipo | Descrição |
|--------|------|------------|
| id | uuid | PK, identificador único |
| submission_id | uuid | FK para submissions |
| score | decimal(3,2) | Score de 0 a 10 |
| feedback | text | Review/roast gerado |
| improvements | text[] | Array de sugestões de melhoria |
| created_at | timestamp | Data de criação |

#### `leaderboard`
Tabela materializada para o leaderboard (pode ser view ou tabela caching).

| Coluna | Tipo | Descrição |
|--------|------|------------|
| id | uuid | PK |
| user_id | uuid | FK para users |
| total_submissions | integer | Total de submissions |
| average_score | decimal(3,2) | Média de scores |
| best_score | decimal(3,2) | Melhor score |
| rank | integer | Posição no ranking |
| updated_at | timestamp | Última atualização |

### 3.2 Enums

```typescript
// Status da submissão
export const submissionStatus = pgEnum("submission_status", [
  "pending",
  "processing", 
  "completed",
  "failed",
]);

// Linguagens suportadas (para validação)
export const supportedLanguages = pgEnum("supported_language", [
  "javascript",
  "typescript",
  "python",
  "java",
  "csharp",
  "cpp",
  "go",
  "rust",
  "ruby",
  "php",
  "html",
  "css",
  "sql",
  "json",
  "yaml",
  "markdown",
  "shell",
  "plaintext",
]);
```

## 4. Docker Compose

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: devroast-db
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast
      POSTGRES_DB: devroast
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U devroast"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### Variáveis de Ambiente (.env)

```
DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast
```

## 5. Estrutura de Arquivos

```
src/
├── db/
│   ├── index.ts          # Conexão com banco
│   ├── schema.ts         # Definição das tabelas
│   └── migrations/       # Migrações Drizzle
├── actions/              # Server Actions (futuro)
│   └── submit-code.ts
└── lib/
    └── db.ts             # Helpers de banco
```

## 6. TO-DO

- [ ] Criar arquivo `docker-compose.yml` na raiz
- [ ] Criar arquivo `.env` com `DATABASE_URL`
- [ ] Instalar dependências: `drizzle-orm`, `drizzle-kit`, `postgres`
- [ ] Criar `src/db/schema.ts` com definições de tabelas
- [ ] Criar `src/db/index.ts` com conexão
- [ ] Configurar `drizzle.config.ts`
- [ ] Criar script `db:push` no package.json
- [ ] Criar script `db:studio` no package.json
- [ ] Executar `docker-compose up -d` para subir Postgres
- [ ] Executar `npm run db:push` para criar tabelas
- [ ] Criar seed inicial (opcional)
- [ ] Criar helper functions para CRUD

## 7. Perguntas em Aberto

1. **Autenticação**: Precisamos de sistema de autenticação?
   - Se sim, qual provedor? (NextAuth, custom, etc)
   - Se não, submissions podem ser anônimas?

2. **IA para Roasts**: Onde será processada a geração de roasts?
   - API externa?
   - AI local (LLM)?
   - Regras fixas (por agora)?

3. **Leaderboard**: Como será calculado o ranking?
   - Apenas por score médio?
   - Considerar número de submissions?
   - Filtrar por período (semana, mês, all-time)?

4. **Dados Iniciais**: Precisamos popular o banco com dados fake para demonstração?

5. **Migrations**: Prefere usar migrations formais ou `drizzle-kit push` para desenvolvimento?
