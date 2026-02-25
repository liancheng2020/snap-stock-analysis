Backend (FastAPI)

运行开发环境：

1. 进入 backend 目录
2. 建议使用 poetry 创建虚拟环境：
   poetry install
3. 启动服务：
   uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000

异步任务：

- Celery + Redis（待实现任务 worker）

数据库：

- 使用 MongoDB（motor async driver）
