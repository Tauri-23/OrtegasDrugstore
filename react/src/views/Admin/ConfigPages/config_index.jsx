import { useModal } from "../../../Context/ModalContext";

export default function AdminConfigIndex() {
    const {showModal} = useModal();


    /**
     * Handle Discounts
     */
    const handleAddDiscountClick = () => {
        showModal('AdminAddDiscountModal1');
    }



    /**
     * Render
     */
    return(
        <div className="content1">
            <div className="text-l2 mar-bottom-2">Discounts</div>
            <div className="mar-start-1 mar-bottom-2">
                No Discounts
            </div>
            
            <div className="d-flex justify-content-end">
                <div className="primary-btn-dark-blue1 text-m3" onClick={handleAddDiscountClick}>Add Discount</div>
            </div>
            <div className="hr-line1-black3 mar-top-1 mar-bottom-1"></div>
        </div>
    );
}