import propTypes from 'prop-types';
import { useCallback, useState } from 'react';
import * as Icon from "react-bootstrap-icons";
import { isEmptyOrSpaces } from '../../assets/js/utils';

const AdminAddCustomerInfoModal1 = ({
    customer, setCustomer,
    onClose
}) => {
    const [_customerName, _setCustomerName] = useState(customer ? customer.name :  "");
    const [_customerNumber, _setCustomerNumber] = useState(customer ? customer.number :  "");
    const [_customerAddress, _setCustomerAddress] = useState(customer ? customer.address :  "");
    const [_customerNote, _setCustomerNote] = useState(customer ? customer.note :  "");



    const handleAdd = () => {
        setCustomer({
            id_number: "asd",
            name: _customerName,
        });
    }

    const handleClear = () => {
        setCustomer(null);
    }



    const isAddBtnReady = useCallback(() => {
        return !(isEmptyOrSpaces(_customerName) || isEmptyOrSpaces(_customerNumber) || isEmptyOrSpaces(_customerAddress));
    }, [_customerName, _customerNumber, _customerAddress]);



    return(
        <div className="modal1">
            <div className="modal-box2">
                <div className="d-flex gap1 mar-bottom-1 align-items-center position-relative">
                    <div className="circle-btn1 text-l1 position-absolute" onClick={onClose}>
                        <Icon.X/>
                    </div>
                    <div className="text-l3 fw-bold text-center w-100">Add Customer Information</div>
                </div>

                <div className='d-flex flex-direction-y gap4 mar-bottom-3'>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" className="input1" value={_customerName} onInput={(e) => _setCustomerName(e.target.value)}/>
                </div>

                <div className="d-flex gap3 align-items-center mar-bottom-3 w-100">
                    <div className='d-flex flex-direction-y gap4 flex-grow-1'>
                        <label htmlFor="number">Contact number</label>
                        <input type="text" id="number" className="input1" maxLength={11} value={_customerNumber} onInput={(e) => _setCustomerNumber(e.target.value)}/>
                    </div>
                    <div className='d-flex flex-direction-y gap4 flex-grow-1'>
                        <label htmlFor="address">Address</label>
                        <input type="text" id="address" className="input1" value={_customerAddress} onInput={(e) => _setCustomerAddress(e.target.value)}/>
                    </div>
                </div>

                <div className='d-flex flex-direction-y gap4 mar-bottom-1'>
                    <label htmlFor="note">Note <span className="text-m3 fst-italic">optional</span></label>
                    <textarea className="input1 resizable-none" id="note" rows={5} value={_customerNote} onInput={(e) => _setCustomerNote(e.target.value)}/>
                </div>

                <div className="d-flex flex-direction-y gap3">
                    <button 
                    disabled={!isAddBtnReady()}
                    className={`primary-btn-dark-blue1 text-center ${isAddBtnReady() ? '' : 'disabled'}`} 
                    onClick={() => {handleAdd(); onClose()}}>
                        {customer ? 'Edit' : 'Add'}
                    </button>
                    {customer && (
                        <button 
                        className={`secondary-btn-black1 text-center`} 
                        onClick={() => {handleClear(); onClose()}}>
                            Clear
                        </button>
                    )}
                    {/* <div className="secondary-btn-black1 text-center" onClick={onClose}>Cancel</div> */}
                </div>
            </div>
        </div>
    )
}

AdminAddCustomerInfoModal1.propTypes = {
    onClose: propTypes.func.isRequired,
}

export default AdminAddCustomerInfoModal1