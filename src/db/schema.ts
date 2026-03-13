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
  id: uuid().primaryKey().defaultRandom(),
  code: text().notNull(),
  language: varchar({ length: 30 }).notNull(),
  roastMode: boolean().notNull().default(true),
  status: submissionStatusEnum().notNull().default("pending"),
  ipHash: varchar({ length: 64 }),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const roasts = pgTable("roasts", {
  id: uuid().primaryKey().defaultRandom(),
  submissionId: uuid().notNull(),
  score: decimal({ precision: 3, scale: 2 }).notNull(),
  feedback: text().notNull(),
  improvements: text().array(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const leaderboard = pgTable("leaderboard", {
  id: uuid().primaryKey().defaultRandom(),
  ipHash: varchar({ length: 64 }).notNull(),
  totalSubmissions: integer().notNull().default(0),
  averageScore: decimal({ precision: 3, scale: 2 }),
  bestScore: decimal({ precision: 3, scale: 2 }),
  rank: integer(),
  updatedAt: timestamp().notNull().defaultNow(),
});
