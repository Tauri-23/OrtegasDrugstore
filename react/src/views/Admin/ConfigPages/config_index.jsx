import { useEffect, useState } from "react";
import { useModal } from "../../../Context/ModalContext";
import { fetchAllDiscounts } from "../../../Services/GeneralDiscountService";
import axiosClient from "../../../axios-client";
import { formatToPhilPeso, notify } from "../../../assets/js/utils";
import { useStateContext } from "../../../Context/ContextProvider";
import DiscountSettings from "./components/discountSettings";

export default function AdminConfigIndex() {
    const {user} = useStateContext();
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
        showModal('AdminAddDiscountModal1', {
            handeAddPost: (data) => {
                const formData = new FormData();
                formData.append('discount_name', data.discountName);
                formData.append('discount_type', data.discountType);
                formData.append('discount_value', data.discountValue);
                formData.append('admin', user.id);
        
                axiosClient.post('/add-discount', formData)
                .then(({data}) => {
                    if(data.status === 200) {
                        setDiscounts(prev => 
                            [...prev, data.discount]
                        )
                    }
                    notify(data.status === 200 ? 'success' : 'error', data.message, 'top-center', 3000);
                }).catch(error => console.error(error));
        }});
    }

    const handleEnableDisableDiscount = (discountId) => {
        const formData = new FormData();
        formData.append("discountId", discountId);

        axiosClient.post("/enable-disable-discount", formData)
        .then(({data}) => {
            if(data.status === 200) {
                setDiscounts(data.discounts);
            }

            notify(data.status === 200 ? "success" : "error", data.message, "top-center", 3000);
        }).catch(error => {
            notify("error", "Server Error", "top-center", 3000);
            console.error(error);
        })
    }



    /**
     * Render
     */
    return(
        <div className="content1">
            <DiscountSettings 
            discounts={discounts} 
            setDiscounts={setDiscounts}
            handleAddDiscountClick={handleAddDiscountClick}
            handleEnableDisableDiscount={handleEnableDisableDiscount}/>
            <div className="hr-line1-black3 mar-top-1 mar-bottom-1"></div>
        </div>
    );
}