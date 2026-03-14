# DevRoast

App built during NLW event by Rocketseat.

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS v4
- Biome (lint + format)
- Radix UI (primitives)
- Shiki (syntax highlighting)
- Drizzle ORM + PostgreSQL
- lucide-react (icons)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── actions.ts         # Server Actions
│   ├── leaderboard/       # Leaderboard page
│   ├── result/[id]/       # Result detail page
│   └── components/        # Page-specific components
├── components/
│   ├── ui/                # Reusable UI components
│   └── *.tsx              # Feature components
└── db/                    # Database (Drizzle ORM)
    ├── schema.ts          # Database schema
    ├── index.ts           # DB connection
    ├── seed.ts            # Database seed
    └── migrations/        # Drizzle migrations
```

## Scripts

```bash
npm run dev       # Development server
npm run build     # Production build
npm run lint      # Biome check
npm run format    # Biome format
npm run db:push   # Push Drizzle schema to DB
npm run db:seed   # Seed database
npm run db:studio # Open Drizzle Studio
```

## Environment Variables

```bash
DATABASE_URL=postgresql://user:pass@localhost:5434/devroast
```

## Patterns

### UI Components (`src/components/ui/`)

- Named exports only
- Use `tv` from tailwind-variants for variants
- Extend native HTML attributes with forwardRef
- Use `twMerge` for composing classes

### Feature Components (`src/components/`)

- Use composition pattern (Root + SubComponents)
- Server Components by default, client only when needed

### Server Actions (`src/app/actions.ts`)

- Use for database operations (CRUD)
- Handle form submissions
- Return typed responses

### Colors

All colors defined in `src/app/globals.css` @theme:
- `bg-bg-page`, `bg-bg-surface`, `bg-bg-elevated`, `bg-bg-input`
- `text-text-primary`, `text-text-secondary`, `text-text-tertiary`
- `border-border-primary`, `border-border-secondary`
- `accent-green`, `accent-red`, `accent-amber`, `accent-blue`, `accent-orange`

## Database (Drizzle ORM)

### Schema Conventions

- Use `snake_case` casing (configured in `drizzle.config.ts`)
- Don't repeat column names - Drizzle auto-generates from camelCase
- No native Drizzle relations - write raw queries with joins

```ts
// Good - let Drizzle handle column naming
export const submissions = pgTable("submissions", {
  id: uuid().primaryKey().defaultRandom(),
  code: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

// Avoid - don't repeat names
export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),  // "id" written twice
});
```

### Queries

- Use raw SQL with `db.execute()` or template literals for complex queries
- Avoid `.query` builder for more control

### Migrations

- Use `drizzle-kit push` for development
- For production, create formal migrations with `drizzle-kit generate`

## Code Input Component

- Max character limit: 2000 characters
- Show character counter in bottom-right corner
- Disable submit button when over limit
- Support language selection (JavaScript, TypeScript, Python, etc.)

## Routing

- `/` - Homepage (Code Input)
- `/leaderboard` - Leaderboard page (SSR)
- `/result/[id]` - Result detail page with UUID parameter (SSR)
