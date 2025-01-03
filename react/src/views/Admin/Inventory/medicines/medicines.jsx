import { useEffect, useState } from "react";
import * as Icon from "react-bootstrap-icons";
import { fetchAllMedicinesFull } from "../../../../Services/GeneralMedicineService";
import { Link, useNavigate } from "react-router-dom";
import { formatDate, formatToPhilPeso } from "../../../../assets/js/utils";

export default function AdminMedicines() {
    const [medicines, setMedicines] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getAllMedicines = async() => {
            try {
                const data = await fetchAllMedicinesFull();
                setMedicines(data);
            } catch(error) {console.error(error)}
        };

        getAllMedicines();
    }, []);

    /*
    | Debugging
    */
    // useEffect(() => {
    //     console.log(medicines);
    // }, [medicines])

    return(
        <div className="content1">
            <div className="d-flex justify-content-between align-items-center mar-bottom-l1">
                <div>
                    <div className="text-l1 fw-bolder">Inventory Items</div>
                    <div className="text-m1">List of items available for sales.</div>
                </div>
                
                <Link to={'/OrtegaAdmin/AddMedicine'} className="primary-btn-dark-blue1 d-flex gap3 align-items-center"><Icon.PlusLg className="text-l3"/> Add Medicine</Link>
            </div>

            <div className="d-flex justify-content-between mar-bottom-1">
                <div className="d-flex position-relative align-items-center">
                    <input type="text" className="search-box1 text-m1" placeholder="Search Medicine Inventory.."/>
                    <div className="search-box1-icon"><Icon.Search className="text-l3"/></div>
                </div>

                <select className="input1">
                    <option value="">- Select Group -</option>
                </select>
                
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