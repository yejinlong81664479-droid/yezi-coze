import { NextRequest } from "next/server"
import { ImageGenerationClient, Config, LLMClient } from "coze-coding-dev-sdk"
import { S3Storage } from "coze-coding-dev-sdk"
import { generationManager } from "@/storage/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { storyText, style = "", pageCount = 5 } = body

    if (!storyText || storyText.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "请输入故事内容" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    // 创建 SSE 流
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (data: any) => {
          const event = `data: ${JSON.stringify(data)}\n\n`
          controller.enqueue(encoder.encode(event))
        }

        try {
          const config = new Config()
          const llmClient = new LLMClient(config)
          const imageClient = new ImageGenerationClient(config)

          console.log(`开始生成漫画，页数：${pageCount}`)

          const storage = new S3Storage({
            endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
            bucketName: process.env.COZE_BUCKET_NAME,
            region: "cn-beijing",
          })

          // 创建数据库记录
          const generation = await generationManager.createGeneration({
            type: "comic",
            prompt: storyText,
            style: style || undefined,
            pageCount: 1,
          })

          // 使用 LLM 拆分故事为不同场景
          const llmMessages = [
            {
              role: "system" as const,
              content: `你是一个专业的漫画编剧。你的任务是将用户提供的故事内容拆分成不同的漫画分镜场景。

请按照以下格式输出：
1. 每个分镜必须用一个大自然段的形式输出
2. 不要使用任何 markdown 语法，不要使用列表符号
3. 每个场景描述包含：场景编号（用"场景1"、"场景2"开头）、画面描述、人物动作和表情、背景环境
4. 每个段落独立成段，段落之间用空行分隔
5. 必须生成 ${pageCount} 个场景，确保故事连贯且适合漫画表现

示例输出格式：

场景1 一个阳光明媚的早晨，小明站在窗前，望着远处的山脉。阳光透过窗户洒在小明的脸上，他微笑着，眼神充满期待，手里还紧紧握着一张地图。房间里简洁温馨，墙上挂着几幅山水画，书桌上堆满了各种登山装备。

场景2 小明穿着登山装备，正在攀登陡峭的山路，背景是蓝天白云。山路上布满了碎石和杂草，小明咬紧牙关努力向上攀爬，汗水从额头滴落，呼吸有些急促。远处的山峰若隐若现，云雾缭绕，景色壮观。

请按照上面的格式输出，不要使用 JSON 格式，不要使用 markdown 语法。`,
            },
            {
              role: "user" as const,
              content: `故事内容：${storyText}${style ? `\n画风风格：${style}` : ""}`,
            },
          ]

          sendEvent({ type: "status", message: "正在拆分故事场景..." })

          // 使用流式调用，边生成边发送
          let fullSceneText = ""
          let chunkCount = 0
          let firstChunkTime: number | null = null

          console.log("开始 LLM 流式调用，参数：", {
            temperature: 0.7,
            model: "doubao-seed-1-6-251015",
            thinking: "disabled",
          })

          const startTime = Date.now()
          const stream = await llmClient.stream(llmMessages, {
            temperature: 0.7,
            model: "doubao-seed-1-6-251015",
            thinking: "disabled", // 关闭思考模式，加快响应速度
          })

          for await (const chunk of stream) {
            const content = chunk.content || ""

            if (firstChunkTime === null) {
              firstChunkTime = Date.now()
              console.log(`⏱️ 首个 chunk 到达，耗时：${firstChunkTime - startTime}ms`)
            }

            chunkCount++
            fullSceneText += content

            console.log(`📦 Chunk #${chunkCount}: ${content.length} 字符 | 累计: ${fullSceneText.length} 字符`)

            // 发送文本片段到前端
            sendEvent({
              type: "scenes_text_chunk",
              content: content,
              fullContent: fullSceneText,
            })
          }

          const endTime = Date.now()
          console.log(`✅ 场景文本生成完成：`)
          console.log(`   - 总时长: ${endTime - startTime}ms`)
          console.log(`   - Chunk 数量: ${chunkCount}`)
          console.log(`   - 首字延迟: ${firstChunkTime ? firstChunkTime - startTime : 0}ms`)
          console.log(`   - 文本长度: ${fullSceneText.length} 字符`)

          // 将场景文本转换为场景列表（用于生图）
          let sceneList: Array<{ scene: number; description: string; action: string }> = []

          // 按段落分割场景
          const paragraphs = fullSceneText.split(/\n\n+/).filter((p: string) => p.trim())

          sceneList = paragraphs.map((para: string, index: number) => {
            const sceneNum = index + 1
            // 提取场景描述（去掉"场景X"前缀）
            const cleanPara = para.replace(/^场景\d+\s*/, "").trim()
            return {
              scene: sceneNum,
              description: cleanPara,
              action: "",
            }
          })

          console.log(`拆分出 ${sceneList.length} 个场景`)

          // 发送场景数量
          sendEvent({ type: "scenes", count: sceneList.length })

          // 并行生成所有场景图片，最多同时生成3张
          const maxConcurrency = 3
          const imageUrls: string[] = new Array(sceneList.length).fill("")
          const imageKeys: string[] = new Array(sceneList.length).fill("")

          // 并发控制函数
          async function runConcurrent<T>(
            tasks: Array<() => Promise<T>>,
            limit: number
          ): Promise<T[]> {
            const results: T[] = []
            const executing: Promise<unknown>[] = []

            for (const task of tasks) {
              const promise = task()
              const index = executing.length

              executing.push(promise)

              promise.then((result) => {
                results[index] = result
              })

              // 超过并发限制时，等待一个完成
              if (executing.length >= limit) {
                await Promise.race(executing)
              }
            }

            await Promise.all(executing)
            return results
          }

          // 创建生成任务
          const generateTasks = sceneList.map((scene, index) => {
            return async () => {
              sendEvent({ type: "status", message: `正在生成第 ${index + 1} 张图片...` })

              // 构建每个场景的提示词，统一添加黑白日漫风格
              const prompt = `黑白日漫风格，${scene.description}${scene.action ? `，${scene.action}` : ""}${style ? `，${style}` : ""}`

              console.log(`生成第 ${index + 1} 张图片，提示词：${prompt}`)

              const response = await imageClient.generate({
                prompt: prompt,
                size: "2560x1440", // 2K 高清，适合漫画分镜
                watermark: false,
              })

              const helper = imageClient.getResponseHelper(response)

              if (!helper.success || helper.imageUrls.length === 0) {
                throw new Error(`第 ${index + 1} 张图片生成失败`)
              }

              // 上传图片到对象存储
              const key = await storage.uploadFromUrl({ url: helper.imageUrls[0] })
              const presignedUrl = await storage.generatePresignedUrl({
                key,
                expireTime: 2592000, // 30 天
              })

              return { index, key, url: presignedUrl }
            }
          })

          try {
            // 执行并发任务
            const results = await runConcurrent(generateTasks, maxConcurrency)

            // 按顺序保存结果
            const imageKeys: string[] = new Array(sceneList.length).fill("")
            results.forEach(({ index, key, url }) => {
              imageKeys[index] = key
              imageUrls[index] = url
            })

            // 发送进度更新（所有图片已完成）
            for (let i = 0; i < sceneList.length; i++) {
              sendEvent({
                type: "progress",
                index: i,
                total: sceneList.length,
                url: imageUrls[i],
              })
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            console.error("图片生成失败:", errorMessage)
            sendEvent({ type: "error", message: errorMessage })
            controller.close()
            return
          }

          // 更新数据库记录（保存 key 和 URL）
          await generationManager.updateGeneration(generation.id, { imageUrls, imageKeys })

          try {
            // 执行并发任务
            const results = await runConcurrent(generateTasks, maxConcurrency)

            // 按顺序保存结果
            results.forEach(({ index, url }) => {
              imageUrls[index] = url
            })

            // 发送进度更新（所有图片已完成）
            for (let i = 0; i < sceneList.length; i++) {
              sendEvent({
                type: "progress",
                index: i,
                total: sceneList.length,
                url: imageUrls[i],
              })
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            console.error("图片生成失败:", errorMessage)
            sendEvent({ type: "error", message: errorMessage })
            controller.close()
            return
          }

          // 更新数据库记录
          await generationManager.updateGeneration(generation.id, { imageUrls })

          // 发送完成事件
          sendEvent({
            type: "complete",
            data: {
              id: generation.id,
              imageUrls,
              sceneCount: sceneList.length,
            },
          })

          controller.close()
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error)
          console.error("漫画生成失败:", error)
          console.error("错误详情:", errorMessage)
          sendEvent({ type: "error", message: errorMessage })
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    })
  } catch (error) {
    console.error("漫画生成失败:", error)
    return new Response(
      JSON.stringify({ success: false, error: "漫画生成失败" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
