import { NextRequest, NextResponse } from "next/server"
import { ImageGenerationClient, Config, LLMClient } from "coze-coding-dev-sdk"
import { S3Storage } from "coze-coding-dev-sdk"
import { generationManager } from "@/storage/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, pageCount = 5, style = "" } = body

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "请输入内容描述" },
        { status: 400 }
      )
    }

    const config = new Config()
    const llmClient = new LLMClient(config)
    const imageClient = new ImageGenerationClient(config)

    const storage = new S3Storage({
      endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
      bucketName: process.env.COZE_BUCKET_NAME,
      region: "cn-beijing",
    })

    // 创建数据库记录
    const generation = await generationManager.createGeneration({
      type: "ppt",
      prompt,
      style: style || undefined,
      pageCount,
    })

    // 判断用户需求是否详细（超过150字认为是详细需求）
    const isDetailed = prompt.trim().length > 150

    // 使用 LLM 生成 PPT 大纲
    let outlinePrompt = ""
    if (isDetailed) {
      // 详细需求：直接转换为 PPT 大纲，不修改措辞
      outlinePrompt = `请将以下详细需求转换为一个 ${pageCount} 页的 PPT 大纲。

要求：
1. 每页输出一个长自然段
2. 主体内容必须完全基于用户的原始措辞，不要修改用户的表达方式
3. 每页结尾添加一句风格描述（例如：风格简洁专业、风格色彩丰富等）
4. 保持用户的原始意图和逻辑结构
5. 输出格式必须是纯文本，每页占一行，不要使用 JSON、markdown 或其他格式

用户需求：
${prompt}

请直接输出 ${pageCount} 页的 PPT 大纲，每页一行，纯文本格式：`
    } else {
      // 简单需求：扩展成丰富的逐页 PPT 大纲
      outlinePrompt = `用户想要制作一个关于"${prompt}"的 PPT，共 ${pageCount} 页。

请扩展这个主题，生成一个丰富的逐页 PPT 大纲。

要求：
1. 第1页是标题页，包含主题和副标题
2. 中间 ${pageCount - 2} 页是核心内容页，每页详细阐述一个方面
3. 最后一页是总结或致谢页
4. 每页输出一个长自然段，主体是详细的内容描述
5. 每页结尾添加一句风格描述（例如：风格简洁专业、风格色彩丰富等）
6. ${style ? `整体风格要求：${style}` : "整体风格专业简洁"}
7. 输出格式必须是纯文本，每页占一行，不要使用 JSON、markdown 或其他格式

请直接输出 ${pageCount} 页的 PPT 大纲，每页一行，纯文本格式：`
    }

    const llmResponse = await llmClient.invoke(
      [
        {
          role: "system",
          content:
            "你是一个专业的 PPT 内容规划专家，擅长将用户需求转换为结构清晰、逻辑严谨的 PPT 大纲。",
        },
        {
          role: "user",
          content: outlinePrompt,
        },
      ],
      {
        model: "doubao-seed-1-6-flash-250615",
        temperature: 0.7,
        thinking: "disabled",
      }
    )

    // 解析大纲，按行分割
    const outline = llmResponse.content
      .trim()
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .slice(0, pageCount)

    // 为每一页 PPT 生成图片
    const imageKeys: string[] = []
    const imageUrls: string[] = []
    const pagePromises = []

    for (let i = 0; i < outline.length; i++) {
      const pageOutline = outline[i].trim()

      pagePromises.push(
        (async () => {
          const response = await imageClient.generate({
            prompt: pageOutline,
            size: "4096x2304", // 4K 高清，横向
            watermark: false,
          })

          const helper = imageClient.getResponseHelper(response)
          if (helper.success && helper.imageUrls.length > 0) {
            // 上传到对象存储
            const key = await storage.uploadFromUrl({
              url: helper.imageUrls[0],
            })

            // 生成签名 URL
            const signedUrl = await storage.generatePresignedUrl({
              key,
              expireTime: 2592000, // 30 天
            })

            return { key, url: signedUrl }
          }
          return null
        })()
      )
    }

    const results = await Promise.all(pagePromises)

    results.forEach((result) => {
      if (result) {
        imageKeys.push(result.key)
        imageUrls.push(result.url)
      }
    })

    // 更新数据库记录（保存 key 和 URL）
    await generationManager.updateGeneration(generation.id, { imageUrls, imageKeys })

    return NextResponse.json({
      success: true,
      data: {
        id: generation.id,
        imageUrls,
        outline,
      },
    })
  } catch (error) {
    console.error("PPT 生成失败:", error)
    return NextResponse.json(
      { success: false, error: "PPT 生成失败" },
      { status: 500 }
    )
  }
}
