import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const ChartComponent = ({ forecast }) => {
    // Prepare the data and labels for Chart.js
    const labels = forecast.map(item => item.ds.toLocaleDateString());
    const dataValues = forecast.map(item => item.yhat);

    const data = {
        labels,
        datasets: [
            {
                label: 'Forecasted Sales',
                data: dataValues,
                fill: false,
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Pharmacy Sales Forecast',
            },
        },
    };

    return <Line data={data} options={options} />;
};

export default ChartComponent;
