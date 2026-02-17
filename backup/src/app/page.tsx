"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { CardSpotlight } from "@/components/ui/card-spotlight"
import { BarChart3, TrendingUp, Building2, BookOpen } from "lucide-react"

type GenerationType = "all" | "ppt" | "infographic" | "architecture" | "comic"

interface Generation {
  id: string
  type: "ppt" | "infographic" | "architecture" | "comic"
  prompt: string
  imageUrls: string[] | null
  createdAt: string
}

const cardData = [
  {
    id: "ppt",
    title: "PPT 生成",
    description: "基于 AI 生成专业的演示文稿",
    icon: <BarChart3 className="w-12 h-12 text-[#D6FF38]" />,
    color: "#1E40AF",
    link: "/ppt",
  },
  {
    id: "infographic",
    title: "信息图生成",
    description: "快速创建精美的信息图表",
    icon: <TrendingUp className="w-12 h-12 text-[#D6FF38]" />,
    color: "#065F46",
    link: "/infographic",
  },
  {
    id: "architecture",
    title: "架构图生成",
    description: "可视化呈现系统技术架构",
    icon: <Building2 className="w-12 h-12 text-[#D6FF38]" />,
    color: "#581C87",
    link: "/architecture",
  },
  {
    id: "comic",
    title: "漫画生成",
    description: "AI 拆分故事并生成连贯风格漫画",
    icon: <BookOpen className="w-12 h-12 text-[#D6FF38]" />,
    color: "#7C2D12",
    link: "/comic",
  },
]

const typeLabels: Record<GenerationType, string> = {
  all: "全部",
  ppt: "PPT",
  infographic: "信息图",
  architecture: "架构图",
  comic: "漫画",
}



export default function Home() {
  const [selectedType, setSelectedType] = useState<GenerationType>("all")
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGenerations()
  }, [selectedType])

  const fetchGenerations = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedType !== "all") {
        params.append("type", selectedType)
      }
      const response = await fetch(`/api/generations?${params}`)
      const result = await response.json()
      if (result.success) {
        setGenerations(result.data)
      }
    } catch (error) {
      console.error("获取历史记录失败:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* 欢迎区域 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#ffffff" }}>
            Dreambox - AI 生图工具箱
          </h1>
          <p style={{ color: "rgba(255, 255, 255, 0.6)" }}>
            欢迎回来，开始你的创作之旅 👋
          </p>
        </div>

        {/* 功能卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {cardData.map((card) => (
            <Link
              key={card.id}
              href={card.link}
            >
              <CardSpotlight
                radius={350}
                color={card.color}
                className="h-full"
              >
                <div className="relative z-20">
                  <div className="mb-4 flex justify-center">{card.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-neutral-200">{card.description}</p>
                </div>
              </CardSpotlight>
            </Link>
          ))}
        </div>

        {/* 类型筛选 */}
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-xl font-semibold text-white">历史作品</h2>
          <div className="flex gap-2">
            {(["all", "ppt", "infographic", "architecture", "comic"] as GenerationType[]).map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:opacity-80"
                  style={{
                    backgroundColor: selectedType === type ? "#D6FF38" : "transparent",
                    color: selectedType === type ? "#000000" : "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  {typeLabels[type]}
                </button>
              )
            )}
          </div>
        </div>

        {/* 瀑布流 */}
        {loading ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {[...Array(6)].map((_, i) => {
              const skeletonHeights = [280, 340, 420, 310, 450, 380]
              return (
                <div
                  key={i}
                  className="rounded-3xl bg-[#0a0a0a] overflow-hidden break-inside-avoid"
                >
                  <div className="relative">
                    <Skeleton className="w-full" style={{ height: `${skeletonHeights[i % skeletonHeights.length]}px` }} />
                    <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : generations.length === 0 ? (
          <div className="text-center py-20 text-white/60">
            <p className="text-lg">暂无历史作品，快去创作吧！</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {generations.map((gen) => (
              <div
                key={gen.id}
                className="group rounded-3xl bg-[#0a0a0a] overflow-hidden hover:scale-[1.02] transition-all duration-300 break-inside-avoid"
              >
                <div className="relative">
                  {gen.imageUrls && gen.imageUrls.length > 0 ? (
                    gen.type === "ppt" || gen.type === "comic" ? (
                      <div className="flex flex-col">
                        {gen.imageUrls.map((url, idx) => {
                          const isLast = idx === gen.imageUrls!.length - 1
                          return (
                            <div key={idx} className="relative">
                              <img
                                src={url}
                                alt={`${gen.prompt} - ${gen.type === "ppt" ? "页面" : "分镜"} ${idx + 1}`}
                                className="w-full h-auto object-cover"
                                style={{ borderBottom: !isLast ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                              />
                              {isLast && (
                                <>
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                  <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <p className="text-white/90 text-sm font-medium line-clamp-2">
                                      {gen.prompt}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <span className="text-xs text-white/60 capitalize">
                                        {typeLabels[gen.type]}
                                      </span>
                                      <span className="text-xs text-white/50">
                                        {new Date(gen.createdAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <>
                        <img
                          src={gen.imageUrls[0]}
                          alt={gen.prompt}
                          className="w-full h-auto object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white/90 text-sm font-medium line-clamp-2">
                            {gen.prompt}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-white/60 capitalize">
                              {typeLabels[gen.type]}
                            </span>
                            <span className="text-xs text-white/50">
                              {new Date(gen.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </>
                    )
                  ) : (
                    <>
                      <div className="w-full flex flex-col items-center justify-center bg-[#030712] text-white/60 min-h-[200px]">
                        <span className="text-4xl mb-2">
                          {gen.type === "ppt"
                            ? "📊"
                            : gen.type === "infographic"
                            ? "📈"
                            : gen.type === "architecture"
                            ? "🏗️"
                            : "🎨"}
                        </span>
                        <p className="text-sm">暂无图片</p>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white/90 text-sm font-medium line-clamp-2">
                          {gen.prompt}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-white/60 capitalize">
                            {typeLabels[gen.type]}
                          </span>
                          <span className="text-xs text-white/50">
                            {new Date(gen.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}