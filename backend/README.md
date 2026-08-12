# Backend

FastAPI 实现的多角色股票分析演示服务。

## 结构

- `models.py`：请求、任务、进度和分析结果模型
- `analysis.py`：分析角色编排与结果汇总
- `store.py`：可替换的任务存储层
- `routes.py`：分析和任务查询 API

默认使用内存存储，适合本地演示和单实例部署。生产环境可将 `TaskStore` 替换为 Redis 或数据库实现，并将 `run_analysis` 交给任务队列执行，API 数据结构无需改变。

## 运行

```bash
poetry install
poetry run uvicorn app.main:app --reload
```

## 测试

```bash
poetry run pytest
```
