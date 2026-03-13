import { faker } from "@faker-js/faker";
import "dotenv/config";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "go",
  "rust",
  "ruby",
  "php",
  "csharp",
  "html",
  "css",
  "sql",
];

const FEEDBACK_TEMPLATES = [
  "Este código tem potencial, mas {issue}. Considere {suggestion}.",
  "Olha, {issue}. Isso é bem {critique}, mas corrigindo {suggestion} vai melhorar muito.",
  "Não vou mentir, {issue}. A boa notícia é que {suggestion} resolve isso.",
  "Seu código está {critique}, mas {issue}. Tente {suggestion}.",
  "Vamos ser directos: {issue}. A solução? {suggestion}.",
  "Esse código tem mais {issue} do que um burger tem carne. Sério, {suggestion}.",
  "Técnicamente funciona, mas {issue}. Para o bem do código, {suggestion}.",
  "Eu tenho certeza que você pode fazer melhor. {issue}. Melhore com {suggestion}.",
];

const IMPROVEMENTS_TEMPLATES = [
  "Use nomes mais descritivos para variáveis",
  "Adicione tratamento de erros adequado",
  "Considere usar async/await em vez de Promises",
  "Extraia lógica repetida para funções reutilizáveis",
  "Adicione comments explicando o porquê, não o quê",
  "Use types adequados para melhor segurança",
  "Evite side effects desnecessários",
  "Implemente testes unitários",
  "Use early returns para evitar nesting profundo",
  "Considere usar composição em vez de herança",
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateIpHash(): string {
  return faker.string.alphanumeric(64).toLowerCase();
}

function generateCode(language: string): string {
  const templates: Record<string, string> = {
    javascript: `function ${faker.word.noun()}() {
  const ${faker.word.noun()} = ${faker.number.int({ min: 1, max: 100 })};
  if (${faker.word.noun()} > 50) {
    return ${faker.word.noun()} * 2;
  }
  return ${faker.word.noun()};
}`,
    typescript: `interface ${faker.word.noun()}Props {
  id: number;
  name: string;
  ${faker.word.noun()}: boolean;
}

function process${faker.word.noun()}(data: ${faker.word.noun()}Props[]) {
  return data.filter(item => item.${faker.word.noun()});
}`,
    python: `def ${faker.word.noun()}(${faker.word.noun()}_id: int) -> dict:
    ${faker.word.noun()} = get_${faker.word.noun()}(${faker.word.noun()}_id)
    if ${faker.word.noun()}.${faker.word.noun()}:
        return ${faker.word.noun()}.to_dict()
    return {}`,
    java: `public class ${faker.word.noun()}Service {
    public ${faker.word.noun()} get${faker.word.noun()}(int id) {
        return repository.findById(id).orElse(null);
    }
}`,
    go: `func ${faker.word.noun()}(ctx context.Context, id int) (*${faker.word.noun()}, error) {
    return s.repository.FindByID(ctx, id)
}`,
    rust: `fn ${faker.word.noun()}(item: ${faker.word.noun()}) -> Result<${faker.word.noun()}, Error> {
    validate_${faker.word.noun()}(&item)?;
    Ok(item)
}`,
  };

  return templates[language] || templates.javascript;
}

async function seed() {
  console.log("🌱 Starting seed...");

  await client`DELETE FROM roasts`;
  await client`DELETE FROM submissions`;
  await client`DELETE FROM leaderboard`;
  console.log("🗑️  Cleaned existing data");

  const submissions: Array<{
    id: string;
    code: string;
    language: string;
    roast_mode: boolean;
    status: string;
    ip_hash: string;
    created_at: Date;
  }> = [];

  const roasts: Array<{
    id: string;
    submission_id: string;
    score: string;
    feedback: string;
    improvements: string[];
    created_at: Date;
  }> = [];

  const ipHashes = new Set<string>();

  for (let i = 0; i < 100; i++) {
    let ipHash = generateIpHash();
    while (ipHashes.has(ipHash)) {
      ipHash = generateIpHash();
    }
    ipHashes.add(ipHash);

    const language = randomElement(LANGUAGES);
    const isRoastMode = Math.random() > 0.3;
    const score = (Math.random() * 9.9 + 0.1).toFixed(2);
    const createdAt = faker.date.past({ years: 1 });

    const issue = randomElement([
      "esse loop pode ser otimizado",
      "a nomenclatura está confusa",
      "falta tratamento de exceptions",
      "esse código tem memory leak potencial",
      "o regex está muito complexo",
      "esse else está desnecessário",
      "falta validação de input",
      "esse código não é thread-safe",
    ]);

    const critique = randomElement([
      "um desastre ambiental",
      "uma bomba-relógio",
      "um pesadelo de manutenção",
      "confuso pra caramba",
      "bem problemático",
      "uma catástrofe",
      "duas vezes pior que o normal",
    ]);

    const suggestion = randomElement(IMPROVEMENTS_TEMPLATES);

    const feedbackTemplate = randomElement(FEEDBACK_TEMPLATES);
    const feedback = feedbackTemplate
      .replace("{issue}", issue)
      .replace("{critique}", critique)
      .replace("{suggestion}", suggestion);

    const improvements = Array.from(
      { length: faker.number.int({ min: 2, max: 4 }) },
      () => randomElement(IMPROVEMENTS_TEMPLATES),
    );

    const submissionId = faker.string.uuid();
    const roastId = faker.string.uuid();

    submissions.push({
      id: submissionId,
      code: generateCode(language),
      language,
      roast_mode: isRoastMode,
      status: "completed",
      ip_hash: ipHash,
      created_at: createdAt,
    });

    roasts.push({
      id: roastId,
      submission_id: submissionId,
      score,
      feedback: isRoastMode
        ? feedback
        : `Sugestão construtiva: ${suggestion}. O código poderia se beneficiar de ${randomElement(
            IMPROVEMENTS_TEMPLATES,
          )}.`,
      improvements,
      created_at: new Date(createdAt.getTime() + 1000),
    });
  }

  console.log("📝 Inserting submissions...");
  for (const sub of submissions) {
    await client`
      INSERT INTO submissions (id, code, language, roast_mode, status, ip_hash, created_at, updated_at)
      VALUES (${sub.id}, ${sub.code}, ${sub.language}, ${sub.roast_mode}, ${sub.status}, ${sub.ip_hash}, ${sub.created_at}, ${sub.created_at})
    `;
  }

  console.log("📝 Inserting roasts...");
  for (const roast of roasts) {
    await client`
      INSERT INTO roasts (id, submission_id, score, feedback, improvements, created_at)
      VALUES (${roast.id}, ${roast.submission_id}, ${roast.score}, ${roast.feedback}, ${roast.improvements}, ${roast.created_at})
    `;
  }

  console.log("📊 Calculating leaderboard...");
  const leaderboardData = await client`
    SELECT 
      ip_hash,
      COUNT(*) as total_submissions,
      AVG(score::numeric) as average_score,
      MAX(score::numeric) as best_score
    FROM submissions s
    JOIN roasts r ON s.id = r.submission_id
    GROUP BY ip_hash
    ORDER BY average_score DESC
    LIMIT 50
  `;

  let rank = 1;
  for (const row of leaderboardData) {
    await client`
      INSERT INTO leaderboard (id, ip_hash, total_submissions, average_score, best_score, rank, updated_at)
      VALUES (${faker.string.uuid()}, ${row.ip_hash}, ${row.total_submissions}, ${row.average_score}, ${row.best_score}, ${rank}, NOW())
    `;
    rank++;
  }

  console.log("✅ Seed completed!");
  console.log(`   - ${submissions.length} submissions`);
  console.log(`   - ${roasts.length} roasts`);
  console.log(`   - ${leaderboardData.length} leaderboard entries`);

  await client.end();
}

seed().catch(console.error);
