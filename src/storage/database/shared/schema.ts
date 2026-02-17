import { pgTable, index, varchar, text, integer, jsonb, timestamp, serial } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const generations = pgTable("generations", {
	id: varchar("id", { length: 36 }).default(sql`gen_random_uuid()`).primaryKey().notNull(),
	type: varchar("type", { length: 20 }).notNull(),
	prompt: text("prompt").notNull(),
	style: text("style"),
	pageCount: integer("page_count").default(1),
	imageUrls: jsonb("image_urls"),
	imageKeys: jsonb("image_keys"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("generations_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("generations_type_idx").using("btree", table.type.asc().nullsLast().op("text_ops")),
]);

export const healthCheck = pgTable("health_check", {
	id: serial("id").notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 👇👇👇 下面这几行是你原文件中缺失的，也是报错的原因 👇👇👇
export const insertGenerationSchema = createInsertSchema(generations);
export const selectGenerationSchema = createSelectSchema(generations);

export type Generation = typeof generations.$inferSelect;
export type InsertGeneration = typeof generations.$inferInsert;
