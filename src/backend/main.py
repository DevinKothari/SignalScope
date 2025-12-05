from fastapi import FastAPI
import uvicorn
from api.news_router import router as news_router
from api.forecast_router import router as forecast_router

app = FastAPI(title="SignalScope API")

app.include_router(news_router, prefix="/api")
app.include_router(forecast_router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)