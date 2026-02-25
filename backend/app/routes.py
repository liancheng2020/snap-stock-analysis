from fastapi import APIRouter, BackgroundTasks
from fastapi import HTTPException
from .tasks import analyze_task
from .db import create_task_doc, get_task_doc

router = APIRouter()

@router.post('/analysis/single')
async def analyze_single(payload: dict):
    symbol = payload.get('symbol')
    if not symbol:
        raise HTTPException(status_code=400, detail='symbol required')
    task = analyze_task.apply_async(args=[symbol])
    # create db entry
    await create_task_doc(symbol, task.id)
    return {'task_id': task.id}

@router.get('/tasks/{task_id}')
async def get_task_status(task_id: str):
    # check db first
    doc = await get_task_doc(task_id)
    if doc:
        return {'state': doc.get('state'), 'meta': doc.get('meta'), 'result': doc.get('result')}
    # fallback to celery
    res = analyze_task.AsyncResult(task_id)
    if res.state == 'PENDING':
        return {'state':'PENDING'}
    elif res.state == 'PROGRESS':
        return {'state':'PROGRESS', 'meta': res.info}
    elif res.state == 'SUCCESS':
        return {'state':'SUCCESS', 'result': res.result}
    else:
        return {'state': res.state}
