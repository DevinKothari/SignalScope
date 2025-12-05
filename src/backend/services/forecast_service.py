import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from typing import List
from models.schemas import ForecastItem
from utils.data_fetcher import fetch_historical_ohlcv  # For real API; mock for now

class ForecastService:
    def __init__(self, model_class=ARIMA):
        self.model_class = model_class

    def get_forecast(self, ticker: str) -> List[ForecastItem]:
        # Use real fetch (uncomment when API key set)
        # historical = fetch_historical_ohlcv(ticker)

        # Mock historical OHLCV
        dates = pd.date_range(end=pd.Timestamp.now(), periods=20, freq='H')
        historical = pd.DataFrame({
            'open': np.random.uniform(100, 150, 20),
            'high': np.random.uniform(150, 200, 20),
            'low': np.random.uniform(50, 100, 20),
            'close': np.random.uniform(100, 150, 20)
        }, index=dates)

        model = self.model_class(historical['close'], order=(1,1,1)).fit()
        forecast = model.forecast(steps=4)
        conf_int = model.get_forecast(steps=4).conf_int(alpha=0.05)

        future_dates = pd.date_range(start=dates[-1] + pd.Timedelta(hours=1), periods=4, freq='H')
        projections = []
        for i, date in enumerate(future_dates):
            close_pred = forecast[i]
            projections.append(ForecastItem(
                timestamp=str(date),
                open=close_pred * 0.99,
                high=close_pred * 1.02,
                low=close_pred * 0.98,
                close=close_pred,
                lower_bound=conf_int.iloc[i, 0],
                upper_bound=conf_int.iloc[i, 1]
            ))
        return projections