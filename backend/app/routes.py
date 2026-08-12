from uuid import uuid4

from fastapi import APIRouter, BackgroundTasks, HTTPException, Query, status

from .analysis import run_analysis
from .models import AnalysisRequest, AnalysisTask, TaskCreated
from .store import task_store

router = APIRouter()

@router.post('/analysis/single', response_model=TaskCreated, status_code=status.HTTP_202_ACCEPTED)
async def analyze_single(payload: AnalysisRequest, background: BackgroundTasks) -> TaskCreated:
    task_id = uuid4().hex
    task = await task_store.create(task_id, payload)
    background.add_task(run_analysis, task_id, payload, task_store)
    return TaskCreated(task_id=task.task_id, state=task.state)

@router.get('/tasks', response_model=list[AnalysisTask])
async def list_tasks(limit: int = Query(default=20, ge=1, le=100)) -> list[AnalysisTask]:
    return await task_store.list(limit)


@router.get('/tasks/{task_id}', response_model=AnalysisTask)
async def get_task_status(task_id: str) -> AnalysisTask:
    task = await task_store.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail='任务不存在')
    return task
