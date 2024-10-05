import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Icon from "react-bootstrap-icons";
import { fetchMedicineFullInfoById } from "../../../../Services/GeneralMedicineService";
import '../../../../assets/css/medicines.css';
import { useModal } from "../../../../Context/ModalContext";
import axiosClient from "../../../../axios-client";
import { isEmptyOrSpaces, notify } from "../../../../assets/js/utils";
import { EditMedInfo1 } from "../../../../components/admin/edit_med_info1";

export default function AdminViewMedicine() {
    const {showModal} = useModal();
    const {medId} = useParams();
    const navigate = useNavigate();


    const [medicine, setMedicine] = useState(null);
    const [newDirections, setNewDirections] = useState('');
    const [newDirectionsForCheck, setNewDirectionsForCheck] = useState('');
    const [newSideFx, setNewSideFx] = useState('');
    const [newSideFxForCheck, setNewSideFxForCheck] = useState('');
    const [newQty, setNewQty] = useState(0);

    const [isEditDirection, setEditDirection] = useState(false);
    const [isEditSideFx, setEditSideFx] = useState(false);
    const [isEditQty, setEditQty] = useState(false);



    useEffect(() => {
        const getMedicineInfo = async() => {
            try {
                const data = await fetchMedicineFullInfoById(medId);
                setMedicine(data);
                setNewQty(data.qty);
            } catch(error) {console.error(error)}
        }

        getMedicineInfo();
    }, []);


    /*
    | Debugging
    */
    useEffect(() => {
        console.log(medicine)
    }, [medicine]);


    const handleDelPost = (id) => {
        const formData = new FormData();
        formData.append('medId', id);

        axiosClient.post('/del-medicine', formData)
        .then(({data}) => {
            if(data.status === 200) {
                notify('success', data.message, 'top-center', 3000);
                navigate('/OrtegaAdmin/Medicines');
            } else {
                notify('success', data.message, 'top-center', 3000);
            }
        }).catch(error => console.error(error))
    }

    const handleDelBtn = () => {
        showModal('AdminDelMedConfirmationModal1', {medicine,handleDelPost})
    }

    const handleEditPost = (editType) => {
        const formData = new FormData();
        formData.append('medId', medicine.id);
        formData.append('editType', editType);

        switch(editType) {
            case 'directions':
                formData.append('directions', newDirections);
                break;
            case 'sidefx':
                formData.append('sideFx', newSideFx);
                break;
            case 'qty':
                formData.append('qty', newQty);
                break;
            default:
                notify('error', 'Invalid Edit Type', 'top-center', 3000);
                return;
        }

        axiosClient.post('/update-medicine', formData)
        .then(({data}) => {
            if(data.status === 200) {
                notify('success', data.message, 'top-center', 3000);
                setMedicine(data.medicine);

                setEditDirection(false);
                setEditSideFx(false);
                setEditQty(false);
            } else {
                notify('error', data.message, 'top-center', 3000);
            }
        }).catch(error => console.error(error));
        
    }
    
    if(medicine) {
        return(
            <div className="content1">
                <div className="d-flex justify-content-start">
                    <Link to={'/OrtegaAdmin/Medicines'} className="d-flex gap4 align-items-center color-black1"><Icon.ArrowLeft className="text-m1"/> Back</Link>
                </div>

                <div className="d-flex mar-bottom-l1 align-items-center justify-content-between">
                    <div className="text-l1 fw-bolder">{medicine.name}</div>
                </div>

                <div className="d-flex gap1 mar-bottom-1">

                    <div className="view-medicine-box1 w-50">
                        <div className="view-medicine-box1-head">
                            <div className="text-l3">Medicine</div>
                        </div>
                        <div className="hr-line1-black3"></div>
                        <div className="view-medicine-box1-body d-flex gapl1">
                            <div className="d-flex flex-direction-y w-50">
                                <div className="text-m1 fw-bold">{medicine.medicine_id}</div>
                                <div className="text-m3">Medicine ID</div>
                            </div>
                            <div className="d-flex flex-direction-y w-50">
                                <div className="text-m1 fw-bold">{medicine.group.group_name}</div>
                                <div className="text-m3">Medicine Goup</div>
                            </div>
                        </div>
                    </div>

                    <div className="view-medicine-box1 w-50">
                        <div className="view-medicine-box1-head d-flex align-items-center justify-content-between">
                            <div className="text-l3">Inventory</div>
                            <div 
                            className={`primary-btn-dark-blue1 d-flex gap3 align-items-center text-m2 ${isEditQty ? 'd-none' : ''}`}
                            onClick={() => setEditQty(true)}
                            >
                                <Icon.Pen/> Edit
                            </div>
                        </div>
                        <div className="hr-line1-black3"></div>
                        <div className="view-medicine-box1-body d-flex gapl1">
                            <div className="d-flex flex-direction-y w-50">
                                <div className={`text-m1 fw-bold ${isEditQty ? 'd-none' : ''}`}>{medicine.qty}</div>
                                <div className={`text-m3 ${isEditQty ? 'd-none' : ''}`}>Stocks</div>
                                <div className={`d-flex flex-direction-y gap3  ${isEditQty ? '' : 'd-none'}`}>
                                    <input 
                                    type="number" 
                                    className={`input1`} 
                                    min={0} 
                                    onChange={(e) => setNewQty(e.target.value)} 
                                    value={newQty}/>

                                    <div className={`d-flex gap3`}>
                                        <div className={`colorless-btn1`} onClick={() => setEditQty(false)}>Cancel</div>
                                        <button 
                                        disabled={newQty === '' && newQty === medicine.qty} 
                                        className={`primary-btn-dark-blue1 ${newQty !== '' && newQty !== medicine.qty ? '' : 'disabled'} `}
                                        onClick={() => handleEditPost('qty')}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>                                
                            </div>
                        </div>
                    </div>

                </div>

                {/* Directions */}
                <div className="d-flex mar-bottom-1">
                    <EditMedInfo1
                    title={"How to use"}
                    oldInfo={medicine.directions}
                    setNewInfo={setNewDirections}
                    setNewInfoChecking={setNewDirectionsForCheck}
                    saveBtnEnabledAt={!isEmptyOrSpaces(newDirectionsForCheck) && newDirections !== medicine.directions}
                    isEditInfo={isEditDirection}
                    setEditInfo={setEditDirection}
                    handleEditPost={() => handleEditPost('directions')}
                    />
                </div>

                {/* Side Effects */}
                <div className="d-flex mar-bottom-1">
                    <EditMedInfo1
                    title={"Side effects"}
                    oldInfo={medicine.side_effects}
                    setNewInfo={setNewSideFx}
                    setNewInfoChecking={setNewSideFxForCheck}
                    saveBtnEnabledAt={!isEmptyOrSpaces(newSideFxForCheck) && newSideFx !== medicine.side_effects}
                    isEditInfo={isEditSideFx}
                    setEditInfo={setEditSideFx}
                    handleEditPost={() => handleEditPost('sidefx')}
                    />
                </div>

                <div className="d-flex justify-content-start">
                    <div onClick={handleDelBtn} className="primary-btn-red1 text-m1 d-flex align-items-center gap3"><Icon.Trash/>Delete Medicine</div>
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