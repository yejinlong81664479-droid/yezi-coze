"use client"

import { useSidebar } from "@/contexts/SidebarContext"
import Sidebar from "@/components/Sidebar"

export default function SidebarLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const { collapsed } = useSidebar()

  return (
    <div className="relative min-h-screen">
      <Sidebar />
      <main
        className={`min-h-screen transition-all duration-300 ${
          collapsed ? "pl-16" : "pl-64"
        }`}
      >
        {children}
      </main>
    </div>
  )
}
