"use client"

import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { toast } from "sonner"

export default function ArchitecturePage() {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("")
  const [generating, setGenerating] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("请输入内容描述")
      return
    }

    // 显示禁用提示
    toast.error("当前为 Demo 示例，由于访问人数过高已临时禁用生成功能。可以通过扣子编程创建类似项目。")
  }

  const handleDownload = async () => {
    if (!imageUrl) return
    try {
      const link = document.createElement("a")
      link.href = imageUrl
      link.download = `architecture-${Date.now()}.png`
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

  const handleCopyLink = async () => {
    if (!imageUrl) return
    try {
      await navigator.clipboard.writeText(imageUrl)
      toast.success("链接已复制")
    } catch (error) {
      toast.error("复制失败")
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8" style={{ color: "#ffffff" }}>架构图生成</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
          {/* 左侧输入区 */}
          <div className="space-y-6">
            <div className="rounded-3xl p-6" style={{ backgroundColor: "#0a0a0a" }}>
              <label className="block text-white/90 font-medium mb-3">
                内容描述 *
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="请输入要生成架构图的内容，例如系统架构、技术栈、服务关系等..."
                className="w-full h-64 text-white px-4 py-3 rounded-xl focus:outline-none resize-none"
                style={{ backgroundColor: "#171717", border: "1px solid #262626" }}
              />
            </div>

            <div className="rounded-3xl p-6" style={{ backgroundColor: "#0a0a0a" }}>
              <label className="block text-white/90 font-medium mb-3">
                风格描述（选填）
              </label>
              <input
                type="text"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder="例如：现代简约、科技感、层次清晰..."
                className="w-full text-white px-4 py-3 rounded-xl focus:outline-none"
                style={{ backgroundColor: "#171717", border: "1px solid #262626" }}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
              className="w-full py-4 font-bold rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 flex items-center justify-center gap-2"
              style={{ backgroundColor: "#D6FF38", color: "#000000" }}
            >
              {generating ? (
                <>
                  <LoadingSpinner className="w-5 h-5" />
                  生成中...
                </>
              ) : (
                "开始生成架构图"
              )}
            </button>
          </div>

          {/* 右侧预览区 */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-[#0a0a0a] overflow-hidden">
              <div className="aspect-[4096/2304] relative">
                {!imageUrl && !generating ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🏗️</div>
                      <p className="text-lg text-white/90">输入内容后，点击"开始生成架构图"</p>
                      <p className="text-sm mt-2 text-white/60">将生成 2304 × 4096 的 4K 高清图片</p>
                    </div>
                  </div>
                ) : generating ? (
                  <div className="absolute inset-0 bg-[#030712] p-6">
                    <Skeleton className="w-full h-full" style={{ animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
                      <LoadingSpinner className="w-12 h-12 mx-auto mb-3" />
                      <p className="text-white/90 text-lg font-medium">AI 正在生成中...</p>
                      <p className="text-white/60 text-sm mt-1">请稍候，通常需要 10-30 秒</p>
                    </div>
                  </div>
                ) : imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt="架构图"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={handleDownload}
                        className="px-4 py-2 rounded-xl font-medium transition-all hover:opacity-90"
                        style={{ backgroundColor: "#D6FF38", color: "#000000" }}
                      >
                        下载
                      </button>
                      <button
                        onClick={handleCopyLink}
                        className="px-4 py-2 rounded-xl font-medium transition-all hover:opacity-90"
                        style={{ backgroundColor: "rgba(26, 31, 38, 0.8)", color: "#ffffff" }}
                      >
                        复制链接
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
