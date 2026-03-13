import { CodeBlock, getCodeHtml } from "@/components/ui/code-block";
import { CodeBlockWithCopy } from "@/components/ui/code-block-with-copy";

const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }
  // TODO: handle tax calculation
  // TODO: handle currency conversion
  return total;
}`;

export default async function CodeBlockExamplesPage() {
  const sampleCodeHtml = await getCodeHtml(sampleCode, "javascript");

  return (
    <div className="min-h-screen bg-bg-page p-8 font-mono">
      <div className="mx-auto max-w-4xl space-y-12">
        <h1 className="text-3xl font-bold text-text-primary">
          CodeBlock Examples
        </h1>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-text-primary">CodeBlock</h2>

          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Server Component - apenas visualização
            </p>
            <CodeBlock code={sampleCode} language="javascript" />
          </div>

          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Com botão copiar (Client Component)
            </p>
            <CodeBlockWithCopy
              code={sampleCode}
              language="javascript"
              html={sampleCodeHtml}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
