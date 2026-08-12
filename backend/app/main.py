import os
from dotenv import load_dotenv

# Load .env from backend directory
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import router as api_router

app = FastAPI(
    title="Snap Stock Analysis API",
    version="1.0.0",
    description="可扩展的多角色股票分析演示 API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix='/api')

@app.get("/health")
async def health():
    return {"status": "ok", "service": "snap-stock-analysis", "version": app.version}
