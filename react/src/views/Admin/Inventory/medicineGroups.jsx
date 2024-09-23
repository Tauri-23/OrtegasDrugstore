import * as Icon from "react-bootstrap-icons";
import { useModal } from "../../../Context/ModalContext";
import { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import { notify } from "../../../assets/js/utils";
import { toast } from "react-toastify";

export default function AdminMedicineGroups() {
    const {showModal} = useModal();
    const [medicineGroups, setMedicineGroups] = useState([
        {
            id: "231542",
            group_name: "Generic Medicine",
            number_of_meds: 350
        },
        {
            id: "123123",
            group_name: "Diabetes",
            number_of_meds: 20
        }
    ]);


    /*
    | Debugging
    */
    useEffect(() => {
        notify("success", "data.message", "top-center", 3000);
    }, [])

    const handeAddPost = (medGroupName) => {

        const formData = new FormData();
        formData.append("name", medGroupName);

        axiosClient.post('/add-medicine-group-post', formData)
        .then(({data}) => {
            if(data.status === 200) {
                setMedicineGroups(prev => 
                    [...prev, 
                        {
                            id: data.id,
                            group_name: medGroupName,
                            number_of_meds: 0
                        }
                    ]
                );
                notify("success", data.message, "top-center", 3000);
            } else {
                notify("error", data.message, "top-center", 3000);
            }
        })
        
    }

    const handleAddMedGroup = () => {
        showModal('AdminAddMedGroupModal1', {handeAddPost});
    }

    return(
        <div className="content1">
            <div className="d-flex justify-content-between align-items-center mar-bottom-l1">
                <div>
                    <div className="text-l1 fw-bolder">Medicines</div>
                    <div className="text-m1">List of medicines available for sales.</div>
                </div>
                
                <button onClick={handleAddMedGroup} className="primary-btn-dark-blue1 d-flex gap3 align-items-center"><Icon.PlusLg className="text-l3"/> Add New Group</button>
            </div>

            <div className="d-flex justify-content-between mar-bottom-1">
                <div className="d-flex position-relative align-items-center">
                    <input type="text" className="search-box1 text-m1" placeholder="Search Medicine Groups.."/>
                    <div className="search-box1-icon"><Icon.Search className="text-l3"/></div>
                </div>                
            </div>

            <table className="table1">
                <thead className="table1-thead">
                    <tr>
                        <th>Group Name</th>
                        <th>No. of Medicines</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className="table1-tbody">
                    {medicineGroups.map((meds, index) => (
                        <tr key={index}>
                            <td>{meds.group_name}</td>
                            <td>{meds.number_of_meds}</td>
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
                </tbody>
            </table>
        </div>
    );
}