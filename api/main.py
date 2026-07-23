"""
RezzoBot — API 后端服务
FastAPI 入口 + 健康检查
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routers import resume, payment

app = FastAPI(title="RezzoBot API", version="0.1.0")

app.include_router(resume.router)
app.include_router(payment.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "rezzobot-api"}
