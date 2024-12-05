import { useEffect, useState } from "react";
import * as Icon from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { formatDate, formatToPhilPeso } from "../../assets/js/utils";
import { fetchAllMedicineShortage } from "../../Services/DashboardService";

export default function ViewShortage() {
    const [medicines, setMedicines] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getAllMedicines = async() => {
            try {
                const data = await fetchAllMedicineShortage();
                setMedicines(data);
            } catch(error) {console.error(error)}
        };

        getAllMedicines();
    }, []);



    /**
     * Render
     */
    return(
        <div className="content1">
            <div className="mar-bottom-l1">
                <div className="text-l1 fw-bolder">Low Stock Items</div>
                <div className="text-m1">List of low stock items.</div>
            </div>

            <table className="table1">
                <thead className="table1-thead">
                    <tr>
                        <th>Medicine Name</th>
                        <th>Group Name</th>
                        <th>Price</th>
                        <th>Stock in Qty</th>
                        <th>Expiration</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className="table1-tbody">
                    {medicines?.length > 0 && medicines.map((meds, index) => (
                        <tr key={index} onClick={() => navigate(`/OrtegaAdmin/ViewMedicines/${meds.id}`)}>
                            <td>{meds.name}</td>
                            <td>{meds.group.group_name}</td>
                            <td>{formatToPhilPeso(meds.price)}</td>
                            <td>{meds.qty}</td>
                            <td>{formatDate(meds.expiration)}</td>
                            <td>
                                <div className="d-flex gap1 align-items-center">
                                    <div className="text-m2">
                                        View Full Details
                                    </div>
                                    <Icon.ChevronDoubleRight/>
                                </div>
                            </td>
                        </tr>
                    ))}

                    {!medicines && (
                        <tr>
                            <td>
                                <div className="text-l3">Loading</div>
                            </td>
                        </tr>
                    )}

                    {medicines?.length < 1 && (
                        <tr>
                            <td><div className="text-l3">No Data</div></td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}