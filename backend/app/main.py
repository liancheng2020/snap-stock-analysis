from dotenv import load_dotenv
import os

# Load .env from backend directory
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import router as api_router

app = FastAPI(title="Trading Agent Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix='/api')

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/analysis/single")
async def analyze_single(symbol: str):
    # placeholder for async task enqueue
    return {"symbol": symbol, "task_id": "TODO"}
