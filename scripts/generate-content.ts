#!/usr/bin/env node

/**
 * 自动生成测试内容脚本
 * 生成5个不同主题的PPT和5个不同主题的漫画
 */

const BASE_URL = "http://localhost:5000"

// 5个PPT主题
const pptTopics = [
  {
    topic: "人工智能发展趋势",
    description: "探讨人工智能技术的发展历程、当前应用场景以及未来发展趋势，包括大语言模型、计算机视觉、自动驾驶等领域的最新进展",
  },
  {
    topic: "气候变化与可持续发展",
    description: "分析全球气候变化的现状、影响因素以及应对策略，重点介绍可再生能源、节能减排、绿色经济等可持续发展解决方案",
  },
  {
    topic: "数字化转型与企业创新",
    description: "讲解企业在数字经济时代如何进行数字化转型，包括云计算、大数据、物联网等技术的应用，以及创新管理模式和组织架构调整",
  },
  {
    topic: "太空探索与人类未来",
    description: "回顾人类太空探索的历史成就，介绍当前火星探测、月球基地建设等前沿项目，展望人类在太空中的未来发展愿景",
  },
  {
    topic: "智慧城市建设",
    description: "阐述智慧城市的概念、核心技术体系，以及智能交通、智慧医疗、智能安防等应用场景，探讨如何提升城市治理效率和居民生活质量",
  },
]

// 5个漫画故事主题
const comicStories = [
  {
    title: "机器人小明的一天",
    story: "机器人小明每天早上六点准时起床，开始他在智能工厂的忙碌一天。他熟练地操作着各种设备，与人类同事默契配合。下班后，他来到机器人充电站，和其他机器人朋友分享今天的趣事，虽然他是个机器人，但内心充满了对生活的热爱和对友谊的珍视。",
  },
  {
    title: "小熊的冒险之旅",
    story: "小熊踏上了寻找传说中的蜂蜜森林的冒险旅程。路上他遇到了机智的小松鼠、勇敢的兔子，还有有点胆小的刺猬。他们一起克服了湍急的河流、陡峭的山峰，最终找到了满山遍野的花朵和甜美的蜂蜜。小熊明白了最珍贵的是朋友间的陪伴和团结",
  },
  {
    title: "月球基地的守护者",
    story: "2050年，月球基地的工程师阿星每天维护着基地的生命维持系统。一天，突如其来的太阳风暴袭击月球，电力系统濒临崩溃。阿星必须在有限的氧气时间内修复关键设备，他和团队临危不乱，成功化解了危机。这次经历让他更加坚定了对太空探索的信念",
  },
  {
    title: "猫咪侦探的破案故事",
    story: "小镇上发生了一起神秘的珠宝失窃案。猫咪侦探奥斯卡凭借敏锐的嗅觉和观察力，发现了几个可疑的线索。它跟踪脚印到附近的老树屋，发现了贪心的乌鸦和它藏起来的珠宝。奥斯卡巧妙地设计了一个陷阱，成功找回了珠宝，成为了小镇的英雄",
  },
  {
    title: "时间旅行者的奇遇",
    story: "科学家李明发明了时间机器，决定回到古代拜访李白。他穿越到唐朝，与诗人一起饮酒作诗，欣赏长安的繁华。在返回现代时，机器出现故障，他被送到了未来世界，那里人类已经实现了星际旅行。李明带着两个时代的记忆回到了现在，成为了连接古今的传奇人物",
  },
]

// 延迟函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 生成PPT
async function generatePPT(topic: string, description: string, index: number) {
  console.log(`\n[${index + 1}/5] 开始生成PPT: ${topic}`)
  console.log(`主题描述: ${description.substring(0, 50)}...`)

  try {
    const response = await fetch(`${BASE_URL}/api/generate/ppt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: description,
        pageCount: 5,
        style: "专业简洁",
      }),
    })

    const result = await response.json()

    if (result.success) {
      console.log(`✅ PPT生成成功: ${topic}`)
      console.log(`   生成ID: ${result.data.id}`)
      console.log(`   页数: ${result.data.outline.length}`)
      console.log(`   图片数量: ${result.data.imageUrls.length}`)
    } else {
      console.error(`❌ PPT生成失败: ${topic}`)
      console.error(`   错误信息: ${result.error}`)
    }
  } catch (error) {
    console.error(`❌ PPT生成出错: ${topic}`)
    console.error(`   错误: ${error}`)
  }
}

// 生成漫画（SSE流式）
async function generateComic(title: string, story: string, index: number) {
  console.log(`\n[${index + 1}/5] 开始生成漫画: ${title}`)
  console.log(`故事简介: ${story.substring(0, 50)}...`)

  try {
    const response = await fetch(`${BASE_URL}/api/generate/comic`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        storyText: story,
        pageCount: 5,
        style: "黑白日漫风格",
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error("无法获取响应流")
    }

    let buffer = ""
    let imageCount = 0
    let statusMessages: string[] = []

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop() || ""

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6))

            if (data.type === "status") {
              statusMessages.push(data.message)
              console.log(`   ${data.message}`)
            } else if (data.type === "scenes") {
              console.log(`   拆分出 ${data.count} 个场景`)
            } else if (data.type === "image_generated") {
              imageCount++
              console.log(`   ✅ 图片 ${imageCount} 生成完成`)
            } else if (data.type === "complete") {
              console.log(`✅ 漫画生成成功: ${title}`)
              console.log(`   总图片数: ${data.data?.imageUrls?.length || 0}`)
              console.log(`   生成ID: ${data.data?.id}`)
            } else if (data.type === "error") {
              console.error(`❌ 错误: ${data.message}`)
            }
          } catch (e) {
            // 忽略JSON解析错误
          }
        }
      }
    }
  } catch (error) {
    console.error(`❌ 漫画生成出错: ${title}`)
    console.error(`   错误: ${error}`)
  }
}

// 主函数
async function main() {
  console.log("========================================")
  console.log("  Dreambox 内容生成脚本")
  console.log("========================================")
  console.log(`\n开始时间: ${new Date().toLocaleString("zh-CN")}`)

  // 生成5个PPT
  console.log("\n📊 开始生成5个不同主题的PPT...")
  console.log("----------------------------------------")

  for (let i = 0; i < pptTopics.length; i++) {
    const { topic, description } = pptTopics[i]
    await generatePPT(topic, description, i)

    // 每个PPT之间延迟10秒，避免API限流
    if (i < pptTopics.length - 1) {
      console.log("\n⏳ 等待10秒后继续...")
      await delay(10000)
    }
  }

  console.log("\n✅ PPT生成完成！")
  console.log("\n🎬 开始生成5个不同主题的漫画...")
  console.log("----------------------------------------")

  // 生成5个漫画
  for (let i = 0; i < comicStories.length; i++) {
    const { title, story } = comicStories[i]
    await generateComic(title, story, i)

    // 每个漫画之间延迟15秒，避免API限流
    if (i < comicStories.length - 1) {
      console.log("\n⏳ 等待15秒后继续...")
      await delay(15000)
    }
  }

  console.log("\n✅ 漫画生成完成！")

  console.log("\n========================================")
  console.log(`完成时间: ${new Date().toLocaleString("zh-CN")}`)
  console.log("========================================")
  console.log("\n🎉 所有内容生成完成！")
  console.log("你可以在 http://localhost:5000 查看生成的作品")
}

// 运行脚本
main().catch(error => {
  console.error("\n❌ 脚本执行失败:", error)
  process.exit(1)
})
