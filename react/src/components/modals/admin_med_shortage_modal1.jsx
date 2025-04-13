import * as Icon from "react-bootstrap-icons";
import { Link } from "react-router-dom";

const AdminMedShortageModal1 = ({medShortage, expiringMeds, onClose}) => {



    /**
     * Render
     */
    return(
        <div className="modal1">
            <div className="modal-box2">
                <div className="d-flex gap1 mar-bottom-1 align-items-center position-relative">
                    <div className="circle-btn1 text-l1 position-absolute cursor-pointer" onClick={onClose}>
                        <Icon.X/>
                    </div>
                    <div className="text-l3 fw-bold text-center w-100">Medicine Shortages</div>
                </div>

                <div className="text-m1 color-red1 mar-bottom-3">There are {medShortage.length} medicines are in alarming stocks 😱</div>
                {expiringMeds?.length > 0 && (
                    <div className="text-m1 color-red1 mar-bottom-1">There are {expiringMeds.reduce((acc, x) => acc + x.qty, 0)} expiring medicines 💀</div>
                )}
                
                <center><Link to={'/OrtegaAdmin/MedicineShortageExpiring'} onClick={onClose} className="primary-btn-red1">Take Action</Link></center>
            </div>
        </div>
    )
}

export default AdminMedShortageModal1