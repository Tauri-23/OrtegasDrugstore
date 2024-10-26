import propTypes from 'prop-types';
import * as Icon from "react-bootstrap-icons";
import { formatToPhilPeso } from '../../assets/js/utils';

const AdminViewReceiptModal1 = ({ data, onClose}) => {

    /**
     * Render
     */
    return(
        <div className="modal1">
            <div className="modal-box2">
                <div className="d-flex gap1 mar-bottom-1 align-items-center position-relative">
                    <div className="circle-btn1 text-l1 position-absolute" onClick={onClose}>
                        <Icon.X/>
                    </div>
                    <div className="text-l3 fw-bold text-center w-100">Reciept Preview</div>
                </div>

                {/* Receipt */}
                <div className="receipt-cont mar-top-l1 mar-bottom-l1">
                    <div className="receipt-box">
                        <div className="text-l3 text-center mar-bottom-2">Ortega's Drugstore</div>
                        <div className="text-m3">Address: 2464 Tejeron St. Brgy. 874 Sta. Ana Manila Zone 96</div>
                        <div className="text-m3">Tel: 123-1456-789</div>

                        <div className="hr-line1-dashed-black3 mar-top-3 mar-bottom-3"></div>

                        <div className="text-m3">Receipt ID: XXXXXXXXXXXX</div>

                        <div className="hr-line1-dashed-black3 mar-top-3 mar-bottom-3"></div>

                        {data.meds.map(med => (
                            <div key={med.id} className="d-flex justify-content-between text-m3">
                                <div>{med.qty} x {med.name}</div>
                                <div>{formatToPhilPeso(med.price * med.qty)}</div>
                            </div>
                        ))}

                        <div className="hr-line1-dashed-black3 mar-top-3 mar-bottom-3"></div>

                        <div className="d-flex justify-content-between">
                            <div className='text-m2'>Subtotal</div>
                            <div>{formatToPhilPeso(data.subtotal)}</div>
                        </div>

                        {data.selectedDiscounts?.length > 0 && (<div className="">
                            <div className='text-m2'>Discount(s)</div>
                            <div className="mar-start-3 d-flex justify-content-between">
                                {data.selectedDiscounts.map(seldis => (
                                    <div key={seldis.id} className="d-flex justify-content-between text-m3 w-100">
                                        <div>{seldis.discount_name}</div>
                                        <div>
                                            {seldis.discount_type === "Amount" ? ` - ${formatToPhilPeso(seldis.discount_value)}` : `- ${seldis.discount_value}%`}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>)}

                        <div className="d-flex justify-content-between">
                            <div className='text-m1 fw-bold'>Total</div>
                            <div className='text-m1 fw-bold'>{formatToPhilPeso(data.total)}</div>
                        </div>

                        <div className="d-flex justify-content-between">
                            <div className='text-m3'>Cash</div>
                            <div className='text-m3'>{formatToPhilPeso(data.subtotal)}</div>
                        </div>

                        <div className="d-flex justify-content-between">
                            <div className='text-m3'>Change</div>
                            <div className='text-m3'>{formatToPhilPeso(data.subtotal)}</div>
                        </div>

                        <div className="hr-line1-dashed-black3 mar-top-3 mar-bottom-3"></div>
                    </div>
                </div>

                <div className="d-flex gap3">
                    <button 
                    className={`primary-btn-red1 text-center flex-grow-1`} 
                    onClick={() => {onClose()}}
                    >
                        Cancel
                    </button>
                    <button 
                    //disabled={!addBtnReady}
                    className={`primary-btn-dark-blue1 text-center flex-grow-1`} 
                    onClick={() => {handleApplyDiscount(); onClose()}}
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    )
}

AdminViewReceiptModal1.propTypes = {
    onClose: propTypes.func.isRequired,
}

export default AdminViewReceiptModal1