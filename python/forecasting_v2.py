import mysql.connector
import pandas as pd
import numpy as np
from prophet import Prophet
import json

def fetch_data_from_mysql():
    # Connect to the MySQL database
    connection = mysql.connector.connect(
        host="127.0.0.1",  # Replace with your DB host
        user="root",  # Replace with your DB user
        password="",  # Replace with your DB password
        database="ortegas_drugstore"  # Replace with your database name
    )
    
    query = """
    SELECT pti.created_at, pti.qty, m.price
    FROM purchase_transaction_items pti
    INNER JOIN medicines m ON pti.medicine = m.id
    ORDER BY pti.created_at ASC
    """
    
    # Fetch data into a Pandas DataFrame
    df = pd.read_sql(query, connection)
    connection.close()
    return df

def forecast_sales(data):
    """
    Perform sales forecasting using Prophet on the provided data.
    """
    # Preprocess the data
    data['date'] = pd.to_datetime(data['created_at'])
    data['value'] = data['qty'] * data['price']

    # Aggregate daily sales
    sales_data = data.groupby('date').agg({'value': 'sum'}).reset_index()
    prophet_data = sales_data.rename(columns={'date': 'ds', 'value': 'y'})

    # Initialize and fit the Prophet model
    model = Prophet()
    model.fit(prophet_data)

    # Create future dataframes for predictions
    future_week = model.make_future_dataframe(periods=7)
    future_month = model.make_future_dataframe(periods=30)

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

    return {
        'forecast_week': forecast_week_sales.to_dict(orient='records'),
        'forecast_month': forecast_month_sales.to_dict(orient='records'),
        'mse': mse,
        'rmse': rmse,
        'mape': mape
    }

if __name__ == "__main__":
    try:
        # Fetch data from MySQL
        data = fetch_data_from_mysql()

        # Perform forecasting
        result = forecast_sales(data)

        # Print result as JSON
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(json.dumps({'error': str(e)}))
