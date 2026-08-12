# Snap Stock Analysis

一个简洁、可运行的多角色股票分析演示项目。输入股票代码、市场和分析深度后，后端异步组织市场、基本面、新闻和情绪四个分析角色，前端实时展示任务进度与汇总结果。

> 默认分析结果由可复现的演示引擎生成，不包含实时行情，也不构成投资建议。

## 功能

- A 股、港股、美股代码输入与标准化
- Level 1-5 分析深度
- 四角色协作分析与综合评分
- 异步任务进度、失败状态和历史任务列表
- 深色/浅色主题与响应式页面
- FastAPI 自动接口文档
- 前后端 Docker 一键启动
- 后端 API 测试和 GitHub Actions

## 技术栈

- 前端：Next.js 13、React 18、TypeScript、Ant Design
- 后端：FastAPI、Pydantic、Python 3.11
- 部署：Docker Compose

## 快速开始

### Docker

```bash
docker compose -f deploy/docker-compose.yml up --build
```

- 前端：http://localhost:3000
- 后端：http://localhost:8000
- API 文档：http://localhost:8000/docs

### 本地开发

后端：

```bash
cd backend
poetry install
poetry run uvicorn app.main:app --reload
```

前端：

```bash
cd frontend
npm ci
npm run dev
```

## API

```text
POST /api/analysis/single  创建分析任务
GET  /api/tasks/{id}      查询任务状态
GET  /api/tasks           查询最近任务
GET  /health              服务健康检查
```

创建任务示例：

```json
{
  "symbol": "00700",
  "market": "HK",
  "depth": 3
}
```

## 扩展真实数据源

核心分析流程位于 `backend/app/analysis.py`。接入真实系统时，可以保持 API 和任务模型不变，将演示角色替换为：

1. 行情数据适配器，如 AkShare、Tushare 或 yfinance。
2. 财务数据与公告检索器。
3. 新闻与情绪数据源。
4. 支持结构化输出的 LLM Provider。
5. Redis/Celery 任务队列及持久化 TaskStore。

数据源失败时应明确标记缺失，不能用模拟数据冒充真实行情。

## 测试

```bash
cd backend && poetry run pytest
cd frontend && npm run build
```

## License

[MIT](./LICENSE)
