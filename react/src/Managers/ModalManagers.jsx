import AdminAddCustomerInfoModal1 from "../components/modals/admin_add_customer_info_modal1";
import AdminAddDiscountModal1 from "../components/modals/admin_add_discount_modal1";
import AdminAddMedGroupModal1 from "../components/modals/admin_add_med_group_modal1";
import AdminAddMedItemModal1 from "../components/modals/admin_add_med_item_moda1";
import AdminAddPurchaseRequestModal from "../components/modals/admin_add_purchase_request_modal";
import AdminApplyDiscountModal1 from "../components/modals/admin_apply_discount_modal1";
import AdminDelMedConfirmationModal1 from "../components/modals/admin_del_med_confirmation_modal1";
import AdminDelMedGroupConfirmationModal1 from "../components/modals/admin_del_med_group_confirmation_modal1";
import AdminEditDiscountModal1 from "../components/modals/admin_edit_discount_modal1";
import AdminEditMedPicPreviewModal1 from "../components/modals/admin_edit_med_pic_preview_modal1";
import AdminMedShortageModal1 from "../components/modals/admin_med_shortage_modal1";
import AdminPayCashModal1 from "../components/modals/admin_pay_cash_modal1";
import AdminViewPurchaseRequestModal from "../components/modals/admin_view_purchase_request_modal";
import AdminViewReceiptModal1 from "../components/modals/admin_view_receipt_modal1";
import CashierCheckountItemsPreviewodal from "../components/modals/cashier_checkout_items_preview_modal";
import GeneralConfirmationModal1 from "../components/modals/general_confirmation_modal1";
import GeneralInformationModal1 from "../components/modals/general_information_modal1";
import ReturnItemsModal from "../components/modals/return_items_modal";
import { useModal } from "../Context/ModalContext"

const ModalManager = () => {
    const {modalState, hideModal} = useModal();

    const renderModal = () => {
        switch(modalState.type) {
            /**
             * Dashboard
             */
            case 'AdminMedShortageModal1':
                return <AdminMedShortageModal1 {...modalState.props} onClose={hideModal}/>;





            /**
             * Inventory
             */
            case 'AdminAddMedGroupModal1':
                return <AdminAddMedGroupModal1 {...modalState.props} onClose={hideModal}/>;
            case 'AdminAddMedItemModal1':
                return <AdminAddMedItemModal1 {...modalState.props} onClose={hideModal}/>;
            case 'AdminDelMedConfirmationModal1':
                    return <AdminDelMedConfirmationModal1 {...modalState.props} onClose={hideModal}/>;
            case 'AdminDelMedGroupConfirmationModal1':
                return <AdminDelMedGroupConfirmationModal1 {...modalState.props} onClose={hideModal}/>;
            case 'AdminEditMedPicPreviewModal1':
                return <AdminEditMedPicPreviewModal1 {...modalState.props} onClose={hideModal}/>;





            /**
             * Medicine Shortage
             */
            case 'AdminAddPurchaseRequestModal':
                return <AdminAddPurchaseRequestModal {...modalState.props} onClose={hideModal}/>;
            case 'AdminViewPurchaseRequestModal':
                return <AdminViewPurchaseRequestModal {...modalState.props} onClose={hideModal}/>;
            


                
            /**
             * POS
             */
            case 'AdminApplyDiscountModal1':
                return <AdminApplyDiscountModal1 {...modalState.props} onClose={hideModal}/>;
            case 'AdminAddCustomerInfoModal1':
                return <AdminAddCustomerInfoModal1 {...modalState.props} onClose={hideModal}/>;
            case 'AdminViewReceiptModal1':
                return <AdminViewReceiptModal1 {...modalState.props} onClose={hideModal}/>;
            case 'AdminPayCashModal1':
                return <AdminPayCashModal1 {...modalState.props} onClose={hideModal}/>;
            case 'CashierCheckountItemsPreviewodal':
                return <CashierCheckountItemsPreviewodal {...modalState.props} onClose={hideModal}/>;


            /**
             * Return Items
             */
            case "ReturnItemsModal":
                return <ReturnItemsModal {...modalState.props} onClose={hideModal}/>;
                


            /**
             * Configurations
             */
            case 'AdminAddDiscountModal1':
                return <AdminAddDiscountModal1 {...modalState.props} onClose={hideModal}/>;
            case 'AdminEditDiscountModal1':
                return <AdminEditDiscountModal1 {...modalState.props} onClose={hideModal}/>;



            /**
             * General
             */
            case 'GeneralConfirmationModal1':
                return <GeneralConfirmationModal1 {...modalState.props} onClose={hideModal}/>;
            case 'GeneralInformationModal1':
                return <GeneralInformationModal1 {...modalState.props} onClose={hideModal}/>;
            

            default:
                return null;

        }
    };

    return(
        <>
            {renderModal()}
        </>
    )
}

export default ModalManager;