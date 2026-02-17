"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Sparkles, Target, TrendingUp, BookOpen, ArrowLeft, ExternalLink } from "lucide-react"
import { useSidebar } from "@/contexts/SidebarContext"

// 智能体数据
const agents = [
  {
    id: "7606673064772091930",
    title: "模拟面试官",
    description: "模拟真实面试场景，提供即时反馈，帮助练习面试技巧",
    icon: "🎯",
    color: "#2563EB",
    chatUrl: "https://www.coze.cn/store/bot/7606673064772091930",
  },
  {
    id: "7607141289817735211",
    title: "复盘导师",
    description: "深度分析面试表现，识别问题并提供个性化改进建议",
    icon: "📊",
    color: "#059669",
    chatUrl: "https://www.coze.cn/store/bot/7607141289817735211",
  },
  {
    id: "7607480544884293647",
    title: "行业案例拆解",
    description: "拆解行业真实案例，帮助理解业务逻辑和行业趋势",
    icon: "💡",
    color: "#7C3AED",
    chatUrl: "https://www.coze.cn/store/agent/7607480544884293647?bot_id=true&bid=6j4qate1c0g18",
  },
]

// 欢迎首页组件
function WelcomePage() {
  const { setActiveAgent } = useSidebar()

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F8FAFC" }}>
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-3xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
              boxShadow: "0 20px 40px -10px rgba(37, 99, 235, 0.3)",
            }}
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "#1E293B" }}
          >
            欢迎使用求职导师
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg mb-8"
            style={{ color: "#64748B" }}
          >
            AI 面试助手平台，提供模拟面试、深度复盘和案例拆解三大核心功能，助你轻松应对各类面试挑战
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveAgent(agent)}
                className="bg-white rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl border border-gray-100 group text-left"
                style={{
                  boxShadow: `0 4px 20px -4px ${agent.color}15`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${agent.color}15` }}
                >
                  <span className="text-2xl">{agent.icon}</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: "#1E293B" }}>
                  {agent.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>
                  {agent.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="border-t p-8"
        style={{ borderColor: "#E2E8F0", backgroundColor: "#FFFFFF" }}
      >
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-6 text-center" style={{ color: "#1E293B" }}>
            为什么选择求职导师？
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#2563EB15" }}
              >
                <Target className="w-5 h-5" style={{ color: "#2563EB" }} />
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: "#1E293B" }}>
                  精准定位
                </h4>
                <p className="text-sm" style={{ color: "#64748B" }}>
                  针对不同岗位和面试场景，提供个性化指导
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#05966915" }}
              >
                <TrendingUp className="w-5 h-5" style={{ color: "#059669" }} />
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: "#1E293B" }}>
                  持续进步
                </h4>
                <p className="text-sm" style={{ color: "#64748B" }}>
                  深度复盘面试表现，不断优化提升
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#7C3AED15" }}
              >
                <BookOpen className="w-5 h-5" style={{ color: "#7C3AED" }} />
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: "#1E293B" }}>
                  实战案例
                </h4>
                <p className="text-sm" style={{ color: "#64748B" }}>
                  真实行业案例拆解，快速积累经验
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// 智能体嵌入组件 - 使用新窗口打开方式
function BotEmbed({ botId }: { botId: string }) {
  const { setActiveAgent } = useSidebar()
  const [isLoading, setIsLoading] = useState(true)

  const currentAgent = agents.find((a) => a.id === botId)

  // 打开新窗口访问智能体
  const openInNewWindow = () => {
    if (currentAgent?.chatUrl) {
      window.open(currentAgent.chatUrl, "_blank")
    }
  }

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: "#F8FAFC" }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-6 py-4 border-b flex-shrink-0"
        style={{ borderColor: "#E2E8F0", backgroundColor: "#FFFFFF" }}
      >
        <button
          onClick={() => setActiveAgent(null)}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-gray-100"
          title="返回首页"
        >
          <ArrowLeft className="w-5 h-5" style={{ color: "#64748B" }} />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: `${currentAgent?.color || "#2563EB"}15`,
            }}
          >
            <span className="text-2xl">{currentAgent?.icon || "🤖"}</span>
          </div>
          <div>
            <h2 className="font-semibold" style={{ color: "#1E293B" }}>
              {currentAgent?.title || "智能助手"}
            </h2>
            <p className="text-xs" style={{ color: "#64748B" }}>
              {currentAgent?.description || ""}
            </p>
          </div>
        </div>
        <button
          onClick={openInNewWindow}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: currentAgent?.color || "#2563EB" }}
        >
          <ExternalLink className="w-4 h-4" />
          在新窗口打开
        </button>
      </div>

      {/* iframe 嵌入 - 尝试加载 */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
            <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mb-4" />
            <p className="text-sm mb-4" style={{ color: "#64748B" }}>
              正在加载智能体...
            </p>
            <p className="text-xs" style={{ color: "#94A3B8" }}>
              如长时间未加载，请点击上方"在新窗口打开"
            </p>
          </div>
        )}
        <iframe
          src={currentAgent?.chatUrl}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          allow="microphone; camera; clipboard-write; clipboard-read; autoplay"
          style={{
            backgroundColor: "#FFFFFF",
          }}
        />
      </div>
    </div>
  )
}

export default function Home() {
  const { activeAgent } = useSidebar()

  if (!activeAgent) {
    return <WelcomePage />
  }

  return <BotEmbed botId={activeAgent.id} />
}
