"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/Sidebar"
import { SidebarProvider } from "@/contexts/SidebarContext"
import SidebarLayoutWrapper from "@/components/SidebarLayoutWrapper"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} antialiased bg-[#030712] text-white`}>
        <SidebarProvider>
          <SidebarLayoutWrapper>
            {children}
          </SidebarLayoutWrapper>
        </SidebarProvider>
      </body>
    </html>
  )
}
