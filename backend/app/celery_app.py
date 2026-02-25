import os
from celery import Celery

BROKER = os.environ.get('CELERY_BROKER_URL', 'redis://redis:6379/0')
BACKEND = os.environ.get('CELERY_RESULT_BACKEND', BROKER)

celery = Celery('trading_agent', broker=BROKER, backend=BACKEND)

# Basic recommended config
celery.conf.update(
    task_serializer='json',
    result_serializer='json',
    accept_content=['json'],
    timezone='Asia/Shanghai',
    enable_utc=True,
)

# tasks will import this module and register with celery
