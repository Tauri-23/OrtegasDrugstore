import propTypes from 'prop-types';
import { useEffect, useState } from 'react';
import * as Icon from "react-bootstrap-icons";
import { formatToPhilPeso, isEmptyOrSpaces } from '../../assets/js/utils';

const AdminApplyDiscountModal1 = ({ discounts, selectedDiscounts, setSelectedDiscounts, onClose}) => {
    const [_selectedDiscount, _setSelectedDiscount] = useState(selectedDiscounts);



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

    const handleApplyDiscount = () => {
        setSelectedDiscounts(_selectedDiscount);
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

                <div className="discount-boxes-cont mar-bottom-l1 mar-top-l1">
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

                <div className="d-flex flex-direction-y gap3">
                    <button 
                    //disabled={!addBtnReady}
                    className={`primary-btn-dark-blue1 text-center`} 
                    onClick={() => {handleApplyDiscount(); onClose()}}
                    >
                        Apply Discount
                    </button>
                </div>
            </div>
        </div>
    )
}

AdminApplyDiscountModal1.propTypes = {
    onClose: propTypes.func.isRequired,
}

export default AdminApplyDiscountModal1