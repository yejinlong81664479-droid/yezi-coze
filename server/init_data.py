"""
初始化数据库数据 - 新媒体运营岗位面试干货
"""
import sys
import os

server_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, server_dir)

from src.storage.database.supabase_client import get_supabase_client

def init_data():
    client = get_supabase_client()
    
    # 1. 初始化干货内容（新媒体运营 + 通用结合）
    tips = [
        # ===== 通用面试问题 =====
        {
            "title": "自我介绍的黄金公式",
            "category": "自我介绍",
            "content": "采用「我是谁 + 我做过什么 + 我能带来什么」的三段式结构，用具体数据和案例支撑。新媒体运营可重点展示账号增长数据、爆款内容案例。",
            "tag": "热门",
            "views": 5200,
            "read_time": "5分钟",
            "display_date": 1,
            "is_active": True
        },
        {
            "title": "如何回答「你的缺点是什么」",
            "category": "常见问题",
            "content": "选择一个真实但可控的缺点，并重点展示你如何改进。新媒体运营可说「对热点敏感度不够高，所以我现在每天固定花1小时刷平台热点」。",
            "tag": "热门",
            "views": 4800,
            "read_time": "7分钟",
            "display_date": 2,
            "is_active": True
        },
        {
            "title": "面试官问「你有什么问题问我」怎么答",
            "category": "常见问题",
            "content": "问团队配置、账号现状、增长目标、内容方向。比如「目前账号的核心痛点是什么」「团队内容生产流程是怎样的」。避免问薪资福利。",
            "tag": "热门",
            "views": 4500,
            "read_time": "4分钟",
            "display_date": 3,
            "is_active": True
        },
        {
            "title": "如何回答「为什么离开上一家公司」",
            "category": "常见问题",
            "content": "聚焦正向原因：寻求更大的发挥空间、想尝试不同平台或赛道、希望接触更完整的运营链路。避免批评前公司，保持专业和积极。",
            "tag": "热门",
            "views": 3800,
            "read_time": "5分钟",
            "display_date": 4,
            "is_active": True
        },
        # ===== 新媒体运营专业问题 =====
        {
            "title": "如何回答「你平时关注哪些新媒体账号」",
            "category": "新媒体运营",
            "content": "准备3-5个不同类型的账号：头部大号学习运营思路、竞品账号了解行业动态、小而美的账号挖掘差异化玩法。能说出每个账号的可取之处。",
            "tag": "干货",
            "views": 3600,
            "read_time": "6分钟",
            "display_date": 5,
            "is_active": True
        },
        {
            "title": "爆款内容的底层逻辑",
            "category": "内容运营",
            "content": "爆款=情绪价值+信息增量+传播动机。情绪价值引发共鸣，信息增量提供收获感，传播动机让用户愿意转发。三要素缺一不可。",
            "tag": "干货",
            "views": 6200,
            "read_time": "8分钟",
            "display_date": 6,
            "is_active": True
        },
        {
            "title": "从0到1搭建账号的方法论",
            "category": "账号运营",
            "content": "先做竞品分析确定定位，再设计内容框架和人设，持续输出建立辨识度。前30篇内容重点测试方向，用数据反馈迭代优化。",
            "tag": "干货",
            "views": 5500,
            "read_time": "10分钟",
            "display_date": 7,
            "is_active": True
        },
        {
            "title": "数据分析能力如何展示",
            "category": "数据分析",
            "content": "面试时准备完整的案例：从数据发现问题→提出假设→执行优化→验证效果。用具体数字说话：阅读率提升X%、粉丝增长Y%、互动率提升Z%。",
            "tag": "干货",
            "views": 4100,
            "read_time": "7分钟",
            "display_date": 8,
            "is_active": True
        },
        {
            "title": "短视频运营面试核心考点",
            "category": "短视频运营",
            "content": "重点准备：选题方法论、脚本结构、拍摄剪辑技巧、数据复盘习惯。能说出一套完整的短视频生产SOP，从选题到发布到复盘的全流程。",
            "tag": "新",
            "views": 5800,
            "read_time": "9分钟",
            "display_date": 9,
            "is_active": True
        },
        {
            "title": "社群运营面试常见问题",
            "category": "社群运营",
            "content": "核心问题：如何激活社群活跃度、如何设计社群变现路径、如何处理负面舆情。准备社群SOP案例，展示从拉新到留存到转化的完整链路。",
            "tag": "干货",
            "views": 3200,
            "read_time": "8分钟",
            "display_date": 10,
            "is_active": True
        },
        {
            "title": "如何准备新媒体作品集",
            "category": "作品展示",
            "content": "作品集3要素：爆款案例（数据亮眼）、日常案例（稳定输出）、复盘文档（思考深度）。每个案例配数据截图和你的思考总结。",
            "tag": "干货",
            "views": 2900,
            "read_time": "6分钟",
            "display_date": 11,
            "is_active": True
        },
        {
            "title": "用户增长策略面试技巧",
            "category": "用户增长",
            "content": "展示完整的增长思维：获客渠道选择→转化漏斗优化→用户分层运营→裂变机制设计。准备一个AARRR模型的实战案例。",
            "tag": "新",
            "views": 3500,
            "read_time": "8分钟",
            "display_date": 12,
            "is_active": True
        },
        {
            "title": "内容策划面试实战指南",
            "category": "内容运营",
            "content": "面试官可能会让你现场策划一个选题。准备选题的思考框架：目标用户是谁、痛点是什么、用什么形式呈现、预期效果如何。",
            "tag": "干货",
            "views": 4200,
            "read_time": "7分钟",
            "display_date": 13,
            "is_active": True
        },
        {
            "title": "谈薪资的3个关键时机",
            "category": "薪资谈判",
            "content": "不要在第一轮面试就谈薪资，等对方表达出录用意向后再讨论。准备好新媒体运营的市场薪资数据，了解自己的议价筹码。",
            "tag": "干货",
            "views": 2800,
            "read_time": "5分钟",
            "display_date": 14,
            "is_active": True
        },
    ]
    
    # 2. 初始化高频面试问题（新媒体运营 + 通用结合）
    questions = [
        # 通用问题
        {
            "rank": 1,
            "question": "请介绍一下你自己",
            "frequency": "98%",
            "category": "自我介绍",
            "is_active": True
        },
        {
            "rank": 2,
            "question": "你最大的优点和缺点是什么？",
            "frequency": "92%",
            "category": "常见问题",
            "is_active": True
        },
        # 新媒体运营专业问题
        {
            "rank": 3,
            "question": "你平时关注哪些新媒体账号？为什么关注它们？",
            "frequency": "88%",
            "category": "新媒体运营",
            "is_active": True
        },
        {
            "rank": 4,
            "question": "如果让你运营我们的账号，你会怎么做？",
            "frequency": "85%",
            "category": "账号运营",
            "is_active": True
        },
        {
            "rank": 5,
            "question": "你有过爆款内容吗？能详细说说吗？",
            "frequency": "82%",
            "category": "内容运营",
            "is_active": True
        },
        {
            "rank": 6,
            "question": "你如何分析运营数据？重点看哪些指标？",
            "frequency": "80%",
            "category": "数据分析",
            "is_active": True
        },
        # 通用问题
        {
            "rank": 7,
            "question": "为什么想加入我们公司？",
            "frequency": "78%",
            "category": "求职动机",
            "is_active": True
        },
        # 新媒体运营专业问题
        {
            "rank": 8,
            "question": "你觉得自己适合做哪个平台？为什么？",
            "frequency": "75%",
            "category": "新媒体运营",
            "is_active": True
        },
        {
            "rank": 9,
            "question": "如何提升用户粘性和留存率？",
            "frequency": "72%",
            "category": "用户运营",
            "is_active": True
        },
        # 通用问题
        {
            "rank": 10,
            "question": "你对未来3-5年的职业规划是什么？",
            "frequency": "70%",
            "category": "职业规划",
            "is_active": True
        },
    ]
    
    # 清空并重新插入数据
    try:
        # 删除现有数据
        client.table('interview_tips').delete().neq('id', 0).execute()
        client.table('interview_questions').delete().neq('id', 0).execute()
        
        # 插入干货
        for tip in tips:
            client.table('interview_tips').insert(tip).execute()
        
        # 插入问题
        for question in questions:
            client.table('interview_questions').insert(question).execute()
        
        print(f"✅ 成功初始化 {len(tips)} 条干货和 {len(questions)} 条问题")
        
    except Exception as e:
        print(f"❌ 初始化失败: {e}")


if __name__ == "__main__":
    init_data()
