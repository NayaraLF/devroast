"use server";

import { faker } from "@faker-js/faker";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { leaderboard, roasts, submissions } from "@/db/schema";

function generateIpHash(): string {
  return faker.string.alphanumeric(64).toLowerCase();
}

async function generateFeedbackWithAI(
  code: string,
  language: string,
  roastMode: boolean,
): Promise<{
  score: string;
  feedback: string;
  improvements: string[];
}> {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    console.warn("GOOGLE_API_KEY not set, using fallback mock");
    return generateMockFeedback(roastMode);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const mode = roastMode ? "roast" : "constructive";
  const tone = roastMode
    ? "sarcástico, humorístico, irônico, bem crítico"
    : "amigável, construtivo, encorajador";

  const prompt = `Você é um desenvolvedor sênior que está revisando código. Analise o código abaixo e forneça um feedback.

Linguagem: ${language}
Código:
\`\`\`${language}
${code}
\`\`\`

Modo: ${mode}
Tom: ${tone}

Forneça a resposta APENAS em formato JSON válido (sem markdown, sem texto adicional), com esta estrutura exata:
{
  "score": "nota de 0 a 10 com 2 casas decimais",
  "feedback": "uma frase de feedback sobre o código",
  "improvements": ["sugestão 1", "sugestão 2", "sugestão 3"]
}

Critérios para score:
- 0-3: código muito ruim, muitos problemas
- 4-6: código regular, alguns problemas
- 7-8: código bom, poucos problemas
- 9-10: código excelente

Responda apenas com JSON válido:`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Invalid JSON response:", responseText);
      return generateMockFeedback(roastMode);
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      score: parsed.score || "5.00",
      feedback: parsed.feedback || "Código analisado.",
      improvements: Array.isArray(parsed.improvements)
        ? parsed.improvements.slice(0, 4)
        : [],
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return generateMockFeedback(roastMode);
  }
}

function generateMockFeedback(roastMode: boolean): {
  score: string;
  feedback: string;
  improvements: string[];
} {
  const IMPROVEMENTS = [
    "Use nomes mais descritivos para variáveis",
    "Adicione tratamento de erros adequado",
    "Considere usar async/await em vez de Promises",
    "Extraia lógica repetida para funções reutilizáveis",
    "Adicione comments explicando o porquê, não o quê",
    "Use types adequados para melhor segurança",
    "Evite side effects desnecessários",
    "Implemente testes unitários",
    "Use early returns para evitar nesting profundo",
  ];

  const roastFeedback = [
    "Olha, esse código tem alguns problemas sérios. O loop poderia ser otimizado e a nomenclatura está confuse. Para o bem do código, considere refatorar.",
    "Não vou mentir, esse código está bem fraco. Falta tratamento de erros e a lógica está redundante. Melhore isso urgentemente.",
    "Esse código tem mais problemas do que um burger sem carne. Sério, os nomes das variáveis são indecifráveis. Arranje isso.",
    "Técnicamente funciona, mas está uma bagunça. Esse if/else aninhado é um pesadelo de manutenção. Use early returns.",
    "Eu tenho certeza que você pode fazer melhor. Esse código precisa de refatoração urgente. Falta até validação de input!",
    "Vamos ser directos: esse código não passa nem perto dos padrões. A solução? Comece do zero e use types.",
  ];

  const constructiveFeedback = [
    "Sugestão construtiva: considere usar nomes mais descritivos para as variáveis. Isso vai facilitar a manutenção do código.",
    "Uma melhoria possível: extrair lógica repetida para funções reutilizáveis. Isso reduz duplicação e melhora a legibilidade.",
    "Considere adicionar tratamento de erros adequado. Isso tornará o código mais robusto e fácil de debugar.",
    "Uma sugestão: use types adequados para melhor segurança. Isso previne bugs comuns em tempo de execução.",
  ];

  const score = (Math.random() * 9.9 + 0.1).toFixed(2);
  const improvements = Array.from(
    { length: faker.number.int({ min: 2, max: 4 }) },
    () => faker.helpers.arrayElement(IMPROVEMENTS),
  );

  return {
    score,
    feedback: roastMode
      ? faker.helpers.arrayElement(roastFeedback)
      : faker.helpers.arrayElement(constructiveFeedback),
    improvements,
  };
}

