import { useEffect, useState } from "react";
import { fetchAllMedGroups } from "../../../Services/GeneralMedicineGroupService";

export default function AdminSalesReports() {
    const [medGroups, setMedGroups] = useState(null);

    useEffect(() => {
        const getAllMedGroups = async() => {
            try {
                const data = await fetchAllMedGroups();
                setMedGroups(data);
            } catch (error) {
                console.log(error);
            }
        }

        getAllMedGroups();
    }, []);

    return(
        <div className="content1">
            <div className="d-flex align-items-center justify-content-between mar-bottom-l1 w-100">
                <div className="text-l1 fw-bolder">Sales Reports</div>
                <div className="primary-btn-dark-blue1">Download Report</div>
            </div>
            
            <div className="d-flex gap1 align-items-center w-100 mar-bottom-l1">
                <div className="w-50">
                    <div className="text-m1">Date Range</div>
                    <div className="d-flex gap3">
                        <input type="date" id="from" className="input1 w-50" />
                        
                        <input type="date" id="to" className="input1 w-50" />
                    </div>
                </div>

                <div className="w-50">
                    <div className="text-m1">Medicine Group</div>
                    <select className="input1 w-100">
                        {medGroups?.map(medgp => (
                            <option key={medgp.id} value={medgp.id}>{medgp.group_name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="d-flex gap1 w-100">
                <div className="cont-box1 w-50">
                    <div className="cont-box1-head">
                        <div className="text-l3">Sales Made</div>
                    </div>
                    <div className="hr-line1-black3"></div>
                    <div className="cont-box1-body" style={{height: "400px"}}>
                    </div>
                </div>

                <div className="cont-box1 w-50">
                    <div className="cont-box1-head d-flex w-100">
                        <div className="text-l3 w-50 text-center">Order Id</div>
                        <div className="text-l3 w-50 text-center">Date & Time</div>
                    </div>
                    <div className="hr-line1-black3"></div>
                    <div className="cont-box1-body" style={{height: "400px"}}>
                        <div className="text-m1">No records.</div>
                    </div>
                </div>
            </div>

        </div>
    );
}