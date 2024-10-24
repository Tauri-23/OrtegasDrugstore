import AdminAddDiscountModal1 from "../components/modals/admin_add_discount_modal1";
import AdminAddMedGroupModal1 from "../components/modals/admin_add_med_group_modal1";
import AdminDelMedConfirmationModal1 from "../components/modals/admin_del_med_confirmation_modal1";
import AdminDelMedGroupConfirmationModal1 from "../components/modals/admin_del_med_group_confirmation_modal1";
import { useModal } from "../Context/ModalContext"

const ModalManager = () => {
    const {modalState, hideModal} = useModal();

    const renderModal = () => {
        switch(modalState.type) {
            /*
             * Inventory
             */
            case 'AdminAddMedGroupModal1':
                return <AdminAddMedGroupModal1 {...modalState.props} onClose={hideModal}/>;
            case 'AdminDelMedConfirmationModal1':
                    return <AdminDelMedConfirmationModal1 {...modalState.props} onClose={hideModal}/>;
            case 'AdminDelMedGroupConfirmationModal1':
                return <AdminDelMedGroupConfirmationModal1 {...modalState.props} onClose={hideModal}/>;



            /**
             * Configurations
             */
            case 'AdminAddDiscountModal1':
                return <AdminAddDiscountModal1 {...modalState.props} onClose={hideModal}/>;
            

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