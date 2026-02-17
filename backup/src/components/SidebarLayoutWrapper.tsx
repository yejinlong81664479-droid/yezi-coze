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
    <div className="flex min-h-screen">
      <Sidebar />
      <main className={`flex-1 transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
        {children}
      </main>
    </div>
  )
}
