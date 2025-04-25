import * as Icon from 'react-bootstrap-icons';
import { formatToPhilPeso } from '../../assets/js/utils';
import { Button } from 'antd';

export default function CashierCheckountItemsPreviewodal({items, subTotal, discount, discountDeduction, vatable, total, handleProceedPayment, onClose}) {
    return(
        <div className="modal1">
            
            <div className="modal-box2">
                <div className="d-flex gap1 mar-bottom-1 align-items-center position-relative">
                    <div className="circle-btn1 text-l1 position-absolute" onClick={onClose}>
                        <Icon.X/>
                    </div>
                    <div className="text-l3 fw-bold text-center w-100">Checkout Preview</div>
                </div>


                {items.map((item, index) => (
                    <div className="d-flex justify-content-between">
                        <div className="text-m2">{item.name} (X {item.qty})</div>
                        <div className="text-m2">{item.price}</div>
                    </div>
                ))}

                <div className="hr-line1-black1 mar-y-1"></div>

                <div className="text-m1">Subtotal: {formatToPhilPeso(subTotal)}</div>
                {discount !== null && (
                    <div className="text-m1">Discounts (- {discount.discount_type === "Amount" ? `${formatToPhilPeso(discount.discount_value)}`: `${discount.discount_value}%`}): {formatToPhilPeso(discountDeduction)}</div>
                )}
                
                <div className="text-m1">Vatable: {formatToPhilPeso(vatable)}</div>
                <div className="text-m1">VAT (12%): {formatToPhilPeso(vatable * .12)}</div>
                <div className="text-m1">Total: {formatToPhilPeso(total)}</div>

                <div className="hr-line1-black1 mar-y-1"></div>

                <Button
                type='primary'
                size='large'
                onClick={handleProceedPayment}
                >
                    Proceed to Payment
                </Button>
            </div>
        </div>
    )
}