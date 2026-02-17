"use client"

import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface PPTImage {
  id: number
  url: string | null
  loading: boolean
}

export default function PPTPage() {
  const [pageCount, setPageCount] = useState(5)
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("")
  const [generating, setGenerating] = useState(false)
  const [images, setImages] = useState<PPTImage[]>([])

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("请输入内容描述")
      return
    }

    setGenerating(true)
    setImages(
      Array.from({ length: pageCount }, (_, i) => ({
        id: i,
        url: null,
        loading: true,
      }))
    )

    try {
      const response = await fetch("/api/generate/ppt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          pageCount,
          style,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setImages(
          result.data.imageUrls.map((url: string, i: number) => ({
            id: i,
            url,
            loading: false,
          }))
        )
      } else {
        alert(result.error || "生成失败")
        setGenerating(false)
      }
    } catch (error) {
      console.error("生成失败:", error)
      alert("生成失败，请重试")
      setGenerating(false)
    }
  }

  const handleDownload = async (url: string, index: number) => {
    try {
      const link = document.createElement("a")
      link.href = url
      link.download = `ppt-page-${index + 1}.png`
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("下载失败:", error)
      alert("下载失败，请重试")
    }
  }

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      alert("链接已复制")
    } catch (error) {
      alert("复制失败")
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8" style={{ color: "#ffffff" }}>PPT 生成</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
          {/* 左侧输入区 */}
          <div className="space-y-6">
            <div className="rounded-3xl p-6" style={{ backgroundColor: "#0a0a0a" }}>
              <label className="block text-white/90 font-medium mb-3">
                页数
              </label>
              <input
                type="number"
                value={pageCount}
                onChange={(e) => setPageCount(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full text-white px-4 py-3 rounded-xl focus:outline-none"
                style={{ backgroundColor: "#171717", border: "1px solid #262626" }}
                min="1"
                max="20"
              />
            </div>

            <div className="rounded-3xl p-6" style={{ backgroundColor: "#0a0a0a" }}>
              <label className="block text-white/90 font-medium mb-3">
                内容描述 *
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="请输入要生成 PPT 的内容，可以是一段长文本..."
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
                placeholder="例如：现代简约、科技感、商务专业..."
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
                "开始生成 PPT"
              )}
            </button>
          </div>

          {/* 右侧预览区 */}
          <div className="space-y-6">
            {images.length === 0 ? (
              <div className="rounded-3xl bg-[#0a0a0a] p-12 text-center">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-lg text-white/90">输入内容后，点击"开始生成 PPT"</p>
                <p className="text-sm mt-2 text-white/60">将生成 2304 × 4096 的 4K 高清图片</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="rounded-3xl bg-[#0a0a0a] overflow-hidden"
                  >
                    <div className="aspect-[4096/2304] relative">
                      {image.loading ? (
                        <div className="absolute inset-0 bg-[#030712] p-6">
                          <Skeleton className="w-full h-full" style={{ animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
                            <LoadingSpinner className="w-12 h-12 mx-auto mb-3" />
                            <p className="text-white/90 text-lg font-medium">正在生成第 {image.id + 1} 页...</p>
                            <p className="text-white/60 text-sm mt-1">请稍候，通常需要 10-30 秒</p>
                          </div>
                        </div>
                      ) : image.url ? (
                        <>
                          <img
                            src={image.url}
                            alt={`PPT 第 ${image.id + 1} 页`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 right-4 flex gap-2">
                            <button
                              onClick={() => handleDownload(image.url!, image.id)}
                              className="px-4 py-2 rounded-xl font-medium transition-all hover:opacity-90"
                              style={{ backgroundColor: "#D6FF38", color: "#000000" }}
                            >
                              下载
                            </button>
                            <button
                              onClick={() => handleCopyLink(image.url!)}
                              className="px-4 py-2 rounded-xl font-medium transition-all hover:opacity-90"
                              style={{ backgroundColor: "rgba(26, 31, 38, 0.8)", color: "#ffffff" }}
                            >
                              复制链接
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#030712] text-white/60">
                          生成失败
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
