import propTypes from 'prop-types';
import { useEffect, useState } from 'react';
import * as Icon from "react-bootstrap-icons";

const AdminDelMedConfirmationModal1 = ({medicine, handleDelPost, onClose}) => {
    const [delBtnDisabled, setDelBtnDisabled] = useState(true);

    const handleConfirmationInput = (value) => {
        if(value === "I CONFIRM") {
            setDelBtnDisabled(false);
        } else {
            setDelBtnDisabled(true);
        }
    }

    return(
        <div className="modal1">
            <div className="modal-box3">
                <div className="d-flex gap1 mar-bottom-1 align-items-center position-relative">
                    <div className="circle-btn1 text-l1 position-absolute" onClick={onClose}>
                        <Icon.X/>
                    </div>
                    <div className="text-l3 fw-bold text-center w-100">Delete Medicine</div>
                </div>

                <div className='d-flex flex-direction-y gap4 mar-bottom-1'>
                    {medicine.name} will be permanently deleted, please input "I CONFIRM" if you want to delete this medicine.
                    <input type="text" className="input1" onInput={(e) => handleConfirmationInput(e.target.value)}/>
                </div>

                <div className="d-flex flex-direction-y gap3">
                    <button 
                    disabled={delBtnDisabled}
                    className={`primary-btn-dark-blue1 text-center ${delBtnDisabled ? 'disabled' : ''}`} 
                    onClick={() => {handleDelPost(medicine.id); onClose()}}>
                        Delete
                    </button>
                    {/* <div className="secondary-btn-black1 text-center" onClick={onClose}>Cancel</div> */}
                </div>
            </div>
        </div>
    )
}

AdminDelMedConfirmationModal1.propTypes = {
    onClose: propTypes.func.isRequired,
}

export default AdminDelMedConfirmationModal1