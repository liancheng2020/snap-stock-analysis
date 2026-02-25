from .celery_app import celery
import time
from .db import update_task_state, create_task_doc
from .llm import call_deepseek

@celery.task(bind=True)
def analyze_task(self, symbol: str):
    # Create or update db entry (task_id available via self.request.id)
    import asyncio
    task_id = self.request.id
    asyncio.get_event_loop().run_until_complete(create_task_doc(symbol, task_id))
    for i in range(1, 4):
        meta = {'step': i, 'message': f'Agent step {i} processing'}
        asyncio.get_event_loop().run_until_complete(update_task_state(task_id, 'PROGRESS', meta=meta))
        self.update_state(state='PROGRESS', meta=meta)
        time.sleep(1)
    # call deepseek if available
    result_text = None
    try:
        result_text = call_deepseek(f"Please analyze the stock {symbol} and give a short summary.")
    except Exception as e:
        result_text = f'DeepSeek call failed: {e}'
    result = {'symbol': symbol, 'score': 75, 'summary': result_text}
    asyncio.get_event_loop().run_until_complete(update_task_state(task_id, 'SUCCESS', result=result))
    return result
