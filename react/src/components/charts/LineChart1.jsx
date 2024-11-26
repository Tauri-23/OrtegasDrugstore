import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart1 = ({ data, options, title }) => {
    return (
        <div>
            {title && <h2>{title}</h2>}
            <Line data={data} options={options} />
        </div>
    );
};

export default LineChart1;
