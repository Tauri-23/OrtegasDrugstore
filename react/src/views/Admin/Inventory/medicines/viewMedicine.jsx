import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as Icon from "react-bootstrap-icons";
import { fetchMedicineFullInfoById } from "../../../../Services/GeneralMedicineService";
import '../../../../assets/css/medicines.css';

export default function AdminViewMedicine() {
    const {medId} = useParams();
    const [medicine, setMedicine] = useState(null);

    useEffect(() => {
        const getMedicineInfo = async() => {
            try {
                const data = await fetchMedicineFullInfoById(medId);
                setMedicine(data);
            } catch(error) {console.error(error)}
        }

        getMedicineInfo();
    }, []);
    
    if(medicine) {
        return(
            <div className="content1">
                <div className="d-flex justify-content-start">
                    <Link to={'/OrtegaAdmin/Medicines'} className="d-flex gap4 align-items-center color-black1"><Icon.ArrowLeft className="text-m1"/> Back</Link>
                </div>

                <div className="d-flex mar-bottom-l1 align-items-center justify-content-between">
                    <div className="text-l1 fw-bolder">{medicine.name}</div>
                    <div className="primary-btn-dark-blue1 d-flex gap3 align-items-center text-m1"><Icon.Pen/> Edit Details</div>
                </div>

                <div className="d-flex gap1 mar-bottom-1">

                    <div className="view-medicine-box1 w-50">
                        <div className="view-medicine-box1-head">
                            <div className="text-l3">Medicine</div>
                        </div>
                        <div className="hr-line1-black3"></div>
                        <div className="view-medicine-box1-body d-flex gapl1">
                            <div className="d-flex flex-direction-y w-50">
                                <div className="text-m1 fw-bold">{medicine.medicine_id}</div>
                                <div className="text-m3">Medicine ID</div>
                            </div>
                            <div className="d-flex flex-direction-y w-50">
                                <div className="text-m1 fw-bold">{medicine.group.group_name}</div>
                                <div className="text-m3">Medicine Goup</div>
                            </div>
                        </div>
                    </div>

                    <div className="view-medicine-box1 w-50">
                        <div className="view-medicine-box1-head">
                            <div className="text-l3">Inventory</div>
                        </div>
                        <div className="hr-line1-black3"></div>
                        <div className="view-medicine-box1-body d-flex gapl1">
                            <div className="d-flex flex-direction-y w-50">
                                <div className="text-m1 fw-bold">{medicine.qty}</div>
                                <div className="text-m3">Stocks</div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Directions */}
                <div className="view-medicine-box1 w-100 mar-bottom-1">
                    <div className="view-medicine-box1-head">
                        <div className="text-l3">How to use</div>
                    </div>
                    <div className="hr-line1-black3"></div>
                    <div className="view-medicine-box1-body">
                    <div className="text-m1 fw-bold">{medicine.directions}</div>
                    </div>
                </div>

                {/* Side Effects */}
                <div className="view-medicine-box1 w-100 mar-bottom-1">
                    <div className="view-medicine-box1-head">
                        <div className="text-l3">Side Effects</div>
                    </div>
                    <div className="hr-line1-black3"></div>
                    <div className="view-medicine-box1-body">
                    <div className="text-m1 fw-bold">{medicine.side_effects}</div>
                    </div>
                </div>

                <div className="d-flex justify-content-start">
                    <div className="primary-btn-red1 text-m1 d-flex align-items-center gap3"><Icon.Trash/>Delete Medicine</div>
                </div>
            </div>
        )
    }
    else {
        return(
            <div className="content1">
                Loading...
            </div>
        );
    }
}