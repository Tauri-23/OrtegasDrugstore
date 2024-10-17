import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Icon from "react-bootstrap-icons";
import '../../../../assets/css/medicines.css';
import { useModal } from "../../../../Context/ModalContext";
import { fetchMedGroupById } from "../../../../Services/GeneralMedicineGroupService";
import { fetchMedicinesWhereGroup } from "../../../../Services/GeneralMedicineService";
import { notify } from "../../../../assets/js/utils";
import axiosClient from "../../../../axios-client";

export default function AdminViewMedicineGroup() {
    const {showModal} = useModal();
    const {medGpId} = useParams();
    const navigate = useNavigate();


    const [medGroup, setMedGroup] = useState(null);
    const [medicines, setMedicineGroups] = useState(null);



    /**
     * Get all necessary data
     */
    useEffect(() => {
        const getAll = async() => {
            try {
                const [groupDb, medicinesDb] = await Promise.all([
                    fetchMedGroupById(medGpId),
                    fetchMedicinesWhereGroup(medGpId)
                ]);
                setMedGroup(groupDb);
                setMedicineGroups(medicinesDb);
            } catch(error) {console.error(error)}
        }
        getAll();
    }, []);



    /**
     * Handle Delete Click
     */
    const handleDeleteClick = () => {
        if(medicines.length > 0)
        {
            return;
        }
        showModal('AdminDelMedGroupConfirmationModal1', {medicineGroup: medGroup, handleDelPost});
    }

    const handleDelPost = () => {
        const formData = new FormData();
        formData.append('groupId', medGroup.id);

        axiosClient.post('/delete-medicine-group', formData)
        .then(({data}) => {
            if(data.status === 200) {
                navigate('/OrtegaAdmin/MedicineGroups');
            }
            notify(data.status === 200 ? 'success' : 'error', data.message, 'top-center', 3000);
        }).catch(error => console.error(error));
    }


    
    /**
     * Render
     */
    if(medGroup) {
        return(
            <div className="content1">
                <div className="d-flex justify-content-start mar-bottom-3">
                    <Link to={'/OrtegaAdmin/Medicines'} className="d-flex gap4 align-items-center color-black1"><Icon.ArrowLeft className="text-m1"/> Back</Link>
                </div>

                <div className="d-flex mar-bottom-l1 align-items-center justify-content-between">
                    <div className="text-l1 fw-bolder">{medGroup.group_name}</div>
                    <Link to={'/OrtegaAdmin/AddMedicine'} className="primary-btn-dark-blue1 d-flex gap3 align-items-center"><Icon.PlusLg className="text-l3"/> Add Medicine</Link>
                </div>



                {/* Table */}
                <table className="table1 mar-bottom-l1">
                    <thead className="table1-thead">
                        <tr>
                            <th>Medicine Name</th>
                            <th>Medicine ID</th>
                            <th>Stock in Qty</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="table1-tbody">
                        {medicines?.length > 0 && medicines.map((meds, index) => (
                            <tr key={index} onClick={() => navigate(`/OrtegaAdmin/ViewMedicines/${meds.id}`)}>
                                <td>{meds.name}</td>
                                <td>{meds.medicine_id}</td>
                                <td>{meds.qty}</td>
                                <td>
                                    <div className="d-flex gap1 align-items-center">
                                        <div className="text-m2">
                                            View Full Details
                                        </div>
                                        <Icon.ChevronDoubleRight/>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {!medicines && (
                            <tr>
                                <td>
                                    <div className="text-l3">Loading</div>
                                </td>
                            </tr>
                        )}

                        {medicines?.length < 1 && (
                            <tr>
                                <td><div className="text-l3">No Data</div></td>
                            </tr>
                        )}
                    </tbody>
                </table>



                {/* Action Btns */}
                <div className="d-flex justify-content-start">
                    <button 
                    disabled={medicines.length > 0}
                    className={`primary-btn-dark-blue1 d-flex gap3 align-items-center ${medicines.length > 0 ? 'disabled' : ''}`}
                    onClick={handleDeleteClick}
                    >
                        <Icon.Trash/> Delete Group
                    </button>
                </div>
            </div>
        )
    }
    else {
        return(
            <div className="content1">
                Loading...
            </div>
        );
    }
}