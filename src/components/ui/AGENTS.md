# Padrões de Componentes UI

## Estrutura de Arquivos

```
src/components/ui/
└── component-name.tsx
```

## Padrões de Implementação

### 1. Named Exports

- Usar **named exports** para o componente e suas variantes
- Nunca usar default exports

```tsx
export interface ButtonProps { ... }
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(...);
export const buttonVariants = tv({ ... });
```

### 2. Tipagem

- Estender as propriedades nativas do elemento HTML
- Usar `forwardRef` para referenciar o elemento DOM
- Criar interface própria para expor as props públicas

```tsx
import { type ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline";
  size?: "default" | "sm" | "lg";
}
```

### 3. Estilização com Tailwind Variants

- Usar `tailwind-variants` (`tv`) para criar variantes
- **Não usar** `twMerge` - passar `className` diretamente para `tv`
- O `tv` faz o merge automaticamente

```tsx
const buttonVariants = tv({
  base: "classes base sempre aplicadas",
  variants: {
    variant: {
      default: "bg-green-500 text-zinc-950",
      secondary: "bg-zinc-200 text-zinc-900",
    },
    size: {
      default: "px-6 py-2.5",
      sm: "px-3 py-1.5",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});
```

### 4. Implementação do Componente

```tsx
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
```

### 5. Instalação de Dependências

Para novos componentes que usam `tv`:

```bash
npm install tailwind-variants
```

### 6. Scripts Úteis

- `npm run lint` - verifica linting com Biome
- `npm run format` - formata código com Biome (2 espaços, double quotes)
