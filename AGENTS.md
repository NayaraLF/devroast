# DevRoast

App built during NLW event by Rocketseat.

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS v4
- Biome (lint + format)
- Radix UI (primitives)
- Shiki (syntax highlighting)

## Project Structure

```
src/
├── app/           # Next.js App Router pages
├── components/
│   ├── ui/        # Reusable UI components
│   └── *.tsx      # Feature components
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

### Colors

All colors defined in `src/app/globals.css` @theme:
- `bg-bg-page`, `bg-bg-surface`, `bg-bg-elevated`, `bg-bg-input`
- `text-text-primary`, `text-text-secondary`, `text-text-tertiary`
- `border-border-primary`, `border-border-secondary`
- `accent-green`, `accent-red`, `accent-amber`, `accent-blue`, `accent-orange`

## Scripts

```bash
npm run dev     # Development server
npm run build   # Production build
npm run lint   # Biome check
npm run format # Biome format
```
