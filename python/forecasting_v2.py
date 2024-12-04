import mysql.connector
import pandas as pd
import numpy as np
from prophet import Prophet
import json

def is_holiday(date, holidays):
    """
    Check if a given date is a holiday.
    :param date: datetime.date object
    :param holidays: List of (month, day) tuples for holidays
    :return: Boolean indicating if the date is a holiday
    """
    return (date.month, date.day) in holidays

def fetch_data_from_mysql():
    # Connect to the MySQL database
    connection = mysql.connector.connect(
        host="127.0.0.1",  # Replace with your DB host
        user="root",  # Replace with your DB user
        password="",  # Replace with your DB password
        database="ortegas_drugstore"  # Replace with your database name
    )

    philippine_regular_holidays = [
        (1, 1),   # New Year's Day
        (4, 9),   # Araw ng Kagitingan (Day of Valor)
        (5, 1),   # Labor Day
        (6, 12),  # Independence Day
        (8, 28),  # National Heroes' Day (last Monday of August - placeholder date)
        (11, 30), # Bonifacio Day
        (12, 25), # Christmas Day
        (12, 30)  # Rizal Day
    ]
    
    query = """
    SELECT pti.created_at, pti.medicine, pti.qty, m.price
    FROM purchase_transaction_items pti
    INNER JOIN medicines m ON pti.medicine = m.id
    ORDER BY pti.created_at ASC
    """
    
    # Fetch data into a Pandas DataFrame
    df = pd.read_sql(query, connection)
    connection.close()

    # Add 'date' and 'is_holiday' fields
    df['date'] = pd.to_datetime(df['created_at']).dt.date
    df['is_holiday'] = df['date'].apply(lambda d: is_holiday(d, philippine_regular_holidays))
    return df

def forecast_sales(data):
    """
    Perform sales forecasting using Prophet on the provided data, including holiday information.
    """
    # Preprocess the data
    data['value'] = data['qty']

    # Aggregate daily sales
    sales_data = data.groupby('date').agg({'value': 'sum', 'is_holiday': 'max'}).reset_index()
    prophet_data = sales_data.rename(columns={'date': 'ds', 'value': 'y'})

    # Log transformation
    prophet_data['y'] = np.log1p(prophet_data['y'])

    # Initialize and fit the Prophet model
    model = Prophet(holidays=pd.DataFrame({
        'holiday': 'philippines_regular',
        'ds': pd.to_datetime(sales_data[sales_data['is_holiday'] == True]['date']),
        'lower_window': 0,
        'upper_window': 1
    }))
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
    # Ensure consistent datetime format before merging
    forecast_month['ds'] = pd.to_datetime(forecast_month['ds'])
    sales_data['date'] = pd.to_datetime(sales_data['date'])

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

        #print(data)

        # Perform forecasting
        result = forecast_sales(data)

        # Print result as JSON
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(json.dumps({'error': str(e)}))
