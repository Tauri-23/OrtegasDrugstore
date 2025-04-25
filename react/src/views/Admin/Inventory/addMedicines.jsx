import { useEffect, useState } from "react";
import { fetchAllMedGroups } from "../../../Services/GeneralMedicineGroupService";
import { isEmptyOrSpaces, notify } from "../../../assets/js/utils";
import axiosClient from "../../../axios-client";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../../Context/ContextProvider";
import {Button, Input, InputNumber, Radio, Select} from "antd";

export default function AdminAddMedicines() {
    const {user} = useStateContext();
    const navigate = useNavigate();

    const [medicineGroups, setMedicineGroups] = useState(null);

    const [medicine, setMedicine] = useState({
        medName: "",
        medGroup: "",
        medType: "",
        medPrice: 0,
        medCostPrice: 0,
        presNeeded: 0,
        discountable: 1
    })



    /**
     * Onmount
     */
    useEffect(() => {
        const getAllMedicineGroups = async() => {
            try {
                const data = await fetchAllMedGroups();
                setMedicineGroups(data);
            } catch(error) {console.error(error)}
        }

        getAllMedicineGroups();
    }, [])

    /**
     * Checkers
     */
    const isBtnDisabled = () => {
        return isEmptyOrSpaces(medicine.medName) || medicine.medPrice == "" || 
        medicine.medGroup == "" || medicine.medType == "" || medicine.medCostPrice == "";
    }

    /**
     * Handlers
     */
    const handleAddMedicinePost = () => {
        const formData = new FormData();
        formData.append("medicine", JSON.stringify(medicine));
        formData.append("admin", user.id);

        axiosClient.post('/create-medicine', formData)
        .then(({data}) => {
            if(data.status === 200) {
                notify("success", data.message, "top-center", 3000);
                navigate('/OrtegaAdmin/Medicines');
            } else {
                notify("error", data.message, "top-center", 3000);
            }
        }).catch(error => console.error(error));
    }

    const handleInput = (e) => {
        setMedicine({...medicine, [e.target.name]: e.target.value});
    }



    /**
     * Render
     */
    return(
        <div className="content1">
            {medicineGroups
                ? (
                    <div style={{width: "70%"}}>
                        <div className="mar-bottom-l1">
                            <div className="text-l1 fw-bolder">Add Medicine</div>
                            <div className="text-m1">*All fields are mandatory, except mentioned as (optional).</div>
                        </div>


                        <div className="d-flex gap1 mar-bottom-2">
                            <div className="d-flex flex-direction-y w-100 gap4">
                                <label htmlFor="medName" className="text-m1">Medicine Name</label>
                                <Input
                                size="large"
                                id="medName" 
                                name="medName"
                                onInput={handleInput}
                                value={medicine.medName} 
                                />
                            </div>
                        </div>

                        <div className="d-flex gap1 mar-bottom-2">
                            <div className="d-flex flex-direction-y w-100 gap4">
                                <label htmlFor="medCostPrice" className="text-m1">Cost Price</label>
                                <Input
                                size="large"
                                id="medCostPrice"
                                name="medCostPrice"
                                style={{ width: "100%" }}
                                value={medicine.medCostPrice}
                                onChange={(e) => !isNaN(e.target.value) ? handleInput(e): null}
                                />
                            </div>

                            <div className="d-flex flex-direction-y w-100 gap4">
                                <label htmlFor="medPrice" className="text-m1">Selling Price</label>
                                <Input
                                size="large"
                                id="medPrice"
                                name="medPrice"
                                style={{ width: "100%" }}
                                value={medicine.medPrice}
                                onChange={(e) => !isNaN(e.target.value) ? handleInput(e): null}
                                />
                            </div>
                        </div>


                        <div className="d-flex gap1 mar-bottom-2">
                            <div className="d-flex flex-direction-y w-100 gap4">
                                <label htmlFor="medType" className="text-m1">Type</label>
                                <Select
                                size="large"
                                name="medType"
                                id="medType"
                                onChange={(value) => handleInput({ target: { name: "medType", value } })} 
                                value={medicine.medType}
                                options={[
                                    {label: "Select Medicine Type", value: ""},
                                    {label: "Generic", value: "Generic"},
                                    {label: "Branded", value: "Branded"}
                                ]}
                                />
                            </div>

                            <div className="d-flex flex-direction-y w-100 gap4">
                                <label htmlFor="medGroup" className="text-m1">Medicine Group</label>
                                <Select
                                size="large"
                                name="medGroup"
                                id="medGroup"
                                onChange={(value) => handleInput({ target: { name: "medGroup", value } })} 
                                value={medicine.medGroup}
                                options={[
                                    {label: "Select Medicine Group", value: ""},
                                    ...medicineGroups.map(medGp => (
                                        {label: medGp.group_name, value: medGp.id}
                                    ))
                                ]}
                                />
                            </div>
                        </div>

                        <div className="d-flex gap1 mar-bottom-2">
                            <div>
                                <label htmlFor="presNeeded" className="text-m1 w-100">Prescription Needed</label>
                                <Radio.Group
                                name="presNeeded"
                                value={medicine.presNeeded}
                                options={[
                                    { value: 1, label: "Yes" },
                                    { value: 0, label: "No"},
                                ]}
                                onChange={handleInput}
                                />
                            </div>

                            <div>
                                <label htmlFor="discountable" className="text-m1 w-100">Discountable</label>
                                <Radio.Group
                                name="discountable"
                                value={medicine.discountable}
                                options={[
                                    { value: 1, label: "Yes" },
                                    { value: 0, label: "No"},
                                ]}
                                onChange={handleInput}
                                />
                            </div>
                        </div>

                        
                        <div className="d-flex">
                            <Button
                            type="primary"
                            disabled={isBtnDisabled()}
                            size="large"
                            onClick={handleAddMedicinePost}
                            >Add Medicine</Button>
                        </div>
                    </div>
                )
                : (
                    <div className="text-l3 text-center">
                        Loading
                    </div>
                )
            }            
        </div>
    );
}