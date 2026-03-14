# Padrões de Componentes

## Estrutura de Arquivos

```
src/components/
├── ui/                    # Componentes UI reutilizáveis
│   ├── button.tsx
│   ├── card.tsx
│   ├── code-block.tsx
│   └── ...
├── navbar.tsx             # Componentes de feature
├── code-input.tsx
├── footer-stats.tsx
└── leaderboard-preview.tsx
```

## Tipos de Componentes

### 1. UI Components (`src/components/ui/`)

- Reutilizáveis em qualquer lugar
- Não têm dependência de dados específicos do app
- Usar `tv` (tailwind-variants) para variantes

Ver `src/components/ui/AGENTS.md` para detalhes.

### 2. Feature Components (`src/components/`)

- Específicos para funcionalidades do app
- Podem ter dependência de Server Actions
- Composition pattern (Root + SubComponents)

## Composition Pattern

Componentes construídos com partes menores:

```tsx
// ✅ Bom - Composição
export function CodeInputRoot({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export function CodeInputHeader({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export function CodeInputBody({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export function CodeInputSection() {
  return (
    <CodeInputRoot>
      <CodeInputHeader />
      <CodeInputBody />
    </CodeInputRoot>
  );
}
```

## Server vs Client Components

### Server Components (Padrão)

- Fetch de dados diretamente
- Melhor performance e SEO
- Sem estado interactivity

```tsx
// Server Component - boa performance
export async function LeaderboardPreview() {
  const data = await getLeaderboard();
  return <LeaderboardTable data={data} />;
}
```

### Client Components

- Use `"use client"` quando necessário:
  - hooks (useState, useEffect)
  - event handlers (onClick, onChange)
  - browser APIs

```tsx
"use client";

export function CodeInputSection() {
  const [code, setCode] = useState("");
  // Estado interativo
}
```

## Libraries

### icons

Usar `lucide-react` para ícones:

```bash
npm install lucide-react
```

```tsx
import { ChevronDown, ChevronLeft } from "lucide-react";
```

### Syntax Highlighting

Usar `shiki` para highlight server-side:

```tsx
import { codeToHtml } from "shiki";

const html = await codeToHtml(code, {
  lang: language,
  theme: "vesper",
});
```
