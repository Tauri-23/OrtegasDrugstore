import "../../assets/css/dashboard.css";
import { formatToPhilPeso } from "../../assets/js/utils";

const AdminIndex = () => {
    return(
        <div className="content1">
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
                        <img src="/src/assets/media/icons/sheild-green1.svg" className="dashboard-content-1-icon"/>
                        <div className="text-l2 fw-bold">GOOD</div>
                        <div className="text-l3">Inventory Status</div>
                    </div>

                    <div className="dashboard-content-1-box-lower">
                        View Detailed Report
                    </div>
                </div>

                <div className="dashboard-content-1-box yellow">
                    <div className="dashboard-content-1-box-upper">
                        <img src="/src/assets/media/icons/budget-yellow1.svg" className="dashboard-content-1-icon"/>
                        <div className="text-l2 fw-bold">{formatToPhilPeso(30000)}</div>
                        <div className="text-l3">Revenue</div>
                    </div>

                    <div className="dashboard-content-1-box-lower">
                        View Detailed Report
                    </div>
                </div>

                <div className="dashboard-content-1-box blue">
                    <div className="dashboard-content-1-box-upper">
                        <img src="/src/assets/media/icons/medicine2-blue2.svg" className="dashboard-content-1-icon"/>
                        <div className="text-l2 fw-bold">300</div>
                        <div className="text-l3">Medicines Available</div>
                    </div>

                    <div className="dashboard-content-1-box-lower">
                        View Detailed Report
                    </div>
                </div>

                <div className="dashboard-content-1-box red">
                    <div className="dashboard-content-1-box-upper">
                        <img src="/src/assets/media/icons/danger-red1.svg" className="dashboard-content-1-icon"/>
                        <div className="text-l2 fw-bold">0</div>
                        <div className="text-l3">Medicine Shortage</div>
                    </div>

                    <div className="dashboard-content-1-box-lower">
                        View Detailed Report
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AdminIndex;