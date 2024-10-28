import propTypes from 'prop-types';
import { useEffect, useState } from 'react';
import * as Icon from "react-bootstrap-icons";

const AdminEditMedPicPreviewModal1 = ({pic, handleUpdatePost, onClose}) => {
    return(
        <div className="modal1">
            <div className="modal-box3">
                <div className="d-flex gap1 mar-bottom-1 align-items-center position-relative">
                    <div className="circle-btn1 text-l1 position-absolute" onClick={onClose}>
                        <Icon.X/>
                    </div>
                    <div className="text-l3 fw-bold text-center w-100">Change Medicine Picture</div>
                </div>

                <div className="med-pic-modal">
                    <img src={URL.createObjectURL(pic)}/>
                </div>

                <div className="d-flex flex-direction-y gap3">
                    <button 
                    className={`primary-btn-dark-blue1 text-center`} 
                    onClick={() => {handleUpdatePost(); onClose()}}>
                        Update
                    </button>
                    {/* <div className="secondary-btn-black1 text-center" onClick={onClose}>Cancel</div> */}
                </div>
            </div>
        </div>
    )
}

AdminEditMedPicPreviewModal1.propTypes = {
    onClose: propTypes.func.isRequired,
}

export default AdminEditMedPicPreviewModal1