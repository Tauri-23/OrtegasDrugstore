import { Button, Select } from 'antd';
import { useEffect, useState } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { formatToPhilPeso, isEmptyOrSpaces, notify } from '../../assets/js/utils';

export default function ReturnItemsModal({medicines, item, purchaseTransaction, handleReturnPost, onClose}) {
    const [selectedReplacement, setSelectedReplacement] = useState({id: "", qty: 0});
    const [selectedQty, setSelectedQty] = useState(0);
    const [returnItem, setReturnItem] = useState({
        id: item.id,
        qty: item.qty,
        reason: ""
    });

    const deductedSubtotal = item.qty * item.medicine.price;
    const addedSubtotal = selectedReplacement.id !== "" ? selectedReplacement.price * selectedQty : 0;
    const newSubtotal = purchaseTransaction.subtotal - deductedSubtotal + addedSubtotal;
    const discountRecord = purchaseTransaction.discount_value;
    const oldDiscountable = purchaseTransaction.items.filter(x => x.medicine.discountable).reduce((acc, med) => acc + med.medicine.price * med.qty, 0);
    const newDiscountable = oldDiscountable + (selectedReplacement.discountable ? selectedReplacement.price * selectedQty : 0);

    const oldDiscountDeduction = purchaseTransaction.discount_type === "Amount" ? oldDiscountable - discountRecord : oldDiscountable * (discountRecord / 100);
    const newDiscountDeduction = purchaseTransaction.discount_type === "Amount" ? newDiscountable - discountRecord : newDiscountable * (discountRecord / 100);
    const newTotal = newSubtotal - newDiscountDeduction;

    const differenceColor = newTotal - purchaseTransaction.total > -1 ? "color-green1" : "color-red1";
    const differenceText = newTotal - purchaseTransaction.total > -1 ? "Added Price" : "Change";



    /**
     * Handlers
     */
    const handleInput = (e) => {
        setReturnItem({...returnItem, [e.target.name]: e.target.value});
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
                    <div className="text-l3 fw-bold text-center w-100">Replace Item</div>
                </div>

                {/* Item to be replaced */}
                <div className='mar-bottom-1'>
                    <div className="text-m1 fw-bold">Item to be replaced</div>
                    <div className="text-l3">{item.medicine.name} x {item.qty}pc/s</div>
                </div>

                {/* Reason */}
                <div className='mar-bottom-3'>
                    <label htmlFor="reason">Reason</label>
                    <textarea
                    className='input1 w-100' 
                    name="reason" 
                    id="reason" 
                    value={returnItem.reason} 
                    onChange={handleInput}>

                    </textarea>
                </div>

                {/* Change Medicine */}
                <div className={`d-flex flex-direction-y ${selectedReplacement.id === "" ? "mar-bottom-1" : "mar-bottom-3"}`}>
                    <label htmlFor="repMed">Replacement Medicine</label>
                    <Select
                    className='w-100'
                    size='large'
                    showSearch
                    optionFilterProp="children"  // Filter based on the option text
                    filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                    }
                    options={[
                        {label: "Select replacement", value: ""},
                        ...medicines.map(medicine => ({label: `${medicine.name} (${medicine.qty} pcs)`, value: medicine.id}))
                    ]}
                    value={selectedReplacement.id}
                    onChange={(e) => 
                        setSelectedReplacement(e === "" ? {id: "", qty: 0} : medicines.filter(x => x.id === e)[0])}
                    />
                </div>

                {/* QTY */}
                {selectedReplacement.id !== "" && (
                    <>
                        <div className="d-flex flex-direction-y mar-bottom-3">
                            <label htmlFor="qty">Quantity</label>
                            <input 
                            type="number" 
                            id="qty" 
                            min={1} 
                            max={selectedReplacement.qty} 
                            className="input1" 
                            value={selectedQty}
                            onChange={(e) => setSelectedQty(e.target.value)}/>
                        </div>

                        <div className="d-flex flex-direction-y mar-bottom-1">
                            <div className="d-flex align-items-center justify-content-between w-100 fw-bold">
                                <div className="text-m2 fw-bold">Old Subtotal</div>
                                {formatToPhilPeso(purchaseTransaction.subtotal)}
                            </div>
                            <div className="d-flex align-items-center justify-content-between w-100">
                                <div className="text-m2">Deducted (replaced item)</div>
                                <div className="color-green1">-{formatToPhilPeso(deductedSubtotal)}</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between w-100">
                                <div className="text-m2">Added (replacement item)</div>
                                <div className="color-red1">+{formatToPhilPeso(addedSubtotal)}</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between w-100 fw-bold">
                                <div className="text-m2 fw-bold">New Subtotal</div>
                                {formatToPhilPeso(newSubtotal)}
                            </div>
                            <div className="d-flex align-items-center justify-content-between w-100">
                                <div className="text-m2">Discount Old ({discountRecord}%)</div>
                                -{formatToPhilPeso(oldDiscountDeduction)}
                            </div>
                            <div className="d-flex align-items-center justify-content-between w-100">
                                <div className="text-m2">Discount New ({discountRecord}%)</div>
                                -{formatToPhilPeso(newDiscountDeduction)}
                            </div>
                            <div className="d-flex align-items-center justify-content-between w-100 fw-bold">
                                <div className="text-m2 fw-bold">Old Total</div>
                                {formatToPhilPeso(purchaseTransaction.total)}
                            </div>
                            <div className="d-flex align-items-center justify-content-between w-100 fw-bold">
                                <div className="text-m2 fw-bold">New Total</div>
                                {formatToPhilPeso(newTotal)}
                            </div>
                            <div 
                            className={`d-flex align-items-center justify-content-between w-100 fw-bold ${differenceColor}`}>
                                <div className="text-m2 fw-bold">Difference ({differenceText})</div>
                                {formatToPhilPeso(newTotal - purchaseTransaction.total)}
                            </div>
                        </div>
                    </>
                )}


                <Button
                type='primary'
                size='large'
                className='w-100'
                disabled={isEmptyOrSpaces(returnItem.reason) || (selectedReplacement.id === "") || (selectedQty < 1) || (selectedQty > selectedReplacement.qty)}
                onClick={() => {
                    handleReturnPost(
                        returnItem, 
                        selectedReplacement.id, 
                        newSubtotal,
                        newDiscountDeduction,
                        newTotal,
                        selectedQty
                    ); 
                    onClose();
                }}>
                    Return Item
                </Button>
            </div>
        </div>
    )
}