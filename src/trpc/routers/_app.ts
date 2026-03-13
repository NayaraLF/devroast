import { sql } from "drizzle-orm";
import { db } from "@/db";
import { roasts, submissions } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  stats: baseProcedure.query(async () => {
    try {
      const totalResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(submissions);

      const total = totalResult[0]?.count ?? 0;

      const avgResult = await db
        .select({ avg: sql<number>`avg(${roasts.score})` })
        .from(roasts);

      const avgScore = avgResult[0]?.avg ?? 0;

      return {
        totalCodes: total,
        avgScore: Number(avgScore.toFixed(1)),
      };
    } catch {
      return {
        totalCodes: 0,
        avgScore: 0,
      };
    }
  }),
});

export type AppRouter = typeof appRouter;
