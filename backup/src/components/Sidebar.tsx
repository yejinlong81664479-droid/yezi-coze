"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Presentation, BarChart2, Building, BookOpen, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/contexts/SidebarContext"

const navItems = [
  { id: "home", label: "首页", path: "/", icon: Home },
  { id: "ppt", label: "PPT", path: "/ppt", icon: Presentation },
  { id: "infographic", label: "信息图", path: "/infographic", icon: BarChart2 },
  { id: "architecture", label: "架构图", path: "/architecture", icon: Building },
  { id: "comic", label: "漫画", path: "/comic", icon: BookOpen },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { collapsed, toggleCollapsed } = useSidebar()

  const getActiveStyle = (path: string) => {
    if (pathname === path) {
      return { backgroundColor: "#D6FF38" }
    }
    return { backgroundColor: "transparent" }
  }

  const getTextColor = (path: string) => {
    if (pathname === path) {
      return "#000000"
    }
    return "rgba(255, 255, 255, 0.6)"
  }

  const getIconColor = (path: string) => {
    if (pathname === path) {
      return "#000000"
    }
    return "rgba(255, 255, 255, 0.6)"
  }

  return (
    <aside
      className={`fixed left-0 top-0 z-50 h-screen border-r transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
      style={{
        backgroundColor: "#030712",
        borderColor: "rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Header */}
      <div
        className={`flex h-16 items-center border-b transition-all duration-300 ${
          collapsed ? "justify-center" : "px-6"
        }`}
        style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
      >
        {!collapsed ? (
          <div>
            <span className="text-xl font-bold text-white">Dreambox</span>
            <p className="text-xs text-white/50">AI 生图工具箱</p>
          </div>
        ) : (
          <span className="text-xl font-bold text-white">D</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.path}
            className={`flex items-center gap-3 rounded-xl transition-all duration-200 hover:opacity-80 ${
              collapsed ? "flex-col py-2 px-1 gap-1" : "px-4 py-3"
            }`}
            style={{
              ...getActiveStyle(item.path),
              color: getTextColor(item.path),
            }}
          >
            <item.icon
              className={`${collapsed ? "w-5 h-5 flex-shrink-0" : "w-5 h-5 flex-shrink-0"}`}
              style={{ color: getIconColor(item.path) }}
            />
            {!collapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
            {collapsed && (
              <span
                className="text-[10px] font-medium whitespace-nowrap text-center leading-tight"
                style={{ color: getTextColor(item.path) }}
              >
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Collapse Toggle Button */}
      <div className="p-3 border-t" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          onClick={toggleCollapsed}
          className="w-full"
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          {!collapsed && <span>收起</span>}
        </Button>
      </div>
    </aside>
  )
}
