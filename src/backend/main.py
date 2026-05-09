from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.health_router import router as health_router
from api.status_router import router as status_router
from api.news_router import router as news_router
from api.forecast_router import router as forecast_router
from api.market_router import router as market_router
from api.watchlist_router import router as watchlist_router

app = FastAPI(
    title="SignalScope API",
    description="Stateless market dashboard API using rule-based data science scoring.",
    version="0.3.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(status_router)
app.include_router(news_router)
app.include_router(forecast_router)
app.include_router(market_router)
app.include_router(watchlist_router)


@app.get("/")
def root():
    return {
        "app": "SignalScope API",
        "status": "running",
        "docs": "/docs",
        "health": "/api/health",
    }
