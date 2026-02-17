from sqlalchemy import BigInteger, Boolean, DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column
from typing import Optional
from datetime import datetime
from coze_coding_dev_sdk.database import Base


class InterviewTip(Base):
    """面试干货内容表"""
    __tablename__ = "interview_tips"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False, comment="标题")
    category: Mapped[str] = mapped_column(String(50), nullable=False, comment="分类")
    content: Mapped[str] = mapped_column(Text, nullable=False, comment="内容")
    tag: Mapped[str] = mapped_column(String(20), nullable=False, server_default="干货", comment="标签: 热门/新/干货")
    views: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0", comment="阅读量")
    read_time: Mapped[str] = mapped_column(String(20), nullable=False, server_default="5分钟", comment="阅读时长")
    display_date: Mapped[Optional[int]] = mapped_column(Integer, nullable=True, comment="展示日期(1-31)")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, comment="是否启用")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    __table_args__ = (
        # 可以按展示日期和分类查询
    )


class InterviewQuestion(Base):
    """高频面试问题表"""
    __tablename__ = "interview_questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    rank: Mapped[int] = mapped_column(Integer, nullable=False, comment="排名")
    question: Mapped[str] = mapped_column(String(500), nullable=False, comment="问题内容")
    frequency: Mapped[str] = mapped_column(String(20), nullable=False, comment="出现频率")
    category: Mapped[str] = mapped_column(String(50), nullable=False, comment="分类")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, comment="是否启用")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), onupdate=func.now(), nullable=True)


class HealthCheck(Base):
    """系统健康检查表 - 禁止删除或修改"""
    __tablename__ = "health_check"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    updated_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
