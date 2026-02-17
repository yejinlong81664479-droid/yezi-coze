import { NextRequest, NextResponse } from "next/server"
import { ImageGenerationClient, Config } from "coze-coding-dev-sdk"
import { S3Storage } from "coze-coding-dev-sdk"
import { generationManager } from "@/storage/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, style = "" } = body

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "请输入内容描述" },
        { status: 400 }
      )
    }

    const config = new Config()
    const client = new ImageGenerationClient(config)

    const storage = new S3Storage({
      endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
      bucketName: process.env.COZE_BUCKET_NAME,
      region: "cn-beijing",
    })

    // 创建数据库记录
    const generation = await generationManager.createGeneration({
      type: "architecture",
      prompt,
      style: style || undefined,
      pageCount: 1,
    })

    // 生成技术架构图
    const architecturePrompt = `技术架构图：${prompt} ${style ? `，风格：${style}` : ""}`

    const response = await client.generate({
      prompt: architecturePrompt,
      size: "4096x2304", // 4K 高清，横向
      watermark: false,
    })

    const helper = client.getResponseHelper(response)
    if (!helper.success || helper.imageUrls.length === 0) {
      return NextResponse.json(
        { success: false, error: "架构图生成失败" },
        { status: 500 }
      )
    }

    // 上传到对象存储
    const key = await storage.uploadFromUrl({
      url: helper.imageUrls[0],
    })

    // 生成签名 URL
    const signedUrl = await storage.generatePresignedUrl({
      key,
      expireTime: 2592000, // 30 天
    })

    // 更新数据库记录（保存 key 和 URL）
    await generationManager.updateGeneration(generation.id, {
      imageUrls: [signedUrl],
      imageKeys: [key],
    })

    return NextResponse.json({
      success: true,
      data: {
        id: generation.id,
        imageUrl: signedUrl,
      },
    })
  } catch (error) {
    console.error("架构图生成失败:", error)
    return NextResponse.json(
      { success: false, error: "架构图生成失败" },
      { status: 500 }
    )
  }
}
