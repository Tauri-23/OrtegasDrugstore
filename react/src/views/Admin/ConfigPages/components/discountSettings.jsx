import { Checkbox } from 'antd';
import { formatToPhilPeso, notify } from '../../../../assets/js/utils';
import { useModal } from '../../../../Context/ModalContext';
import axiosClient from '../../../../axios-client';
import { useStateContext } from '../../../../Context/ContextProvider';

export default function DiscountSettings({discounts, setDiscounts, handleAddDiscountClick, handleEnableDisableDiscount}) {
    const {user} = useStateContext();
    const {showModal} = useModal();


    /**
     * Handlers
     */
    const handleDeleteDiscount = (discount) => {
        showModal("GeneralConfirmationModal1", {
            title: "Delete Discount", 
            text: `Do you want to delete discount: ${discount.discount_name}`, 
            btnTitle: "Delete Discount", 
            handleBtnClick: () => {
                const formData = new FormData();
                formData.append("discountId", discount.id);
                formData.append("admin", user.id);

                axiosClient.post("/delete-discount", formData)
                .then(({data}) => {
                    console.log(data);
                    if(data.status === 200) {
                        setDiscounts(prev => prev.filter(x => x.id !== discount.id));
                    }
                    notify(data.status === 200 ? "success" : "error", data.message, "top-center", 3000);
                })
                .catch((e) => {
                    console.error(e);
                    notify("error", "Server Error", "top-center", 3000);
                })
            },
        })
    }

    const handleEditDiscount = (discount) => {
        showModal("AdminEditDiscountModal1", {
            discount,
            handleEditDiscountPost: (discountName) => {
                const formData = new FormData();
                formData.append("discountId", discount.id);
                formData.append("newName", discountName);
                formData.append("admin", user.id);
        
                axiosClient.post('/edit-discount', formData)
                .then(({data}) => {
                    if(data.status === 200) {
                        setDiscounts(data.discounts);
                    }
                    notify(data.status === 200 ? "success" : "error", data.message, "top-center", 3000);
                }).catch(error => {
                    console.error(error);
                    notify("error", "Server Error", "top-center", 3000);
                })
            }
        })
    }



    /**
     * Render
     */
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
                                <button 
                                className="secondary-btn-black1" 
                                onClick={() => handleEditDiscount(discount)}
                                >
                                    Edit
                                </button>
                                <button className="primary-btn-red1" onClick={() => handleDeleteDiscount(discount)}>Delete</button>
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