"""
求职导师 - FastAPI 后端服务
"""
import sys
import os

# 添加项目路径
server_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.dirname(server_dir)
sys.path.insert(0, server_dir)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse, FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
import httpx
import json

# 导入 Supabase 客户端
from src.storage.database.supabase_client import get_supabase_client

# 导入 LLM 客户端
from coze_coding_dev_sdk import LLMClient, Config

app = FastAPI(
    title="求职导师 API",
    description="面试干货和高频问题 API",
    version="1.0.0"
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 挂载静态文件目录
static_dir = project_dir
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")


# 首页路由
@app.get("/", response_class=HTMLResponse)
async def index():
    index_path = os.path.join(static_dir, "index.html")
    if os.path.exists(index_path):
        with open(index_path, 'r', encoding='utf-8') as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse(content="<h1>Index not found</h1>")


# AI 聊天页面路由
@app.get("/ai-chat.html", response_class=HTMLResponse)
async def ai_chat():
    chat_path = os.path.join(static_dir, "ai-chat.html")
    if os.path.exists(chat_path):
        with open(chat_path, 'r', encoding='utf-8') as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse(content="<h1>AI Chat not found</h1>")


# 响应模型
class TipResponse(BaseModel):
    id: int
    title: str
    category: str
    content: str
    tag: str
    views: int
    read_time: str
    display_date: Optional[int] = None


class QuestionResponse(BaseModel):
    id: int
    rank: int
    question: str
    frequency: str
    category: str


class HomeDataResponse(BaseModel):
    tips: List[TipResponse]
    questions: List[QuestionResponse]
    today_date: str


@app.get("/")
async def root():
    """健康检查"""
    return {"status": "ok", "message": "求职导师 API 运行中"}


@app.get("/api/home", response_model=HomeDataResponse)
async def get_home_data():
    """
    获取首页数据
    - 今日干货：根据日期循环轮换显示
    - 高频问题：获取 TOP 5 问题
    """
    try:
        client = get_supabase_client()
        
        # 获取当前日期（1-31）
        today = datetime.now().day
        
        # 1. 获取所有干货
        tips_response = client.table('interview_tips')\
            .select('*')\
            .eq('is_active', True)\
            .order('views', desc=True)\
            .execute()
        
        all_tips = tips_response.data or []
        
        # 用日期数作为偏移量，循环选择6条干货
        if len(all_tips) >= 6:
            total = len(all_tips)
            start_index = today % total  # 用日期取模得到起始索引
            today_tips = []
            for i in range(6):
                idx = (start_index + i) % total
                today_tips.append(all_tips[idx])
        else:
            today_tips = all_tips
        
        # 2. 获取高频问题 TOP 5
        questions_response = client.table('interview_questions')\
            .select('*')\
            .eq('is_active', True)\
            .order('rank', desc=False)\
            .limit(5)\
            .execute()
        
        questions = questions_response.data or []
        
        return {
            "tips": today_tips,
            "questions": questions,
            "today_date": datetime.now().strftime("%Y-%m-%d")
        }
        
    except Exception as e:
        print(f"Error fetching home data: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/tips", response_model=List[TipResponse])
async def get_tips(category: Optional[str] = None, limit: int = 10):
    """
    获取干货列表
    - category: 可选分类过滤
    - limit: 返回数量
    """
    try:
        client = get_supabase_client()
        
        query = client.table('interview_tips')\
            .select('*')\
            .eq('is_active', True)
        
        if category:
            query = query.eq('category', category)
        
        response = query.order('created_at', desc=True).limit(limit).execute()
        
        return response.data or []
        
    except Exception as e:
        print(f"Error fetching tips: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/questions", response_model=List[QuestionResponse])
async def get_questions(limit: int = 10):
    """
    获取高频问题列表
    - limit: 返回数量
    """
    try:
        client = get_supabase_client()
        
        response = client.table('interview_questions')\
            .select('*')\
            .eq('is_active', True)\
            .order('rank', desc=False)\
            .limit(limit)\
            .execute()
        
        return response.data or []
        
    except Exception as e:
        print(f"Error fetching questions: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/tips/{tip_id}/view")
async def increment_tip_view(tip_id: int):
    """增加干货阅读量"""
    try:
        client = get_supabase_client()
        
        # 先获取当前阅读量
        current = client.table('interview_tips')\
            .select('views')\
            .eq('id', tip_id)\
            .execute()
        
        if not current.data:
            raise HTTPException(status_code=404, detail="Tip not found")
        
        new_views = (current.data[0].get('views') or 0) + 1
        
        # 更新阅读量
        client.table('interview_tips')\
            .update({'views': new_views})\
            .eq('id', tip_id)\
            .execute()
        
        return {"status": "ok", "views": new_views}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error incrementing view: {e}")
        raise HTTPException(status_code=500, detail=str(e))


class AnalyzeRequest(BaseModel):
    messages: List[dict]
    context: Optional[dict] = None


@app.post("/api/analyze")
async def analyze_content(request: AnalyzeRequest):
    """
    AI 分析面试干货内容
    - 流式输出分析结果
    """
    
    # 系统提示词 - 平衡详细与速度
    system_prompt = """你是资深面试辅导专家，帮助用户深度理解面试技巧。

分析维度：
## 核心要点
提炼技巧的核心价值和底层逻辑，说明为什么重要

## 实战方法
给出2-3条具体可操作的建议，简明扼要

## 回答范例
提供一个完整的回答示例（可用占位符），标注关键话术

## 避坑提醒
指出1-2个常见错误

要求：输出有深度但不啰嗦，控制在400字左右，让用户看完就能用。"""

    async def generate():
        try:
            config = Config()
            llm_client = LLMClient(config)
            
            # 构建消息
            messages = [{"role": "system", "content": system_prompt}]
            messages.extend(request.messages)
            
            # 流式调用 LLM - 低temperature加速响应
            stream = llm_client.stream(messages, temperature=0.3)
            
            for chunk in stream:
                if chunk.content:
                    yield chunk.content
            
        except Exception as e:
            print(f"LLM Error: {e}")
            yield f"\n\n抱歉，AI 分析服务暂时不可用。错误信息：{str(e)}"
    
    return StreamingResponse(
        generate(),
        media_type="text/plain; charset=utf-8",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
