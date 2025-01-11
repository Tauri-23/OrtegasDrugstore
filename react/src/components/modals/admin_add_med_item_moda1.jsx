import propTypes from 'prop-types';
import { useState } from 'react';
import * as Icon from "react-bootstrap-icons";

const AdminAddMedItemModal1 = ({handleAddPost, onClose}) => {
    const [expiration, setExpiration] = useState("");
    const [sku, setSku] = useState("");

    return(
        <div className="modal1">
            <div className="modal-box3">
                <div className="d-flex gap1 mar-bottom-1 align-items-center position-relative">
                    <div className="circle-btn1 text-l1 position-absolute" onClick={onClose}>
                        <Icon.X/>
                    </div>
                    <div className="text-l3 fw-bold text-center w-100">Add Medicine Item</div>
                </div>


                <div className='d-flex flex-direction-y gap4 mar-bottom-3'>
                    <label htmlFor="sku">SKU</label>
                    <input 
                    type="text" 
                    id="sku" 
                    maxLength={8}
                    className="input1" 
                    value={sku}
                    onInput={(e) => {
                        if(!isNaN(e.target.value))
                            setSku(e.target.value)
                    }}/>
                </div>
                <div className='d-flex flex-direction-y gap4 mar-bottom-1'>
                    <label htmlFor="ed">Expiration Date</label>
                    <input 
                    type="date" 
                    id="ed" 
                    className="input1" 
                    value={expiration}
                    onInput={(e) => setExpiration(e.target.value)}/>
                </div>

                <div className="d-flex flex-direction-y gap3">
                    <div className="primary-btn-dark-blue1 text-center" onClick={() => handleAddPost(expiration, sku)}>Add</div>
                    {/* <div className="secondary-btn-black1 text-center" onClick={onClose}>Cancel</div> */}
                </div>
            </div>
        </div>
    )
}

AdminAddMedItemModal1.propTypes = {
    onClose: propTypes.func.isRequired,
}

export default AdminAddMedItemModal1