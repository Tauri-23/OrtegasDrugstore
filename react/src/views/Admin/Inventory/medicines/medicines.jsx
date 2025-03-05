import { useEffect, useState } from "react";
import * as Icon from "react-bootstrap-icons";
import { fetchAllMedicinesFull } from "../../../../Services/GeneralMedicineService";
import { Link, useNavigate } from "react-router-dom";
import { formatDate, formatToPhilPeso, isEmptyOrSpaces } from "../../../../assets/js/utils";
import { fetchAllMedGroups } from "../../../../Services/GeneralMedicineGroupService";
import { Space, Spin, Table, Tag } from 'antd';

export default function AdminMedicines() {
    const [medicines, setMedicines] = useState(null);
    const [medicineTemp, setMedicineTemp] = useState([]);

    const [groups, setGroups] = useState(null);
    
    const [searchValue, setSearchValue] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("");

    const navigate = useNavigate();



    /**
     * Onmount
     */
    useEffect(() => {
        const getAllMedicines = async() => {
            try {
                const [medicinesDb, groupsDb] = await Promise.all([
                    fetchAllMedicinesFull(),
                    fetchAllMedGroups()
                ]);
                setMedicines(medicinesDb);
                setGroups(groupsDb);
            } catch(error) {console.error(error)}
        };

        getAllMedicines();
    }, []);



    /**
     * Setup Column
     */
    const medicinesColumn = [
        {
            title: 'Medicine Name',
            dataIndex: 'name',
            key: 'id',
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title: 'Group Name',
            dataIndex: 'group',
            key: 'group_name',
            render: (group) => group?.group_name || 'N/A',
            sorter: (a, b) => (a.group?.group_name || '').localeCompare(b.group?.group_name || '')
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => formatToPhilPeso(price),
            sorter: (a, b) => parseFloat(a.price) - parseFloat(b.price)
        },
        {
            title: 'Stock in Qty',
            dataIndex: 'qty',
            key: 'qty',
            sorter: (a, b) => a.qty - b.qty
        },
    ]



    /**
     * For Search
     */
    useEffect(() => {

        if(medicines == null && medicineTemp.length < 1) {
            return
        }
    
        if (!isEmptyOrSpaces(searchValue)) {
            if (medicineTemp.length === 0) {
                // Save the original list and filter medicines
                setMedicineTemp(medicines);
                setMedicines(
                    medicines.filter(med =>
                        med.name.toLowerCase().includes(searchValue.toLowerCase()) &&
                        (isEmptyOrSpaces(selectedGroup) ? true : String(med.group.id) == selectedGroup)
                    )
                );
            } else {
                // Use the temporary storage for filtering
                setMedicines(
                    medicineTemp.filter(med =>
                        med.name.toLowerCase().includes(searchValue.toLowerCase()) &&
                        (isEmptyOrSpaces(selectedGroup) ? true : String(med.group.id) == selectedGroup)
                    )
                );
            }
        } else {
            if(!isEmptyOrSpaces(selectedGroup)) {
                setMedicines(medicineTemp.filter(med => String(med.group.id) == selectedGroup));
            }
            else {
                setMedicines(medicineTemp);
                setMedicineTemp([]);
            }            
        }
    }, [searchValue]);

    useEffect(() => {
        if(medicines == null && medicineTemp.length < 1) {
            return
        }
    
        if (!isEmptyOrSpaces(selectedGroup)) {
            if (medicineTemp.length === 0) {
                // Save the original list and filter medicines
                setMedicineTemp(medicines);
                setMedicines(
                    medicines.filter(med =>
                        String(med.group.id) == selectedGroup && 
                        (isEmptyOrSpaces(searchValue) ? true : med.name.toLowerCase().includes(searchValue.toLowerCase()))
                    )
                );
            } else {
                // Use the temporary storage for filtering
                setMedicines(
                    medicineTemp.filter(med =>
                        String(med.group.id) == selectedGroup && 
                        (isEmptyOrSpaces(searchValue) ? true : med.name.toLowerCase().includes(searchValue.toLowerCase()))
                    )
                );
            }
        } else {
            if(!isEmptyOrSpaces(searchValue)) {
                setMedicines(medicineTemp.filter(med => med.name.toLowerCase().includes(searchValue.toLowerCase())));
            }
            else {
                setMedicines(medicineTemp);
                setMedicineTemp([]);
            }  
        }
    }, [selectedGroup]);
    



    /**
     * Render
     */
    return(
        <div className="content1">
            <div className="d-flex justify-content-between align-items-center mar-bottom-l1">
                <div>
                    <div className="text-l1 fw-bolder">Inventory Items</div>
                    <div className="text-m1">List of items available for sales.</div>
                </div>
                
                <Link to={'/OrtegaAdmin/AddMedicine'} className="primary-btn-dark-blue1 d-flex gap3 align-items-center"><Icon.PlusLg className="text-l3"/> Add Medicine</Link>
            </div>

            <div className="d-flex justify-content-between mar-bottom-1">
                <div className="d-flex position-relative align-items-center">
                    <input 
                    type="text" 
                    className="search-box1 text-m1" 
                    placeholder="Search Medicine Inventory.."
                    onInput={(e) => setSearchValue(e.target.value)}
                    value={searchValue}/>

                    <div className="search-box1-icon"><Icon.Search className="text-l3"/></div>
                </div>

                <select 
                className="input1"
                onChange={(e) => setSelectedGroup(e.target.value)}
                value={selectedGroup}>
                    <option value="">- Select Group -</option>
                    {groups?.map(group => (
                        <option key={group.id} value={String(group.id)}>{group.group_name}</option>
                    ))}
                </select>
                
            </div>

            
            {/* <table className="table1">
                <thead className="table1-thead">
                    <tr>
                        <th>Medicine Name</th>
                        <th>Group Name</th>
                        <th>Price</th>
                        <th>Stock in Qty</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className="table1-tbody">
                    {medicines?.length > 0 && medicines.map((meds, index) => (
                        <tr key={index} >
                            <td>{meds.name}</td>
                            <td>{meds.group.group_name}</td>
                            <td>{formatToPhilPeso(meds.price)}</td>
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
            </table> */}

            

            {!medicines
            ? (<Spin size="large"/>)
            : (
                <Table
                columns={medicinesColumn}
                dataSource={medicines}
                pagination={{pageSize: 10}}
                onRow={(record) => ({
                    onDoubleClick: () => navigate(`/OrtegaAdmin/ViewMedicines/${record.id}`)
                })}
                bordered
                />
            )}
        </div>
    );
}