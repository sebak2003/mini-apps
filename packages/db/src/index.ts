import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);

// Re-export schema helpers for apps to define their tables
export { pgSchema } from "drizzle-orm/pg-core";
export type { NeonHttpDatabase } from "drizzle-orm/neon-http";
