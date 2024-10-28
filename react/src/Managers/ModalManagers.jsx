import AdminAddCustomerInfoModal1 from "../components/modals/admin_add_customer_info_modal1";
import AdminAddDiscountModal1 from "../components/modals/admin_add_discount_modal1";
import AdminAddMedGroupModal1 from "../components/modals/admin_add_med_group_modal1";
import AdminApplyDiscountModal1 from "../components/modals/admin_apply_discount_modal1";
import AdminDelMedConfirmationModal1 from "../components/modals/admin_del_med_confirmation_modal1";
import AdminDelMedGroupConfirmationModal1 from "../components/modals/admin_del_med_group_confirmation_modal1";
import AdminEditMedPicPreviewModal1 from "../components/modals/admin_edit_med_pic_preview_modal1";
import AdminPayCashModal1 from "../components/modals/admin_pay_cash_modal1";
import AdminViewReceiptModal1 from "../components/modals/admin_view_receipt_modal1";
import GeneralConfirmationModal1 from "../components/modals/general_confirmation_modal1";
import { useModal } from "../Context/ModalContext"

const ModalManager = () => {
    const {modalState, hideModal} = useModal();

    const renderModal = () => {
        switch(modalState.type) {
            /**
             * Inventory
             */
            case 'AdminAddMedGroupModal1':
                return <AdminAddMedGroupModal1 {...modalState.props} onClose={hideModal}/>;
            case 'AdminDelMedConfirmationModal1':
                    return <AdminDelMedConfirmationModal1 {...modalState.props} onClose={hideModal}/>;
            case 'AdminDelMedGroupConfirmationModal1':
                return <AdminDelMedGroupConfirmationModal1 {...modalState.props} onClose={hideModal}/>;
            case 'AdminEditMedPicPreviewModal1':
                return <AdminEditMedPicPreviewModal1 {...modalState.props} onClose={hideModal}/>;
            


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
                


            /**
             * Configurations
             */
            case 'AdminAddDiscountModal1':
                return <AdminAddDiscountModal1 {...modalState.props} onClose={hideModal}/>;



            /**
             * General
             */
            case 'GeneralConfirmationModal1':
                return <GeneralConfirmationModal1 {...modalState.props} onClose={hideModal}/>;
            

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