import { eq, and, desc, SQL } from "drizzle-orm"
import { getDb, S3Storage } from "coze-coding-dev-sdk"
import {
  generations,
  insertGenerationSchema,
} from "./shared/schema"
import type { Generation, InsertGeneration } from "./shared/schema"

const STORAGE_EXPIRE_SECONDS = 30 * 24 * 60 * 60 // 30 天
const REFRESH_THRESHOLD_SECONDS = 27 * 24 * 60 * 60 // 27 天后刷新

export class GenerationManager {
  async createGeneration(data: InsertGeneration): Promise<Generation> {
    const db = await getDb()
    const validated = insertGenerationSchema.parse(data)
    const [generation] = await db
      .insert(generations)
      .values(validated)
      .returning()
    return generation
  }

  async updateGeneration(
    id: string,
    data: Partial<{ imageUrls: string[]; imageKeys: string[] }>
  ): Promise<Generation | null> {
    const db = await getDb()
    const [generation] = await db
      .update(generations)
      .set(data)
      .where(eq(generations.id, id))
      .returning()
    return generation || null
  }

  /**
   * 刷新即将过期的签名 URL
   * 如果距离创建时间超过 REFRESH_THRESHOLD_SECONDS，则刷新所有签名
   */
  private async refreshExpiredUrls(generation: Generation): Promise<Generation> {
    const now = new Date()
    const createdAt = new Date(generation.createdAt)
    const ageInSeconds = (now.getTime() - createdAt.getTime()) / 1000

    // 如果没有 imageKeys 或未达到刷新阈值，直接返回
    if (!generation.imageKeys || generation.imageKeys.length === 0) {
      return generation
    }

    // 如果距离创建时间超过阈值，刷新签名
    if (ageInSeconds > REFRESH_THRESHOLD_SECONDS) {
      console.log(`刷新签名 URL，记录 ID: ${generation.id}，创建于: ${createdAt.toISOString()}`)

      try {
        const storage = new S3Storage({
          endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
          bucketName: process.env.COZE_BUCKET_NAME,
          region: "cn-beijing",
        })

        // 为每个 key 生成新的签名 URL
        const newImageUrls = await Promise.all(
          generation.imageKeys.map(async (key) => {
            return await storage.generatePresignedUrl({
              key,
              expireTime: STORAGE_EXPIRE_SECONDS, // 30 天
            })
          })
        )

        // 更新数据库
        const db = await getDb()
        const [updated] = await db
          .update(generations)
          .set({ imageUrls: newImageUrls })
          .where(eq(generations.id, generation.id))
          .returning()

        if (updated) {
          console.log(`签名 URL 刷新成功，记录 ID: ${generation.id}`)
          return updated
        }
      } catch (error) {
        console.error(`刷新签名 URL 失败，记录 ID: ${generation.id}`, error)
      }
    }

    return generation
  }

  /**
   * 获取生成记录（自动刷新即将过期的签名 URL）
   */
  async getGenerations(
    options: {
      type?: "ppt" | "infographic" | "architecture" | "comic"
      skip?: number
      limit?: number
    } = {}
  ): Promise<Generation[]> {
    const { type, skip = 0, limit = 100 } = options
    const db = await getDb()

    const conditions: SQL[] = []
    if (type !== undefined) {
      conditions.push(eq(generations.type, type))
    }

    let results: Generation[]

    if (conditions.length > 0) {
      results = await db
        .select()
        .from(generations)
        .where(and(...conditions))
        .orderBy(desc(generations.createdAt))
        .limit(limit)
        .offset(skip)
    } else {
      results = await db
        .select()
        .from(generations)
        .orderBy(desc(generations.createdAt))
        .limit(limit)
        .offset(skip)
    }

    // 异步刷新即将过期的签名 URL
    // 不等待刷新结果，避免影响响应速度
    results.forEach(async (generation) => {
      await this.refreshExpiredUrls(generation)
    })

    return results
  }

  async getGenerationById(id: string): Promise<Generation | null> {
    const db = await getDb()
    const [generation] = await db
      .select()
      .from(generations)
      .where(eq(generations.id, id))
    return generation || null
  }
}

export const generationManager = new GenerationManager()
