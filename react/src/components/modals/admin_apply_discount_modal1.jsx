import propTypes from 'prop-types';
import { useEffect, useState } from 'react';
import * as Icon from "react-bootstrap-icons";
import { formatToPhilPeso, isEmptyOrSpaces } from '../../assets/js/utils';
import { Button, Input } from 'antd';

const AdminApplyDiscountModal1 = ({ 
    discounts, 
    selectedDiscounts, setSelectedDiscounts, 
    customer, setCustomer,
    onClose
}) => {
    const [_selectedDiscount, _setSelectedDiscount] = useState(selectedDiscounts);
    const [_customer, _setCustomer] = useState({
        id_number: customer?.id_number || "",
        name: customer?.name || ""
    });

    const isAddButtonDisabled = _selectedDiscount.length > 0 ? (isEmptyOrSpaces(_customer.name) || isEmptyOrSpaces(_customer.id_number)) : false;



    /**
     * handleAddClick
     */
    const handleSelectDiscount = (discount) => {
        _setSelectedDiscount(prev =>
            prev.find(seldis => seldis.id === discount.id)
                ? prev.filter(selmed => selmed.id !== discount.id)
                : [...prev, discount]
        );
    };



    /**
     * Handle Input Customer Info
     */
    const handleInputCustomerInfo = (e) => {
        _setCustomer({..._customer, [e.target.name]: e.target.value});
    }

    const handleApplyDiscount = () => {
        setSelectedDiscounts(_selectedDiscount);
        if(_selectedDiscount.length > 0) {
            setCustomer(_customer);
        } else {
            setCustomer(null);
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
                    <div className="text-l3 fw-bold text-center w-100">Apply Discount</div>
                </div>

                <div className="discount-boxes-cont mar-bottom-1 mar-top-l1">
                    {discounts.map(discount => (
                        <div 
                        key={discount.id} 
                        className={`apply-discount-box ${_selectedDiscount.some(seldis => seldis.id == discount.id) ? 'active' : ''}`}
                        onClick={() => handleSelectDiscount(discount)}>
                            <div>{discount.discount_name}</div>
                            <div>{discount.discount_type === "Amount" ? formatToPhilPeso(discount.discount_value) : `${discount.discount_value} %`}</div>
                        </div>
                    ))}
                </div>

                {_selectedDiscount?.length > 0 && (
                    <>
                        <Input
                        size='large'
                        value={_customer.id_number}
                        name='id_number'
                        onChange={handleInputCustomerInfo}
                        placeholder='ID Number'
                        className='mar-y-3'/>

                        <Input
                        size='large'
                        value={_customer.name}
                        name='name'
                        onChange={handleInputCustomerInfo}
                        placeholder='Name'
                        className='mar-y-3'/>
                    </>
                )}

                <div className="d-flex flex-direction-y mar-top-1 gap3">
                    <Button
                    type='primary'
                    disabled={isAddButtonDisabled}
                    onClick={() => {handleApplyDiscount(); onClose()}}
                    >
                        Apply Discount
                    </Button>
                </div>
            </div>
        </div>
    )
}

AdminApplyDiscountModal1.propTypes = {
    onClose: propTypes.func.isRequired,
}

export default AdminApplyDiscountModal1