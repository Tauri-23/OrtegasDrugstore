import React, { useEffect, useState } from 'react';
import axiosClient from '../../axios-client';
import LineChart1 from '../../components/charts/LineChart1';

export default function Prophet() {
    const [forecastWeek, setForecastWeek] = useState(null);
    const [forecastMonth, setForecastMonth] = useState(null);

    const [weekChartData, setWeekChartData] = useState(null);
    const [monthChartData, setMonthChartData] = useState(null);

    useEffect(() => {
        const getAll = async() => {
            try {
                const data = await axiosClient.get('/get-forecasted-data');
                setForecastWeek(data.data.forecast.forecast_week);
                setForecastMonth(data.data.forecast.forecast_month);
            } catch(error) {
                console.error(error);
            }
        }
        getAll();
    }, []);



    /**
     * Data Preperation
     */
    useEffect(() => {
        if(forecastWeek) {
            setWeekChartData({
                labels: forecastWeek.map((entry) => entry.ds),
                datasets: [
                    {
                        label: 'Weekly Forecast',
                        data: forecastWeek.map((entry) => entry.yhat),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                    },
                ],
            })
        }
    }, [forecastWeek]);

    useEffect(() => {
        if(forecastWeek) {
            setWeekChartData({
                labels: forecastWeek.map((entry) => entry.ds),
                datasets: [
                    {
                        label: 'Weekly Forecast',
                        data: forecastWeek.map((entry) => entry.yhat),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                    },
                ],
            })
        }
    }, [forecastWeek]);

    useEffect(() => {
        if(forecastMonth) {
            setMonthChartData({
                labels: forecastMonth.map((entry) => entry.ds),
                datasets: [
                    {
                        label: 'Monthly Forecast',
                        data: forecastMonth.map((entry) => entry.yhat),
                        borderColor: 'rgba(153, 102, 255, 1)',
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        fill: true,
                    },
                ],
            })
        }
    }, [forecastMonth]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Sales Forecast',
            },
        },
        tension: .2
    };



    /**
     * Debugging
     */
    useEffect(() => {
        console.log(weekChartData);
    }, [weekChartData]);
    
    useEffect(() => {
        console.log(monthChartData);
    }, [monthChartData]);



    /**
     * Render
     */
    return(
        <>
            {weekChartData && monthChartData
            ? (
                <>
                    
                    {/* Chart here */}
                    <div className="w-50">
                        <LineChart1
                            title="Weekly Forecast"
                            data={weekChartData}
                            options={chartOptions}
                        />
                    </div>
                    <div className="w-50">
                        <LineChart1
                            title="Monthly Forecast"
                            data={monthChartData}
                            options={chartOptions}
                        />
                    </div>
                    
                </>
            )
            : (
                <>Loading</>
            )}
        </>
    )
}
