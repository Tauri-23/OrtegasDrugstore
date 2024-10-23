import { useEffect, useState } from "react";
import * as Icon from 'react-bootstrap-icons';
import "../../../assets/css/pos.css";
import { fetchAllMedGroups } from "../../../Services/GeneralMedicineGroupService";
import { fetchAllMedicinesFull } from "../../../Services/GeneralMedicineService";
import { formatToPhilPeso } from "../../../assets/js/utils";

export default function AdminPOSIndex() {
    const [medGroups, setMedGroups] = useState(null);
    const [medicines, setMedicines] = useState(null);

    const [selectedCategory, setSelectedCat] = useState("");



    /**
     * Get All
     */
    useEffect(() => {
        const getAll = async() => {
            const [medGpDb, medsDb] = await Promise.all([
                fetchAllMedGroups(),
                fetchAllMedicinesFull()
            ]);

            setMedGroups(medGpDb);
            setMedicines(medsDb);
        }

        getAll();
    }, []);


    return(
        <div className="content1 d-flex">
            {medGroups && medicines
            ? (
                <>
                    <div className="pos-left-cont">
                        <div className="d-flex mar-bottom-l1">
                            <div className="d-flex position-relative align-items-center">
                                <input type="text" className="search-box1 text-m1" placeholder="Search Medicine Inventory.."/>
                                <div className="search-box1-icon"><Icon.Search className="text-l3"/></div>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="text-l3 fw-bold mar-bottom-2">Categories</div>
                        <div className="pos-cat-cont mar-bottom-1">
                            <div className="pos-cat-box">All</div>
                            {medGroups.map(group => (
                                <div key={group.id} className="pos-cat-box">{group.group_name}</div>
                            ))}
                        </div>

                        {/* Medicines */}
                        <div className="pos-medicines-cont">
                            {medicines.map(med => (
                                <div key={med.id} className="pos-medicine">
                                    <div className="pos-medicine-pic">
                                    </div>
                                    <div className="text-m1">{med.name}</div>
                                    <div className="text-m3">{med.group.group_name}</div>
                                    <div className="text-m3">Qty: {med.qty}</div>
                                    <div className="text-m2 mar-top-3">{formatToPhilPeso(med.price)}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right */}
                    <div className="pos-rigth-cont">
                        <div className="text-l1">Order Details</div>

                        <div className="hr-line1-black3 mar-top-3 mar-bottom-3"></div>

                        <div className="pos-orders-cont d-flex justify-content-center align-items-center">
                            <div className="text-l3">
                                No Orders
                            </div>
                        </div>

                        <div className="hr-line1-dashed-black3 mar-top-3 mar-bottom-3"></div>

                        <div className="d-flex justify-content-between text-m1 mar-bottom-3">
                            <div className="color-black2">Total</div>
                            <div className="color-blue2">$00.00</div>
                        </div>

                        <div className="primary-btn-dark-blue1 text-center">Pay Now</div>
                    </div>
                </>
            )
            : (<>Loading...</>)}
        </div>
    );
}