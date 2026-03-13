import {
  boolean,
  decimal,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const submissionStatusEnum = pgEnum("submission_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull(),
  language: varchar("language", { length: 30 }).notNull(),
  roastMode: boolean("roast_mode").notNull().default(true),
  status: submissionStatusEnum("status").notNull().default("pending"),
  ipHash: varchar("ip_hash", { length: 64 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const roasts = pgTable("roasts", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id")
    .notNull()
    .references(() => submissions.id, { onDelete: "cascade" }),
  score: decimal("score", { precision: 3, scale: 2 }).notNull(),
  feedback: text("feedback").notNull(),
  improvements: text("improvements").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const leaderboard = pgTable("leaderboard", {
  id: uuid("id").primaryKey().defaultRandom(),
  ipHash: varchar("ip_hash", { length: 64 }).notNull().unique(),
  totalSubmissions: integer("total_submissions").notNull().default(0),
  averageScore: decimal("average_score", { precision: 3, scale: 2 }),
  bestScore: decimal("best_score", { precision: 3, scale: 2 }),
  rank: integer("rank"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
