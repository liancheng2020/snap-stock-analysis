from __future__ import annotations
import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://mongo:27017')
client = AsyncIOMotorClient(MONGO_URL)
db = client['trading_agent']

async def create_task_doc(symbol: str, task_id: str):
    doc = {
        'task_id': task_id,
        'symbol': symbol,
        'state': 'PENDING',
        'meta': None,
    }
    await db.tasks.insert_one(doc)
    return doc

async def update_task_state(task_id: str, state: str, meta: dict | None = None, result: dict | None = None):
    update = {'state': state}
    if meta is not None:
        update['meta'] = meta
    if result is not None:
        update['result'] = result
    await db.tasks.update_one({'task_id': task_id}, {'$set': update})

async def get_task_doc(task_id: str):
    return await db.tasks.find_one({'task_id': task_id})
