import propTypes from 'prop-types';
import { useState } from 'react';
import * as Icon from "react-bootstrap-icons";
import { formatToPhilPeso } from '../../assets/js/utils';

const AdminPayCashModal1 = ({cash, setCash, amountDue, handlePayPost, onClose}) => {
    const [_cash, _setCash] = useState(cash);

    const handlePayClick = () => {
        setCash(_cash);
        handlePayPost(_cash);
    }

    return(
        <div className="modal1">
            <div className="modal-box3">
                <div className="d-flex gap1 mar-bottom-1 align-items-center position-relative">
                    <div className="circle-btn1 text-l1 position-absolute" onClick={onClose}>
                        <Icon.X/>
                    </div>
                    <div className="text-l3 fw-bold text-center w-100">Cash</div>
                </div>

                <div className='d-flex flex-direction-y gap4 mar-bottom-1'>
                    <label htmlFor="grpname">Cash</label>
                    <div>Amount due: {formatToPhilPeso(amountDue)}</div>
                    <input type="number" id="grpname" className="input1" value={_cash} onInput={(e) => _setCash(e.target.value)}/>
                </div>

                <div className="d-flex flex-direction-y gap3">
                    <button 
                    disabled={amountDue > _cash}
                    className={`primary-btn-dark-blue1 text-center ${amountDue > _cash ? 'disabled' : ''}`}
                    onClick={() => {handlePayClick()}}
                    >
                        Pay
                    </button>
                    {/* <div className="secondary-btn-black1 text-center" onClick={onClose}>Cancel</div> */}
                </div>
            </div>
        </div>
    )
}

AdminPayCashModal1.propTypes = {
    onClose: propTypes.func.isRequired,
}

export default AdminPayCashModal1