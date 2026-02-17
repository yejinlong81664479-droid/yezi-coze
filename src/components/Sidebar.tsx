"use client"

import { useSidebar } from "@/contexts/SidebarContext"
import { Menu, X } from "lucide-react"

const agents = [
  {
    id: "7606673064772091930",
    label: "模拟面试官",
    icon: "🎯",
    path: "/",
  },
  {
    id: "7607141289817735211",
    label: "复盘导师",
    icon: "📊",
    path: "/",
  },
  {
    id: "7607480544884293647",
    label: "行业案例拆解",
    icon: "💡",
    path: "/",
  },
]

export default function Sidebar() {
  const { collapsed, toggleCollapsed, activeAgent, setActiveAgent } = useSidebar()

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen border-r transition-all duration-300 flex flex-col ${
        collapsed ? "w-16" : "w-64"
      }`}
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: "#E2E8F0",
      }}
    >
      {/* Header */}
      <div
        className={`border-b flex-shrink-0 transition-all duration-300 ${collapsed ? "py-4 px-2" : "px-5 py-4"}`}
        style={{ borderColor: "#E2E8F0" }}
      >
        {!collapsed ? (
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
              }}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <span className="text-lg font-bold block" style={{ color: "#1E293B" }}>
                求职导师
              </span>
              <p className="text-xs leading-relaxed mt-1" style={{ color: "#64748B" }}>
                点击下方选项卡进入智能体进行模拟练习
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
              }}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 flex flex-col gap-1 overflow-y-auto">
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => setActiveAgent(agent)}
            className={`w-full flex items-center gap-3 rounded-xl transition-all duration-200 hover:bg-gray-50 ${
              collapsed ? "flex-col py-3 px-1 gap-1" : "px-4 py-3"
            }`}
            style={{
              backgroundColor: activeAgent?.id === agent.id ? "#EFF6FF" : "transparent",
              color: activeAgent?.id === agent.id ? "#2563EB" : "#64748B",
            }}
          >
            <span className={collapsed ? "text-2xl" : "text-xl"}>{agent.icon}</span>
            {!collapsed && (
              <span className="font-medium whitespace-nowrap text-left">{agent.label}</span>
            )}
            {collapsed && (
              <span
                className="text-[10px] font-medium whitespace-nowrap text-center leading-tight"
                style={{ color: activeAgent?.id === agent.id ? "#2563EB" : "#64748B" }}
              >
                {agent.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Collapse Toggle Button */}
      <div className="p-3 border-t flex-shrink-0" style={{ borderColor: "#E2E8F0" }}>
        <button
          onClick={toggleCollapsed}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all hover:bg-gray-100"
          style={{ color: "#64748B" }}
        >
          {collapsed ? (
            <Menu className="w-5 h-5" />
          ) : (
            <>
              <X className="w-5 h-5" />
              <span className="text-sm font-medium">收起</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
