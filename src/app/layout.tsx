"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/contexts/SidebarContext"
import SidebarLayoutWrapper from "@/components/SidebarLayoutWrapper"
import { Toaster } from "sonner"
import { useEffect } from "react"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

function RemoveNextDevToolbar() {
  useEffect(() => {
    const removeToolbar = () => {
      // 删除 Next.js 开发工具栏 portal
      const portal = document.querySelector('nextjs-portal')
      if (portal) {
        portal.remove()
      }
    }

    // 延迟执行
    const timer = setTimeout(removeToolbar, 100)
    
    // 使用 MutationObserver 监听
    const observer = new MutationObserver(() => {
      const portal = document.querySelector('nextjs-portal')
      if (portal) {
        portal.remove()
      }
    })
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    })
    
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  return null
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} antialiased`} style={{ backgroundColor: "#F8FAFC", color: "#1E293B" }}>
        <SidebarProvider>
          <SidebarLayoutWrapper>
            {children}
          </SidebarLayoutWrapper>
        </SidebarProvider>
        <Toaster position="bottom-right" richColors />
        <RemoveNextDevToolbar />
      </body>
    </html>
  )
}
