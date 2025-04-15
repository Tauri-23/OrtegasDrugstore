import { Checkbox } from 'antd';
import { formatToPhilPeso } from '../../../../assets/js/utils';

export default function DiscountSettings({discounts, handleAddDiscountClick, handleEnableDisableDiscount}) {
    return(
        <>
            <h3 className="fw-bold mar-bottom-2">Discounts Settings</h3>
            {discounts?.length < 1 && (
                <div className="mar-start-1 mar-bottom-2">
                    No Discounts
                </div>
            )}

            {!discounts && (
                <div className="mar-start-1 mar-bottom-2">
                    Loading...
                </div>
            )}

            {discounts?.length > 0 && (
                <div className="d-flex flex-direction-y gap3">
                    {discounts.map(discount => (
                        <div key={discount.id} className="mar-start-1 w-100 d-flex justify-content-between align-items-center">
                            <div className="d-flex gap1 text-m1">
                                <div>
                                    {discount.discount_name}
                                </div>
                                <div>
                                    {discount.discount_type === "Amount" ? formatToPhilPeso(discount.discount_value) : `${discount.discount_value} %`}
                                </div>
                            </div>
                            <div className="mar-end-1 d-flex gap3 text-m3 align-items-center">
                                <Checkbox onClick={() => handleEnableDisableDiscount(discount.id)} checked={discount.enabled}>Enabled</Checkbox>
                                <button className="secondary-btn-black1">Edit</button>
                                <button className="primary-btn-red1">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <div className="d-flex justify-content-end mar-top-1">
                <div className="primary-btn-dark-blue1 text-m3" onClick={handleAddDiscountClick}>Add Discount</div>
            </div>
        </>
    )
}