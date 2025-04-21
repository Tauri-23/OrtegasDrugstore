import propTypes from 'prop-types';
import { useEffect, useState } from 'react';
import * as Icon from "react-bootstrap-icons";
import { isEmptyOrSpaces } from '../../assets/js/utils';

const AdminEditDiscountModal1 = ({discount, handleEditDiscountPost, onClose}) => {
    const [discountName, setDiscountName] = useState(discount.discount_name);



    /**
     * Render
     */
    return(
        <div className="modal1">
            <div className="modal-box3">
                <div className="d-flex gap1 mar-bottom-1 align-items-center position-relative">
                    <div className="circle-btn1 text-l1 position-absolute" onClick={onClose}>
                        <Icon.X/>
                    </div>
                    <div className="text-l3 fw-bold text-center w-100">Edit Discount</div>
                </div>

                {/* <div className='d-flex flex-direction-y gap4 mar-bottom-3'>
                    <label htmlFor="discType">Discount Type</label>
                    <select className="input1" id="discType" value={discountType} onChange={(e => setDiscountType(e.target.value))}>
                        <option value="Amount">Amount</option>
                        <option value="Percent">Percent</option>
                    </select>
                </div> */}

                <div className='d-flex flex-direction-y gap4 mar-bottom-3'>
                    <label htmlFor="discname">Discount Name</label>
                    <input type="text" id="discname" className="input1" value={discountName} onInput={(e) => setDiscountName(e.target.value)}/>
                </div>

                {/* <div className='d-flex flex-direction-y gap4 mar-bottom-1'>
                    <label htmlFor="discvalue">Discount Value</label>
                    <input type="number" id="discvalue" className="input1" step="any" min={1} value={discountValue} onInput={(e) => setDiscountValue(e.target.value)}/>
                </div> */}

                <div className="d-flex flex-direction-y gap3">
                    <button 
                    disabled={isEmptyOrSpaces(discountName)}
                    className={`primary-btn-dark-blue1 text-center ${isEmptyOrSpaces(discountName) ? 'disabled' : ''}`} 
                    onClick={() => {handleEditDiscountPost(discountName); onClose()}}
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    )
}

AdminEditDiscountModal1.propTypes = {
    onClose: propTypes.func.isRequired,
}

export default AdminEditDiscountModal1