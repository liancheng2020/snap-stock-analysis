import asyncio
from datetime import datetime, timezone

from .models import AnalysisRequest, AnalysisResult, AnalysisTask, TaskProgress, TaskState


class TaskStore:
    def __init__(self) -> None:
        self._tasks: dict[str, AnalysisTask] = {}
        self._lock = asyncio.Lock()

    async def create(self, task_id: str, request: AnalysisRequest) -> AnalysisTask:
        task = AnalysisTask(task_id=task_id, **request.model_dump())
        async with self._lock:
            self._tasks[task_id] = task
        return task.model_copy(deep=True)

    async def get(self, task_id: str) -> AnalysisTask | None:
        async with self._lock:
            task = self._tasks.get(task_id)
            return task.model_copy(deep=True) if task else None

    async def list(self, limit: int = 20) -> list[AnalysisTask]:
        async with self._lock:
            tasks = sorted(
                self._tasks.values(), key=lambda item: item.created_at, reverse=True
            )
            return [task.model_copy(deep=True) for task in tasks[:limit]]

    async def progress(self, task_id: str, value: TaskProgress) -> None:
        await self._update(task_id, state=TaskState.PROGRESS, progress=value)

    async def succeed(self, task_id: str, result: AnalysisResult) -> None:
        await self._update(task_id, state=TaskState.SUCCESS, result=result)

    async def fail(self, task_id: str, error: str) -> None:
        await self._update(task_id, state=TaskState.FAILURE, error=error)

    async def _update(self, task_id: str, **changes: object) -> None:
        async with self._lock:
            task = self._tasks[task_id]
            self._tasks[task_id] = task.model_copy(
                update={**changes, "updated_at": datetime.now(timezone.utc)}
            )


task_store = TaskStore()
