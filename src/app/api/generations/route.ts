import { NextRequest, NextResponse } from "next/server"
import { generationManager } from "@/storage/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type") as
      | "ppt"
      | "infographic"
      | "architecture"
      | null

    const generations = await generationManager.getGenerations({
      type: type || undefined,
      limit: 50,
    })

    return NextResponse.json({ success: true, data: generations })
  } catch (error) {
    console.error("获取生成记录失败:", error)
    return NextResponse.json(
      { success: false, error: "获取生成记录失败" },
      { status: 500 }
    )
  }
}
