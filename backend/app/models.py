from datetime import datetime, timezone
from enum import StrEnum

from pydantic import BaseModel, Field, field_validator


class Market(StrEnum):
    A = "A"
    HK = "HK"
    US = "US"


class TaskState(StrEnum):
    PENDING = "PENDING"
    PROGRESS = "PROGRESS"
    SUCCESS = "SUCCESS"
    FAILURE = "FAILURE"


class AnalysisRequest(BaseModel):
    symbol: str = Field(min_length=1, max_length=32)
    market: Market = Market.A
    depth: int = Field(default=3, ge=1, le=5)

    @field_validator("symbol")
    @classmethod
    def normalize_symbol(cls, value: str) -> str:
        return value.strip().upper()


class AgentResult(BaseModel):
    key: str
    name: str
    score: int = Field(ge=0, le=100)
    conclusion: str
    signals: list[str]


class AnalysisResult(BaseModel):
    symbol: str
    market: Market
    depth: int
    score: int
    rating: str
    summary: str
    agents: list[AgentResult]
    risks: list[str]
    disclaimer: str = "本结果由演示数据生成，仅用于技术展示，不构成投资建议。"


class TaskProgress(BaseModel):
    step: int
    total: int
    agent: str
    message: str


class AnalysisTask(BaseModel):
    task_id: str
    symbol: str
    market: Market
    depth: int
    state: TaskState = TaskState.PENDING
    progress: TaskProgress | None = None
    result: AnalysisResult | None = None
    error: str | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TaskCreated(BaseModel):
    task_id: str
    state: TaskState
