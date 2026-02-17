import { NextRequest } from "next/server";
import { LLMClient, Config } from "coze-coding-dev-sdk";

export async function POST(request: NextRequest) {
  try {
    const { bot_id, message, system_prompt: customSystemPrompt } = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "消息不能为空" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const config = new Config();
    const client = new LLMClient(config);

    // 创建编码器用于流式输出
    const encoder = new TextEncoder();

    // 创建可读流
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 根据不同的 bot_id 设置不同的系统提示词
          const systemPrompts: Record<string, string> = {
            "7606673064772091930": `你是一位专业的模拟面试官。你的任务是：
1. 模拟真实的面试场景
2. 提出有深度的面试问题
3. 对用户的回答给予即时、专业的反馈
4. 帮助用户提升面试技巧和表达能力
请以专业、友好的态度与用户交流，帮助他们为面试做好准备。`,
            "7607141289817735211": `你是一位专业的复盘导师。你的任务是：
1. 深度分析用户的面试表现或工作经历
2. 识别用户的优势和需要改进的地方
3. 提供个性化的改进建议和行动计划
4. 帮助用户持续成长和进步
请以专业、鼓励的态度与用户交流，帮助他们不断精进。`,
            "7607480544884293647": `你是一位行业案例分析专家。你的任务是：
1. 拆解行业真实案例
2. 分析案例中的业务逻辑和关键决策
3. 帮助用户理解行业趋势和最佳实践
4. 提供可借鉴的经验和启示
请以专业、清晰的逻辑与用户交流，帮助他们获得有价值的行业洞察。`,
          };

          // 优先使用自定义系统提示词，否则使用预设的
          const systemPrompt = customSystemPrompt || systemPrompts[bot_id] || "你是一个有帮助的AI助手。";

          const messages = [
            { role: "system" as const, content: systemPrompt },
            { role: "user" as const, content: message },
          ];

          const llmStream = client.stream(messages, {
            temperature: 0.7,
          });

          for await (const chunk of llmStream) {
            if (chunk.content) {
              const text = chunk.content.toString();
              controller.enqueue(encoder.encode(text));
            }
          }

          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.enqueue(
            encoder.encode("抱歉，处理您的请求时出现错误，请稍后重试。")
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "服务器内部错误" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
