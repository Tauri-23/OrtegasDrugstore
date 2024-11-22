import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from prophet import Prophet
import json

# Load the dataset
file_path = 'python/Expanded_Ortega_Synthetic_Data_v2.csv'
df = pd.read_csv(file_path)

# Preprocess the data
df['date'] = pd.to_datetime(df['date'])
sales_data = df.groupby('date').agg({'value': 'sum', 'is_holiday': 'max'}).reset_index()

# Prepare data for Prophet
prophet_data = sales_data.rename(columns={'date': 'ds', 'value': 'y'})

# Initialize and fit the Prophet model
model = Prophet()
model.fit(prophet_data)

# Create dataframes for future predictions
future_week = model.make_future_dataframe(periods=7)
future_month = model.make_future_dataframe(periods=30)

# Make predictions
forecast_week = model.predict(future_week)
forecast_month = model.predict(future_month)

# Collect forecasted sales for the next week and month
forecast_week_sales = forecast_week[['ds', 'yhat']].tail(7)
forecast_week_sales['ds'] = forecast_week_sales['ds'].dt.strftime('%Y-%m-%d')  # Convert datetime to string

forecast_month_sales = forecast_month[['ds', 'yhat']].tail(30)
forecast_month_sales['ds'] = forecast_month_sales['ds'].dt.strftime('%Y-%m-%d')  # Convert datetime to string

# Evaluate forecast accuracy
# Merge forecast with actual sales data for error calculation
forecast_merged = forecast_month.merge(sales_data.rename(columns={'date': 'ds'}), on='ds', how='left')
forecast_merged['error'] = forecast_merged['yhat'] - forecast_merged['value']

# Calculate metrics
mse = np.mean(forecast_merged['error']**2)
rmse = np.sqrt(mse)
mape = np.mean(np.abs(forecast_merged['error']) / forecast_merged['value']) * 100

# Prepare the result as a JSON object
result = {
    'forecast_week': forecast_week_sales.to_dict(orient='records'),
    'forecast_month': forecast_month_sales.to_dict(orient='records'),
    'mse': mse,
    'rmse': rmse,
    'mape': mape
}

# Output the result as JSON
print(json.dumps(result))