export async function submitCode({
  code,
  language,
  roastMode,
}: {
  code: string;
  language: string;
  roastMode: boolean;
}) {
  const ipHash = generateIpHash();
  const submissionId = faker.string.uuid();
  const roastId = faker.string.uuid();
  const { score, feedback, improvements } = await generateFeedbackWithAI(
    code,
    language,
    roastMode,
  );

  await db.insert(submissions).values({
    id: submissionId,
    code,
    language,
    roastMode,
    status: "completed",
    ipHash,
  });

  await db.insert(roasts).values({
    id: roastId,
    submissionId,
    score,
    feedback,
    improvements,
  });

  const existingLeaderboard = await db
    .select()
    .from(leaderboard)
    .where(eq(leaderboard.ipHash, ipHash))
    .limit(1);

  if (existingLeaderboard.length > 0) {
    const current = existingLeaderboard[0];
    const newTotal = Number(current.totalSubmissions) + 1;
    const newAvg =
      (Number(current.averageScore) * Number(current.totalSubmissions) +
        Number(score)) /
      newTotal;
    const newBest = Math.max(Number(current.bestScore), Number(score));

    await db
      .update(leaderboard)
      .set({
        totalSubmissions: newTotal,
        averageScore: newAvg.toFixed(2),
        bestScore: newBest.toFixed(2),
        updatedAt: new Date(),
      })
      .where(eq(leaderboard.ipHash, ipHash));
  } else {
    await db.insert(leaderboard).values({
      id: faker.string.uuid(),
      ipHash,
      totalSubmissions: 1,
      averageScore: score,
      bestScore: score,
    });
  }

  await recalculateRanking();

  return {
    submissionId,
    score,
    feedback,
    improvements,
  };
}

async function recalculateRanking() {
  const rankings = await db
    .select()
    .from(leaderboard)
    .orderBy(desc(leaderboard.averageScore));

  for (let i = 0; i < rankings.length; i++) {
    await db
      .update(leaderboard)
      .set({ rank: i + 1, updatedAt: new Date() })
      .where(eq(leaderboard.id, rankings[i].id));
  }
}

export async function getLeaderboard() {
  try {
    const result = (await db.execute(
      "SELECT r.score, s.language, s.code FROM roasts r JOIN submissions s ON r.submission_id = s.id ORDER BY r.score DESC LIMIT 20",
    )) as { score: string; language: string; code: string }[];

    const { codeToHtml } = await import("shiki");

    const data = await Promise.all(
      result.map(async (row, index) => {
        const html = await codeToHtml(row.code, {
          lang: row.language,
          theme: "vesper",
        });

        return {
          rank: index + 1,
          score: row.score,
          language: row.language,
          code: row.code,
          html,
        };
      }),
    );

    return data;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}

export async function getStats() {
  const totalSubmissions = await db
    .select({ count: submissions.id })
    .from(submissions);

  const avgScoreResult = await db.select({ avg: roasts.score }).from(roasts);

  const total = totalSubmissions.length;
  const avgScore =
    avgScoreResult.length > 0
      ? (
          avgScoreResult.reduce((acc, r) => acc + Number(r.avg || 0), 0) /
          avgScoreResult.length
        ).toFixed(1)
      : "0.0";

  return {
    totalCodes: total,
    avgScore,
  };
}

export async function getShameLeaderboard() {
  try {
    const result = (await db.execute(
      "SELECT r.score, s.language, s.code FROM roasts r JOIN submissions s ON r.submission_id = s.id ORDER BY r.score ASC LIMIT 3",
    )) as { score: string; language: string; code: string }[];

    const { codeToHtml } = await import("shiki");

    const data = await Promise.all(
      result.map(async (row, index) => {
        const html = await codeToHtml(row.code, {
          lang: row.language,
          theme: "vesper",
        });

        return {
          rank: index + 1,
          score: row.score,
          language: row.language,
          code: row.code,
          html,
        };
      }),
    );

    return data;
  } catch (error) {
    console.error("Error fetching shame leaderboard:", error);
    return [];
  }
}
