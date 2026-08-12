import asyncio
import hashlib
import random

from .models import AgentResult, AnalysisRequest, AnalysisResult, TaskProgress
from .store import TaskStore


AGENTS = (
    ("market", "市场分析师", "观察市场趋势、波动与资金偏好"),
    ("fundamental", "基本面分析师", "评估盈利质量、估值与经营韧性"),
    ("news", "新闻分析师", "梳理公告事件与潜在催化因素"),
    ("sentiment", "情绪分析师", "识别交易拥挤度与市场情绪"),
)


def normalize_symbol(symbol: str, market: str) -> str:
    symbol = symbol.strip().upper()
    if market == "A" and symbol.isdigit():
        return symbol.zfill(6)
    if market == "HK" and symbol.isdigit():
        return symbol.zfill(5)
    return symbol


def _agent_result(request: AnalysisRequest, key: str, name: str, focus: str) -> AgentResult:
    seed = f"{request.market}:{request.symbol}:{request.depth}:{key}"
    rng = random.Random(int(hashlib.sha256(seed.encode()).hexdigest()[:12], 16))
    score = rng.randint(42, 86)
    tone = "偏积极" if score >= 68 else "中性" if score >= 52 else "偏谨慎"
    return AgentResult(
        key=key,
        name=name,
        score=score,
        conclusion=f"{focus}，当前演示信号为{tone}。",
        signals=[
            f"模拟指标强度 {score}/100",
            f"Level {request.depth} 分析覆盖",
            "接入真实数据源后应重新验证",
        ],
    )


async def run_analysis(task_id: str, request: AnalysisRequest, store: TaskStore) -> None:
    try:
        results: list[AgentResult] = []
        total = len(AGENTS)
        for step, (key, name, focus) in enumerate(AGENTS, start=1):
            await store.progress(
                task_id,
                TaskProgress(
                    step=step,
                    total=total,
                    agent=key,
                    message=f"{name}正在分析",
                ),
            )
            await asyncio.sleep(0.15)
            results.append(_agent_result(request, key, name, focus))

        score = round(sum(item.score for item in results) / len(results))
        rating = "关注" if score >= 68 else "观察" if score >= 52 else "谨慎"
        symbol = normalize_symbol(request.symbol, request.market.value)
        result = AnalysisResult(
            symbol=symbol,
            market=request.market,
            depth=request.depth,
            score=score,
            rating=rating,
            summary=(
                f"{symbol} 的多角色演示分析已完成，综合评分 {score}/100，"
                f"结论为“{rating}”。建议结合实时行情、财务报告和个人风险承受能力复核。"
            ),
            agents=results,
            risks=["演示引擎未接入实时行情", "历史表现不代表未来收益", "单一模型结论可能存在偏差"],
        )
        await store.succeed(task_id, result)
    except Exception as exc:
        await store.fail(task_id, str(exc))
