import { useEffect, useState } from "react";
import "../../assets/css/dashboard.css";
import { formatToPhilPeso } from "../../assets/js/utils";
import LineChart1 from "../../components/charts/LineChart1";
import axiosClient from "../../axios-client";

const AdminIndex = () => {
    const [forecastWeek, setForecastWeek] = useState(null);
    const [forecastMonth, setForecastMonth] = useState(null);

    const [weekChartData, setWeekChartData] = useState(null);
    const [monthChartData, setMonthChartData] = useState(null);

    const [metrics, setMetrics] = useState();



    /**
     * Get all necessary data
     */
    useEffect(() => {
        const getAll = async() => {
            try {
                const data = await axiosClient.get('/get-forecasted-data');
                setForecastWeek(data.data.forecast.forecast_week);
                setForecastMonth(data.data.forecast.forecast_month);
                setMetrics([
                    data.data.forecast.mse,
                    data.data.forecast.rmse,
                    data.data.forecast.mape
                ])
            } catch(error) {
                console.error(error);
            }
        }
        getAll();
    }, []);



    /**
     * Prep Data for Charts
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
     * Render
     */
    return(
        <div className="content1">
            {weekChartData && chartOptions && monthChartData && chartOptions
            ? (
                <>
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <div className="text-l1 fw-bolder">Dashboard</div>
                            <div className="text-m1">A quick data overview of the inventory.</div>
                        </div>
                        <button className="secondary-btn-black1">Download Report</button>
                    </div>

                    <div className="dashboard-content-1">
                        <div className="dashboard-content-1-box green">
                            <div className="dashboard-content-1-box-upper">
                                <img src="/media/icons/sheild-green1.svg" className="dashboard-content-1-icon"/>
                                <div className="text-l2 fw-bold">GOOD</div>
                                <div className="text-l3">Inventory Status</div>
                            </div>

                            <div className="dashboard-content-1-box-lower">
                                View Detailed Report
                            </div>
                        </div>

                        <div className="dashboard-content-1-box yellow">
                            <div className="dashboard-content-1-box-upper">
                                <img src="/media/icons/budget-yellow1.svg" className="dashboard-content-1-icon"/>
                                <div className="text-l2 fw-bold">{formatToPhilPeso(30000)}</div>
                                <div className="text-l3">Revenue</div>
                            </div>

                            <div className="dashboard-content-1-box-lower">
                                View Detailed Report
                            </div>
                        </div>

                        <div className="dashboard-content-1-box blue">
                            <div className="dashboard-content-1-box-upper">
                                <img src="/media/icons/medicine2-blue2.svg" className="dashboard-content-1-icon"/>
                                <div className="text-l2 fw-bold">300</div>
                                <div className="text-l3">Medicines Available</div>
                            </div>

                            <div className="dashboard-content-1-box-lower">
                                View Detailed Report
                            </div>
                        </div>

                        <div className="dashboard-content-1-box red">
                            <div className="dashboard-content-1-box-upper">
                                <img src="/media/icons/danger-red1.svg" className="dashboard-content-1-icon"/>
                                <div className="text-l2 fw-bold">0</div>
                                <div className="text-l3">Medicine Shortage</div>
                            </div>

                            <div className="dashboard-content-1-box-lower">
                                View Detailed Report
                            </div>
                        </div>
                    </div>

                    <div className="hr-line1-black3 mar-y-l1"></div>

                    <div className=" mar-bottom-1">
                        <div className="text-l1 fw-bolder">Forecasts</div>
                        <div className="text-m1">A quick data overview of the sales.</div>
                    </div>

                    <div className="d-flex gap1">
                        <div className="dashboard-content-1-box-2 w-100">
                            <LineChart1
                                title="Weekly Forecast"
                                data={weekChartData}
                                options={chartOptions}
                            />
                        </div>
                        <div className="dashboard-content-1-box-2 w-100">
                            <LineChart1
                                title="Monthly Forecast"
                                data={monthChartData}
                                options={chartOptions}
                            />
                        </div>
                    </div>
                </>
            )
            : (<>Loading</>)}
        </div>
    );
}
export default AdminIndex;