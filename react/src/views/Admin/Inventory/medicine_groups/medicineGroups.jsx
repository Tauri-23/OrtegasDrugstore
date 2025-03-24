import * as Icon from "react-bootstrap-icons";
import { useModal } from "../../../../Context/ModalContext";
import { useEffect, useState } from "react";
import axiosClient from "../../../../axios-client";
import { isEmptyOrSpaces, notify } from "../../../../assets/js/utils";
import { fetchAllMedGroups } from "../../../../Services/GeneralMedicineGroupService";
import { useNavigate } from "react-router-dom";
import { Spin, Table } from "antd";
import { useStateContext } from "../../../../Context/ContextProvider";

export default function AdminMedicineGroups() {
    const {user} = useStateContext();
    const {showModal} = useModal();
    const navigate = useNavigate();
    const [medicineGroups, setMedicineGroups] = useState(null);
    const [groupTemp, setGroupTemp] = useState([]);

    const [searchValue, setSearchValue] = useState("");



    /**
     * Onmount
     */
    useEffect(() => {
        const GetAllMedGroups = async() => {
            try {
                const data = await fetchAllMedGroups();
                setMedicineGroups(data);
            } catch (error) {console.error(error)}
        }

        GetAllMedGroups();
    }, []);



    /**
     * Setup Column
     */
    const medGroupsColumns = [
        {
            title: 'Group Name',
            dataIndex: 'group_name',
            key: 'id',
            sorter: (a, b) => a.group_name.localeCompare(b.group_name)
        },
        {
            title: 'No. of Medicines',
            dataIndex: 'total_qty',
            key: 'id',
            sorter: (a, b) => a.total_qty - b.total_qty
        },
    ]



    /**
     * For Add Medicine Group
     */
    const handeAddPost = (medGroupName) => {

        const formData = new FormData();
        formData.append("name", medGroupName);
        formData.append("admin", user.id);

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



    /**
     * For Search
     */
    useEffect(() => {
        if(medicineGroups == null && groupTemp.length < 1) {
            return
        }
    
        if (!isEmptyOrSpaces(searchValue)) {
            if (groupTemp.length === 0) {
                // Save the original list and filter medicines
                setGroupTemp(medicineGroups);
                setMedicineGroups(
                    medicineGroups.filter(group =>
                        group.group_name.toLowerCase().includes(searchValue.toLowerCase())
                    )
                );
            } else {
                // Use the temporary storage for filtering
                setMedicineGroups(
                    groupTemp.filter(group =>
                        group.group_name.toLowerCase().includes(searchValue.toLowerCase())
                    )
                );
            }
        } else {
            setMedicineGroups(groupTemp);
            setGroupTemp([]);           
        }
    }, [searchValue]);


    /**
     * Render
     */
    return(
        <div className="content1">
            <div className="d-flex justify-content-between align-items-center mar-bottom-l1">
                <div>
                    <div className="text-l1 fw-bolder">Inventory Groups</div>
                    <div className="text-m1">List of groups available for sales.</div>
                </div>
                
                <button onClick={handleAddMedGroup} className="primary-btn-dark-blue1 d-flex gap3 align-items-center"><Icon.PlusLg className="text-l3"/> Add New Group</button>
            </div>

            <div className="d-flex justify-content-between mar-bottom-1">
                <div className="d-flex position-relative align-items-center">
                    <input 
                    type="text" 
                    className="search-box1 text-m1" 
                    placeholder="Search Medicine Groups.."
                    onInput={(e) => setSearchValue(e.target.value)}
                    value={searchValue}/>
                    <div className="search-box1-icon"><Icon.Search className="text-l3"/></div>
                </div>                
            </div>

            {/* <table className="table1">
                <thead className="table1-thead">
                    <tr>
                        <th>Group Name</th>
                        <th>No. of Medicines</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className="table1-tbody">
                    {medicineGroups?.length > 0 && medicineGroups.map((meds, index) => (
                        <tr key={index} onClick={() => navigate(`/OrtegaAdmin/ViewMedicineGroup/${meds.id}`)}>
                            <td>{meds.group_name}</td>
                            <td>{meds.total_qty}</td>
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

                    {!medicineGroups && (
                        <tr>
                            <td>
                                <div className="text-l3">Loading</div>
                            </td>
                        </tr>
                    )}

                    {medicineGroups?.length < 1 && (
                        <tr>
                            <td><div className="text-l3">No Data</div></td>
                        </tr>
                    )}
                </tbody>
            </table> */}
            {/* Table */}
            {!medicineGroups
            ? (<Spin size="large"/>)
            : (
                <Table
                columns={medGroupsColumns}
                dataSource={medicineGroups}
                pagination={{pageSize: 10}}
                bordered
                />
            )}
        </div>
    );
}