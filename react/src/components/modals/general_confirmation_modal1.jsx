import propTypes from 'prop-types';
import { useEffect, useState } from 'react';
import * as Icon from "react-bootstrap-icons";

const GeneralConfirmationModal1 = ({title, text, btnTitle, handleBtnClick, onClose}) => {

    return(
        <div className="modal1">
            <div className="modal-box3">
                <div className="d-flex gap1 mar-bottom-1 align-items-center position-relative">
                    <div className="circle-btn1 text-l1 position-absolute" onClick={onClose}>
                        <Icon.X/>
                    </div>
                    <div className="text-l3 fw-bold text-center w-100">{title}</div>
                </div>

                <div className='d-flex flex-direction-y gap4 mar-bottom-1'>
                    {text}
                </div>

                <div className="d-flex flex-direction-y gap3">
                    <button 
                    className={`primary-btn-dark-blue1 text-center`} 
                    onClick={() => {handleBtnClick(); onClose()}}>
                        {btnTitle}
                    </button>
                </div>
            </div>
        </div>
    )
}

GeneralConfirmationModal1.propTypes = {
    onClose: propTypes.func.isRequired,
}

export default GeneralConfirmationModal1