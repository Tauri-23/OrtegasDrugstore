import { useEffect, useState } from "react";
import { useModal } from "../../../Context/ModalContext";
import { fetchAllDiscounts } from "../../../Services/GeneralDiscountService";
import axiosClient from "../../../axios-client";
import { formatToPhilPeso, notify } from "../../../assets/js/utils";

export default function AdminConfigIndex() {
    const {showModal} = useModal();

    const [discounts, setDiscounts] = useState(null);



    /**
     * Get all necessary data
     */
    useEffect(() => {
        const getAll = async() => {
            try {
                const [discountDb] = await Promise.all([
                    fetchAllDiscounts()
                ]);
                
                setDiscounts(discountDb);
            } catch (error) {
                console.error(error);
            }
        }

        getAll();
    }, []);



    /**
     * Handle Discounts
     */
    const handleAddDiscountClick = () => {
        showModal('AdminAddDiscountModal1', {handeAddPost: handleAddDiscountPost});
    }
    
    const handleAddDiscountPost = (data) => {
        const formData = new FormData();
        formData.append('discount_name', data.discountName);
        formData.append('discount_type', data.discountType);
        formData.append('discount_value', data.discountValue);

        axiosClient.post('/add-discount', formData)
        .then(({data}) => {
            if(data.status === 200) {
                setDiscounts(prev => 
                    [...prev, data.discount]
                )
            }
            notify(data.status === 200 ? 'success' : 'error', data.message, 'top-center', 3000);
        }).catch(error => console.error(error));
    }



    /**
     * Render
     */
    return(
        <div className="content1">
            <div className="text-l1 mar-bottom-2">Discounts</div>
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
                            <div className="mar-end-1 d-flex gap3 text-m3">
                                <div className="secondary-btn-black1">Edit</div>
                                <div className="primary-btn-red1">Delete</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <div className="d-flex justify-content-end mar-top-1">
                <div className="primary-btn-dark-blue1 text-m3" onClick={handleAddDiscountClick}>Add Discount</div>
            </div>
            <div className="hr-line1-black3 mar-top-1 mar-bottom-1"></div>
        </div>
    );
}