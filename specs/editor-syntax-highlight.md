# Especificação: Editor de Código com Syntax Highlighting

## 1. Objetivo

Criar um editor de código interativo para a homepage do DevRoast que:
- Permite ao usuário colar/editar código
- Aplica syntax highlighting automaticamente conforme a linguagem é detectada
- Oferece opção de seleção manual da linguagem
- Funciona de forma similar ao editor do Ray.so

## 2. Pesquisa: Opções Disponíveis

### 2.1 Bibliotecas para Editor Editável

| Biblioteca | Uso Principal | Prós | Contras |
|------------|--------------|------|----------|
| **CodeMirror 6** | Editor completo | Moderno, modular, boa detecção de linguagem, React bem suportado | Setup mais complexo |
| **Monaco Editor** | Editor tipo VS Code | Excelente highlighting, muitos idiomas | Bundle pesado (~2.5MB) |
| **PrismJS** | Apenas highlighting | Leve, muitos idiomas | Apenas visualização |
| **Highlight.js** | Apenas highlighting | Leve, auto-detecção | Apenas visualização |
| **Shiki** (já instalado) | Apenas highlighting | Temas VS Code, server-side | Apenas visualização |

### 2.2 Ray.so - Análise

O Ray.so (código aberto) utiliza:
- **CodeMirror 6** para o editor de código
- **CodeDetectionAPI** (runtime.dev) para detecção automática de linguagem via ML
- Detecção em ~250ms para até 30 linguagens
- **Shiki** para renderização server-side de código estático

### 2.3 Deteção de Linguagem

**Opções:**
1. **highlight.js auto-detect** -built-in mas impreciso
2. **CodeDetectionAPI** (runtime.dev) - ML-based, mais preciso
3. **CodeMirror 6** - Suporta detecção automática com extensão
4. **Detecção viaheurísticas** - Analisar keywords, sintaxe (implementação própria)

## 3. Recomendação de Implementação

### Stack Recomendada

| Componente | Biblioteca | Justificativa |
|------------|------------|---------------|
| Editor | `@uiw/react-codemirror` | Wrapper React para CodeMirror 6, bem mantido |
| Linguagens | `@codemirror/lang-*` (dynamic loading) | Suporte a múltiplas linguagens |
| Tema | Custom (baseado em vesper/shiki) | Manter consistência visual |
| Detecção | highlight.js (auto) + fallback manual | Solução simples e funcional |

### Alternativa (se necessário mais precisão na detecção)
- Integrar **CodeDetectionAPI** (runtime.dev) como fallback

## 4. Especificação Técnica

### 4.1 Componente: CodeEditor

```tsx
interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  language?: string;           // undefined = auto-detect
  onLanguageDetected?: (lang: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  readOnly?: boolean;
}
```

### 4.2 Propriedades

- `value` - Código atual
- `onChange` - Callback quando código muda
- `language` - Linguagem forçada (undefined = auto)
- `onLanguageDetected` - Callback quando linguagem é detectada
- `placeholder` - Texto placeholder
- `minHeight` / `maxHeight` - Limites de altura
- `readOnly` - Modo somente leitura

### 4.3 Componente: LanguageSelector

```tsx
interface LanguageSelectorProps {
  value?: string;
  onChange?: (lang: string) => void;
  detectedLanguage?: string;   // Linguagem detectada automaticamente
  languages: string[];        // Lista de linguagens disponíveis
}
```

### 4.4 Fluxo de Detecção

1. Usuário cola/escreve código
2. Após debounce (300ms), detecta linguagem
3. Atualiza highlighting automaticamente
4. Dispara `onLanguageDetected` se linguagem mudar
5. Usuário pode sobrescrever via seletor manual

### 4.5 Lista de Linguagens Iniciais

Suporte mínimo:
- JavaScript / TypeScript
- Python
- Java
- C# / C++
- Go
- Rust
- Ruby
- PHP
- HTML / CSS
- SQL
- JSON / YAML
- Markdown
- Shell/Bash

## 5. UI/UX

### 5.1 Layout do Editor

```
┌─────────────────────────────────────────────┐
│ [JavaScript ▼] [Auto-detected: JS]         │  ← Language Bar
├─────────────────────────────────────────────┤
│  1 │ function hello() {                    │
│  2 │   console.log("Hello");               │  ← CodeMirror
│  3 │ }                                      │
│    │                                        │
└─────────────────────────────────────────────┘
```

### 5.2 Integração com Homepage

O editor deve ser integrado ao componente `CodeInput` existente:
- Substituir textarea atual por CodeEditor
- Adicionar LanguageSelector acima do editor
- Manter botão de submit "Roast My Code"

## 6. TO-DO

- [ ] Instalar dependências: `@uiw/react-codemirror`, `@codemirror/lang-*`
- [ ] Criar componente `CodeEditor` em `src/components/ui/`
- [ ] Criar componente `LanguageSelector` em `src/components/ui/`
- [ ] Implementar detecção automática de linguagem
- [ ] Integrar editor ao componente `CodeInput` existente
- [ ] Estilizar com tema consistente (baseado em vesper/shiki)
- [ ] Testar performance com código grande
- [ ] Adicionar testes

## 7. Perguntas em Aberto

1. **Qual abordagem de detecção preferida?**
   - highlight.js (simples, gratuito)
   - CodeDetectionAPI (preciso, requer API key)

2. **O editor deve ser editável ou apenas visualização?**
   - O objetivo é permitir o usuário colar código para ser analisado
   - Precisamos de modo editável para colar código

3. **Quantas linguagens precisamos suportar inicialmente?**
   - Todas ou subset?

4. **O theme deve ser igual ao Shiki (vesper) ou diferente?**
   - CodeMirror usa sistema de temas diferente
   - Precisamos criar tema custom ou adaptar um existente
