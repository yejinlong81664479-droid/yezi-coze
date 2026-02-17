import { pgTable, text, varchar, timestamp, jsonb, integer, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { createSchemaFactory } from "drizzle-zod"
import { z } from "zod"

export const generations = pgTable(
  "generations",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    type: varchar("type", { length: 20 }).notNull(), // 'ppt' | 'infographic' | 'architecture' | 'comic'
    prompt: text("prompt").notNull(),
    style: text("style"), // 风格描述
    pageCount: integer("page_count").default(1), // PPT 页数
    imageUrls: jsonb("image_urls").$type<string[]>(), // 生成的图片 URL 数组（带签名）
    imageKeys: jsonb("image_keys").$type<string[]>(), // 图片在对象存储中的 key 数组（用于刷新签名）
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    typeIdx: index("generations_type_idx").on(table.type),
    createdAtIdx: index("generations_created_at_idx").on(table.createdAt),
  })
)

const { createInsertSchema: createCoercedInsertSchema } = createSchemaFactory({
  coerce: { date: true },
})

export const insertGenerationSchema = createCoercedInsertSchema(generations).pick({
  type: true,
  prompt: true,
  style: true,
  pageCount: true,
})

export type Generation = typeof generations.$inferSelect
export type InsertGeneration = z.infer<typeof insertGenerationSchema>




