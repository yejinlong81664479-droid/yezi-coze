import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  // 返回统一的禁用提示
  return NextResponse.json(
    {
      success: false,
      error: "当前为 Demo 示例，由于访问人数过高已临时禁用生成功能。可以通过扣子编程创建类似项目。"
    },
    { status: 403 }
  )
}
