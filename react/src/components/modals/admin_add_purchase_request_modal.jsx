import { Button, Input } from 'antd';
import { useState } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { useStateContext } from '../../Context/ContextProvider';
import axiosClient from '../../axios-client';
import { isEmptyOrSpaces, notify } from '../../assets/js/utils';
import { useNavigate } from 'react-router-dom';

export default function AdminAddPurchaseRequestModal({med, onClose}) {
    const {user} = useStateContext();
    const navigate = useNavigate();
    const [addPurchaseMed, setAddPurchaseMed] = useState({
        adminId: user.id,
        medId: med.id,
        medQty: 0,
        supplierName: "",
        supplierAddress: "",
        supplierContactNumber: "",
        supplierContactPerson: "",
    });

    const isSubmitDisabled = addPurchaseMed.medQty < 1 || isEmptyOrSpaces(addPurchaseMed.supplierName) || 
    isEmptyOrSpaces(addPurchaseMed.supplierAddress) || isEmptyOrSpaces(addPurchaseMed.supplierContactNumber) || 
    isEmptyOrSpaces(addPurchaseMed.supplierContactPerson);



    /**
     * Handlers
     */
    const handleInput = (e) => {
        setAddPurchaseMed(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleAddPurchaseRequestPost = () => {
        const formData = new FormData();
        formData.append("addPurchaseMed", JSON.stringify(addPurchaseMed));

        axiosClient.post("/add-purchase-request", formData)
        .then(({data}) => {
            if(data.status === 200) {
                onClose();
                navigate("/OrtegaAdmin/MedicineShortageExpiring/PurchaseRequests");
            }
            notify(data.status === 200 ? "success" : "error", data.message, "top-center", 3000);
        })
        .catch(error => {
            notify("error", "Server Error", "top-center", 3000);
            console.error(error);
        })
    }



    /**
     * Render
     */
    return(
        <div className="modal1">
            <div className="modal-box2">
                <div className="d-flex gap1 mar-bottom-1 align-items-center position-relative">
                    <div className="circle-btn1 text-l1 position-absolute" onClick={onClose}>
                        <Icon.X/>
                    </div>
                    <div className="text-l3 fw-bold text-center w-100">Add Purchase Request</div>
                </div>

                <div className="mar-bottom-1 d-flex gap3 align-items-center">
                    <div>
                        <label htmlFor="medName">Medicine Name</label>
                        <Input
                        size='large'
                        id='medName'
                        name='medName'
                        className='w-100'
                        value={med.name}
                        readOnly/>
                    </div>

                    <div>
                        <label htmlFor="medQty">Quantity</label>
                        <Input
                        size='large'
                        id='medQty'
                        name='medQty'
                        className='w-100'
                        value={addPurchaseMed.medQty}
                        onChange={(e) => !isNaN(e.target.value) ? handleInput(e) : null}/>
                    </div>
                </div>

                <h4 className='fw-bold mar-bottom-2'>Supplier Information</h4>
                <div className="mar-bottom-3 d-flex gap3 align-items-center">
                    <div>
                        <label htmlFor="supplierName">Supplier Name</label>
                        <Input
                        size='large'
                        id='supplierName'
                        name='supplierName'
                        className='w-100'
                        value={addPurchaseMed.supplierName}
                        onChange={handleInput}/>
                    </div>

                    <div>
                        <label htmlFor="supplierAddress">Address</label>
                        <Input
                        size='large'
                        id='supplierAddress'
                        name='supplierAddress'
                        className='w-100'
                        value={addPurchaseMed.supplierAddress}
                        onChange={handleInput}/>
                    </div>
                </div>

                <div className="mar-bottom-3 d-flex gap3 align-items-center">
                    <div>
                        <label htmlFor="supplierContactNumber">Contact Number</label>
                        <Input
                        size='large'
                        id='supplierContactNumber'
                        name='supplierContactNumber'
                        className='w-100'
                        value={addPurchaseMed.supplierContactNumber}
                        onChange={(e) => !isNaN(e.target.value) ? handleInput(e) : null}
                        maxLength={11}/>
                    </div>

                    <div>
                        <label htmlFor="supplierContactPerson">Contact Person</label>
                        <Input
                        size='large'
                        id='supplierContactPerson'
                        name='supplierContactPerson'
                        className='w-100'
                        value={addPurchaseMed.supplierContactPerson}
                        onChange={handleInput}/>
                    </div>
                </div>


                <Button
                size='large'
                className='mar-top-1'
                disabled={isSubmitDisabled}
                onClick={handleAddPurchaseRequestPost}>
                    Submit
                </Button>
            </div>
        </div>
    )
}