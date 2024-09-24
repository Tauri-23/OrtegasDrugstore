import { useEffect, useState } from "react";
import { fetchAllMedGroups } from "../../../Services/GeneralMedicineGroupService";
import { isEmptyOrSpaces, notify } from "../../../assets/js/utils";
import axiosClient from "../../../axios-client";
import { useNavigate } from "react-router-dom";

export default function AdminAddMedicines() {
    const navigate = useNavigate();

    const [medicineGroups, setMedicineGroups] = useState(null);

    const [medName, setMedName] = useState("");
    const [medId, setMedId] = useState("");
    const [medGp, setMedGp] = useState("");
    const [medQty, setMedQty] = useState(0);
    const [medDirection, setMedDirection] = useState("");
    const [medSideFx, setMedSideFx] = useState("");

    const [addBtnActive, setAddBtnActive] = useState(false);

    useEffect(() => {
        const getAllMedicineGroups = async() => {
            try {
                const data = await fetchAllMedGroups();
                setMedicineGroups(data);
            } catch(error) {console.error(error)}
        }

        getAllMedicineGroups();
    }, [])

    // Enable or disable the add Btn
    useEffect(() => {
        if(!isEmptyOrSpaces(medName) && !isEmptyOrSpaces(medId) && medGp !== ""
            && !isEmptyOrSpaces(medDirection) && !isEmptyOrSpaces(medSideFx)) {
            setAddBtnActive(true);
        } else {
            setAddBtnActive(false);
        }
    }, [
        medName,
        medId,
        medGp,
        medQty,
        medDirection,
        medSideFx
    ]);


    const handleAddMedicinePost = () => {
        console.log("Adding");
        
        const formData = new FormData();
        formData.append("medName", medName);
        formData.append("medId", medId);
        formData.append("medGp", medGp);
        formData.append("medQty", medQty);
        formData.append("medDirection", medDirection);
        formData.append("medSideFx", medSideFx);

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
                                <input type="text" onInput={(e) => setMedName(e.target.value)} id="medName" className="input1" value={medName} />
                            </div>

                            <div className="d-flex flex-direction-y w-100 gap4">
                                <label htmlFor="medId" className="text-m1">Medicine ID</label>
                                <input type="text" onInput={(e) => setMedId(e.target.value)} id="medId" className="input1" value={medId} />
                            </div>
                        </div>


                        <div className="d-flex gap1 mar-bottom-2">
                            <div className="d-flex flex-direction-y w-100 gap4">
                                <label htmlFor="medGroup" className="text-m1">Medicine Group</label>
                                <select name="medGroup" className="input1" onChange={(e) => setMedGp(e.target.value)} value={medGp}>
                                    <option value="">Select Medicine Group</option>
                                    {medicineGroups.map(medGp => (
                                        <option key={medGp.id} value={medGp.id}>{medGp.group_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="d-flex flex-direction-y w-100 gap4">
                                <label htmlFor="qty" className="text-m1">Quantity in Number</label>
                                <input type="number" min={0} id="qty" className="input1" onChange={(e) => setMedQty(e.target.value)} value={medQty}/>
                            </div>
                        </div>


                        <div className="d-flex flex-direction-y w-100 gap4 mar-bottom-2">
                            <label htmlFor="medGroup" className="text-m1">How to use</label>
                            <div className="input1 overflow-auto" style={{height: "150px"}} contentEditable suppressContentEditableWarning onInput={(e) => setMedDirection(e.target.innerText)}>
                                
                            </div>
                        </div>


                        <div className="d-flex flex-direction-y w-100 gap4 mar-bottom-2">
                            <label htmlFor="medGroup" className="text-m1">Side Effects</label>
                            <div className="input1 overflow-auto" style={{height: "150px"}} contentEditable suppressContentEditableWarning onInput={(e) => setMedSideFx(e.target.innerText)}>
                                
                            </div>
                        </div>

                        
                        <div className="d-flex">
                            <button disabled={!addBtnActive} className={`primary-btn-dark-blue1 ${addBtnActive ? '' : 'disabled'}`} onClick={handleAddMedicinePost}>Add Medicine</button>
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