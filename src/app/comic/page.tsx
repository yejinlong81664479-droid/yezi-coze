"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { toast } from "sonner"

interface ComicFrame {
  id: number
  url: string | null
  loading: boolean
}

export default function ComicPage() {
  const [storyText, setStoryText] = useState("")
  const [style, setStyle] = useState("")
  const [generating, setGenerating] = useState(false)
  const [frames, setFrames] = useState<ComicFrame[]>([])
  const [status, setStatus] = useState("")
  const [sceneCount, setSceneCount] = useState(0)
  const [sceneText, setSceneText] = useState("")
  const [pageCount, setPageCount] = useState(5)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    if (!storyText.trim()) {
      toast.error("请输入漫画故事内容")
      return
    }

    // 显示禁用提示
    toast.error("当前为 Demo 示例，由于访问人数过高已临时禁用生成功能。可以通过扣子编程创建类似项目。")
  }

  const handleDownload = async (url: string, index: number) => {
    try {
      const link = document.createElement("a")
      link.href = url
      link.download = `comic-frame-${index + 1}.png`
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success("下载已开始")
    } catch (error) {
      console.error("下载失败:", error)
      toast.error("下载失败，请重试")
    }
  }

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success("链接已复制")
    } catch (error) {
      toast.error("复制失败")
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden w-full">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8" style={{ color: "#ffffff" }}>漫画生成</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6 lg:gap-8 w-full">
          {/* 左侧输入区 */}
          <div className="space-y-4 md:space-y-6">
            <div className="rounded-3xl p-4 md:p-6" style={{ backgroundColor: "#0a0a0a" }}>
              <label className="block text-white/90 font-medium mb-2 md:mb-3 text-sm md:text-base">
                故事内容 *
              </label>
              <textarea
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                placeholder="请输入漫画的完整故事内容，AI 会自动拆分成不同的场景和画面..."
                className="w-full h-48 md:h-64 text-white px-3 md:px-4 py-2 md:py-3 rounded-xl focus:outline-none resize-none text-sm md:text-base"
                style={{ backgroundColor: "#171717", border: "1px solid #262626" }}
              />
            </div>

            <div className="rounded-3xl p-4 md:p-6" style={{ backgroundColor: "#0a0a0a" }}>
              <label className="block text-white/90 font-medium mb-2 md:mb-3 text-sm md:text-base">
                画风描述（选填）
              </label>
              <input
                type="text"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder="例如：日式漫画风格、美式漫画风格、赛博朋克、治愈系..."
                className="w-full text-white px-3 md:px-4 py-2 md:py-3 rounded-xl focus:outline-none text-sm md:text-base"
                style={{ backgroundColor: "#171717", border: "1px solid #262626" }}
              />
            </div>

            <div className="rounded-3xl p-4 md:p-6" style={{ backgroundColor: "#0a0a0a" }}>
              <label className="block text-white/90 font-medium mb-2 md:mb-3 text-sm md:text-base">
                漫画页数
              </label>
              <select
                value={pageCount}
                onChange={(e) => setPageCount(Number(e.target.value))}
                className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl text-white focus:outline-none cursor-pointer text-sm md:text-base"
                style={{ backgroundColor: "#171717", border: "1px solid #262626" }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    {num} 页
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating || !storyText.trim()}
              className="w-full py-3 md:py-4 px-6 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 text-sm md:text-base"
              style={{ backgroundColor: "#D6FF38", color: "#000000" }}
            >
              {generating ? "生成中..." : "开始生成漫画"}
            </button>
          </div>

          {/* 右侧预览区 */}
          <div className="space-y-6">
            {error && (
              <div className="rounded-3xl p-6" style={{ backgroundColor: "#450a0a", border: "1px solid #7f1d1d" }}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">❌</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">生成失败</h3>
                    <p className="text-white/80 text-sm">{error}</p>
                  </div>
                  <button
                    onClick={() => setError("")}
                    className="text-white/60 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {generating || frames.length > 0 ? (
              <div className="rounded-3xl bg-[#0a0a0a] overflow-hidden">
                {status && (
                  <div className="p-3 md:p-4 border-b" style={{ borderColor: "#262626" }}>
                    <div className="flex items-center gap-3">
                      <LoadingSpinner className="w-4 h-4 md:w-5 md:h-5" />
                      <p className="text-white/90 text-xs md:text-sm">{status}</p>
                    </div>
                  </div>
                )}
                {sceneText && (
                  <div className="p-4 md:p-6 border-b" style={{ borderColor: "#262626" }}>
                    <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">故事场景</h3>
                    <div className="space-y-3 md:space-y-4">
                      {sceneText.split(/\n\n+/).map((paragraph, index) => (
                        <div key={index} className="p-3 md:p-4 rounded-xl" style={{ backgroundColor: "#171717" }}>
                          <p className="text-white/90 whitespace-pre-wrap leading-relaxed text-sm md:text-base">{paragraph}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {frames.length > 0 ? (
                  <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                    {frames.map((frame) => (
                      <div key={frame.id} className="relative rounded-3xl overflow-hidden">
                        {frame.loading ? (
                          <div className="aspect-[16/9]">
                            <Skeleton className="w-full h-full" style={{ animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
                          </div>
                        ) : frame.url ? (
                          <>
                            <img
                              src={frame.url}
                              alt={`漫画分镜 ${frame.id + 1}`}
                              className="w-full h-auto"
                            />
                            <div className="absolute top-3 md:top-4 right-3 md:right-4 flex gap-1 md:gap-2">
                              <button
                                onClick={() => handleCopyLink(frame.url!)}
                                className="px-2 md:px-4 py-1 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all hover:opacity-80"
                                style={{ backgroundColor: "rgba(0,0,0,0.7)", color: "#ffffff" }}
                              >
                                复制链接
                              </button>
                              <button
                                onClick={() => handleDownload(frame.url!, frame.id)}
                                className="px-2 md:px-4 py-1 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all hover:opacity-80"
                                style={{ backgroundColor: "#D6FF38", color: "#000000" }}
                              >
                                下载
                              </button>
                            </div>
                            <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4">
                              <span
                                className="px-2 md:px-3 py-1 rounded-full text-xs font-medium"
                                style={{ backgroundColor: "rgba(0,0,0,0.7)", color: "#ffffff" }}
                              >
                                分镜 {frame.id + 1}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-[#030712] text-white/60">
                            <p>生成失败</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="rounded-3xl bg-[#0a0a0a] p-6 md:p-12 text-center">
                <div className="text-4xl md:text-6xl mb-3 md:mb-4">🎨</div>
                <p className="text-base md:text-lg text-white/90">输入故事内容后，点击"开始生成漫画"</p>
                <p className="text-xs md:text-sm text-white/60 mt-2">AI 会自动拆分场景并生成连续风格的漫画</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
