import propTypes from 'prop-types';
import * as Icon from "react-bootstrap-icons";
import { formatDateTime, formatToPhilPeso } from '../../assets/js/utils';
import BarcodeGenerator from '../../Services/BarcodeGenerator';
import QRCodeGenerator from '../../Services/QrcodeGenerator';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const AdminViewReceiptModal1 = ({ data, handleDoneTransaction = null, handleVoid = null, onClose}) => {
    const receiptRef = useRef(null);

    // const UseReactToPrintFn = useReactToPrint({
    //     contentRef: () => receiptRef,
    //     // documentTitle: `Receipt-${data.id}`,  // Optional: set the document title
    //     // onAfterPrint: () => onClose()  // Close modal after printing
    // });

    const UseReactToPrintFn = useReactToPrint({ receiptRef });
    

    const handlePrintClick = () => {

        if(receiptRef.current){
            console.log(receiptRef);
            UseReactToPrintFn();
        }        
    }

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
                    <div className="text-l3 fw-bold text-center w-100">Receipt Preview</div>
                </div>

                {/* Receipt */}
                <div className="receipt-cont mar-top-l1 mar-bottom-l1">
                    <div ref={receiptRef} className="receipt-box">
                        <div className="text-l3 text-center mar-bottom-2">Ortega's Drugstore</div>
                        <div className="text-m3">Address: 2464 Tejeron St. Brgy. 874 Sta. Ana Manila Zone 96</div>
                        <div className="text-m3">Tel: 123-1456-789</div>

                        <div className="hr-line1-dashed-black3 mar-top-3 mar-bottom-3"></div>

                        <div className="text-m3">Receipt ID: {data.id}</div>

                        <div className="hr-line1-dashed-black3 mar-top-3 mar-bottom-3"></div>

                        {data.items.map(med => (
                            <div key={med.id} className="d-flex justify-content-between text-m3">
                                <div>{med.qty} x {med.medicine.name}</div>
                                <div>{formatToPhilPeso(med.medicine.price * med.qty)}</div>
                            </div>
                        ))}

                        <div className="hr-line1-dashed-black3 mar-top-3 mar-bottom-3"></div>

                        <div className="d-flex justify-content-between">
                            <div className='text-m2'>Subtotal</div>
                            <div>{formatToPhilPeso(data.subtotal)}</div>
                        </div>

                        {data.discount_name !== null && (
                            <div>
                                <div className='text-m2'>Discount(s)</div>
                                <div className="mar-start-3 d-flex justify-content-between">
                                    <div className="d-flex justify-content-between text-m3 w-100">
                                        <div>{data.discount_name}</div>
                                        <div>
                                            {data.discount_type === "Amount" ? ` - ${formatToPhilPeso(data.discount_value)}` : `- ${data.discount_value}%`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                                <div className='text-m2'>VAT (12%)</div>
                                <div className="mar-start-3">
                                    <div className="d-flex justify-content-between text-m3 w-100">
                                        <div>Vatable</div>
                                        <div>
                                            {formatToPhilPeso(data.vatable)}
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between text-m3 w-100">
                                        <div>Vat Cost</div>
                                        <div>
                                            + {formatToPhilPeso(data.vat_additional)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        <div className="d-flex justify-content-between">
                            <div className='text-m1 fw-bold'>Total</div>
                            <div className='text-m1 fw-bold'>{formatToPhilPeso(data.total)}</div>
                        </div>

                        <div className="d-flex justify-content-between">
                            <div className='text-m3'>Cash</div>
                            <div className='text-m3'>{formatToPhilPeso(data.cash)}</div>
                        </div>

                        <div className="d-flex justify-content-between">
                            <div className='text-m3'>Change</div>
                            <div className='text-m3'>{formatToPhilPeso(data.cash - data.total)}</div>
                        </div>

                        <div className="hr-line1-dashed-black3 mar-top-3 mar-bottom-3"></div>

                        {data.customer && (
                            <div>
                                <div className="text-m3">Customer Information</div>
                                <div className="hr-line1-black1 w-50 mar-top-1" style={{height: 2}}></div>
                                <div className="text-m3">ID Number: {data.customer.id_number}</div>
                                <div className="text-m3">Name: {data.customer.name}</div>

                                <div className="hr-line1-dashed-black3 mar-top-3 mar-bottom-3"></div>
                            </div>
                        )}

                        <div className="d-flex justify-content-center mar-bottom-3">
                            {/* <BarcodeGenerator value={String(data.id)}/> */}
                            <QRCodeGenerator value={String(data.id)}/>
                        </div>

                        <div className="text-center text-m3">Transaction date: {formatDateTime(data.created_at)}</div>
                    </div>
                </div>

                <div className="d-flex gap3">
                    {handleVoid && (
                        <button 
                        className={`primary-btn-red1 text-center flex-grow-1`} 
                        onClick={() => {handleVoid(data.id)}}
                        >
                            Void
                        </button>
                    )}
                    {handleDoneTransaction && (
                        <button 
                        className={`primary-btn-dark-blue1 text-center flex-grow-1`} 
                        onClick={() => {handleDoneTransaction(); onClose();}}
                        >
                            Done
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

AdminViewReceiptModal1.propTypes = {
    onClose: propTypes.func.isRequired,
}

export default AdminViewReceiptModal1