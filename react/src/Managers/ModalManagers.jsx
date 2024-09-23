import AdminAddMedGroupModal1 from "../components/modals/admin_add_med_group_modal1";
import { useModal } from "../Context/ModalContext"

const ModalManager = () => {
    const {modalState, hideModal} = useModal();

    const renderModal = () => {
        switch(modalState.type) {
            /*
            |   ADMIN
            */
            // Inventory
            case 'AdminAddMedGroupModal1':
                return <AdminAddMedGroupModal1 {...modalState.props} onClose={hideModal}/>;
            

            /*
            |   ADMIN
            */
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