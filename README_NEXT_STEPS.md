下一步建议清单：

1. 在本地安装依赖
   - frontend: cd frontend && npm install
   - backend: cd backend && poetry install

2. 启动服务（使用 docker-compose）
   docker compose up --build

3. 启动 Celery worker（容器内或本地）
   celery -A backend.app.celery_app.celery worker --loglevel=info

4. 测试流程
   - 访问 http://localhost:3000
   - 发起单股分析并查看任务状态

5. 后续工作
   - 实现 MongoDB 数据模型并持久化任务/报告
   - 将 Celery 任务替换为真实分析流程，接入 LLM
   - 添加身份认证与 API Key 管理
