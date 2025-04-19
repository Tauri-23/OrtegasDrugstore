import { useEffect, useState } from "react";
import "../../assets/css/dashboard.css";
import { formatDate, formatToPhilPeso, getInterpretationSummary } from "../../assets/js/utils";
import LineChart1 from "../../components/charts/LineChart1";
import { fetchAllForecast } from "../../Services/ForecastServices";
import { fetchAllExpiringMedicine, fetchAllMedicineCount, fetchAllMedicineShortage, fetchAllRevenue } from "../../Services/DashboardService";
import { fetchAllMedicinesFull } from "../../Services/GeneralMedicineService";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../Context/ModalContext";

const AdminIndex = () => {
    const navigate = useNavigate();
    const {showModal} = useModal();

    const [forecastWeek, setForecastWeek] = useState(null);
    const [forecastMonth, setForecastMonth] = useState(null);

    const [weekChartData, setWeekChartData] = useState(null);
    const [monthChartData, setMonthChartData] = useState(null);

    const [revenue, setRevenue] = useState(0);
    const [medCount, setMedCount] = useState(0);
    const [medShortage, setMedShortage] = useState(0);

    const [medicines, setMedicines] = useState(0);

    const [expiringMeds, setExpiringMeds] = useState(null);

    const [metrics, setMetrics] = useState();



    /**
     * Get all necessary data
     */
    useEffect(() => {
        const getAll = async() => {
            try {
                const [forecastDb, revenueDb, medCountDb, medShortageDb, expiringMedsDb, medicinesDb] = await Promise.all([
                    fetchAllForecast(),
                    fetchAllRevenue(),
                    fetchAllMedicineCount(),
                    fetchAllMedicineShortage(),
                    fetchAllExpiringMedicine(),
                    fetchAllMedicinesFull()
                ]);
                setForecastWeek(forecastDb.forecast.forecast_week);
                setForecastMonth(forecastDb.forecast.forecast_month);
                setMetrics([
                    forecastDb.forecast.mse,
                    forecastDb.forecast.rmse,
                    forecastDb.forecast.mape
                ]);
                setRevenue(revenueDb);
                setMedCount(medCountDb);
                setMedShortage(medShortageDb);
                setExpiringMeds(expiringMedsDb);
                setMedicines(medicinesDb);

                if(medShortageDb.length > 0 || expiringMedsDb.length > 0) {
                    showModal("AdminMedShortageModal1", {
                        medShortage: medShortageDb,
                        expiringMeds: expiringMedsDb
                    });
                }
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
                        data: forecastWeek.map((entry) => Math.round(entry.yhat)),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                    },
                ],
            })

            console.log(forecastWeek);
        }
    }, [forecastWeek]);

    useEffect(() => {
        if(forecastMonth) {
            setMonthChartData({
                labels: forecastMonth.map((entry) => entry.ds),
                datasets: [
                    {
                        label: 'Monthly Forecast',
                        data: forecastMonth.map((entry) => Math.round(entry.yhat)),
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
     * Functions
     */
    const getStatus = (qty) => {
        if(qty > (medicines.length * .3)) {
            return "Bad"
        }
        else if(qty > (medicines.length * .2)) {
            return "Low Stock"
        }
        else{
            return "Good"
        }
    }



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

                    {/* KPIS */}
                    <div className="dashboard-content-1">
                        {/* <div className={`dashboard-content-1-box ${getStatus(medShortage.length) === "Good" ? "green" : (getStatus(medShortage.length) === "Low Stock" ? "yellow" : "red")}`}>
                            <div className="dashboard-content-1-box-upper">
                                <img src="/media/icons/sheild-green1.svg" className="dashboard-content-1-icon"/>
                                <div className="text-l2 fw-bold">{getStatus(medShortage.length)}</div>
                                <div className="text-l3">Inventory Status</div>
                            </div>

                            <div className="dashboard-content-1-box-lower">
                                View
                            </div>
                        </div> */}

                        <div className="dashboard-content-1-box yellow">
                            <div className="dashboard-content-1-box-upper">
                                <img src="/media/icons/budget-yellow1.svg" className="dashboard-content-1-icon"/>
                                <div className="text-l2 fw-bold">{formatToPhilPeso(revenue)}</div>
                                <div className="text-l3">Revenue</div>
                            </div>

                            <div className="dashboard-content-1-box-lower">
                                View
                            </div>
                        </div>

                        <div className="dashboard-content-1-box blue">
                            <div className="dashboard-content-1-box-upper">
                                <img src="/media/icons/medicine2-blue2.svg" className="dashboard-content-1-icon"/>
                                <div className="text-l2 fw-bold">{medCount}</div>
                                <div className="text-l3">Medicines Available</div>
                            </div>

                            <div className="dashboard-content-1-box-lower">
                                View
                            </div>
                        </div>

                        <div className="dashboard-content-1-box red" onClick={() => navigate('/OrtegaAdmin/MedicineShortageExpiring')}>
                            <div className="dashboard-content-1-box-upper">
                                <img src="/media/icons/danger-red1.svg" className="dashboard-content-1-icon"/>
                                <div className="text-l2 fw-bold">{medShortage.length}</div>
                                <div className="text-l3">Medicine Shortage</div>
                            </div>

                            <div className="dashboard-content-1-box-lower">
                                View
                            </div>
                        </div>

                        <div className="dashboard-content-1-box red" onClick={() => navigate('/OrtegaAdmin/MedicineShortageExpiring/Expiring')}>
                            <div className="dashboard-content-1-box-upper">
                                <img src="/media/icons/danger-red1.svg" className="dashboard-content-1-icon"/>
                                <div className="text-l2 fw-bold">{expiringMeds.reduce((acc, x) => acc + x.qty, 0)}</div>
                                <div className="text-l3">Expiring Medicine</div>
                            </div>

                            <div className="dashboard-content-1-box-lower">
                                View
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
                            <div 
                            className="mar-top-1 text-align-justify" 
                            style={{ whiteSpace: "pre-line" }} 
                            dangerouslySetInnerHTML={{__html: getInterpretationSummary(forecastWeek, "Weekly")}}/>

                        </div>
                        <div className="dashboard-content-1-box-2 w-100">
                            <LineChart1
                                title="Monthly Forecast"
                                data={monthChartData}
                                options={chartOptions}
                            />
                            <div 
                            className="mar-top-1 text-align-justify" 
                            style={{ whiteSpace: "pre-line" }} 
                            dangerouslySetInnerHTML={{__html: getInterpretationSummary(forecastMonth, "Monthly")}}/>
                        </div>
                    </div>
                </>
            )
            : (<>Loading</>)}
        </div>
    );
}
export default AdminIndex;