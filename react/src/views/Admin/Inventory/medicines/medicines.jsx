import { useEffect, useState } from "react";
import * as Icon from "react-bootstrap-icons";
import { fetchAllMedicinesFull } from "../../../../Services/GeneralMedicineService";
import { Link, useNavigate } from "react-router-dom";
import { formatDate, formatToPhilPeso, isEmptyOrSpaces } from "../../../../assets/js/utils";
import { fetchAllMedGroups } from "../../../../Services/GeneralMedicineGroupService";
import { Space, Spin, Table, Tag } from 'antd';

export default function AdminMedicines() {
    const [medicines, setMedicines] = useState(null);
    const [filteredMedicines, setFilteredMedicines] = useState(null);

    const [groups, setGroups] = useState(null);
    
    const [searchValue, setSearchValue] = useState("");

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
                setFilteredMedicines(medicinesDb);
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
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title: 'Group Name',
            dataIndex: "group",
            render: (group) => group?.group_name || 'N/A',
            filters: groups ? [
                ...groups.map(group => 
                    ({text: group.group_name, value: group.id})
                )
            ] : [],
            onFilter: (value, record) => record.group.id === value,
        },
        {
            title: 'Type',
            dataIndex: "type",
            filters: [
                { text: 'Generic', value: 'Generic' },
                { text: 'Branded', value: 'Branded' }
            ],
            onFilter: (value, record) => record.type === value,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            render: (price) => formatToPhilPeso(price),
            sorter: (a, b) => parseFloat(a.price) - parseFloat(b.price)
        },
        {
            title: 'Stock in Qty',
            dataIndex: 'qty',
            sorter: (a, b) => a.qty - b.qty
        },
    ]



    /**
     * For Search
     */
    useEffect(() => {
        if(medicines === null || filteredMedicines === null) {
            return
        }

        if(isEmptyOrSpaces(searchValue)) {
            setFilteredMedicines(medicines);
            return
        }

        setFilteredMedicines(
            medicines.filter(med =>
                med.name.toLowerCase().includes(searchValue.toLowerCase())
            )
        );
    }, [searchValue]);
    



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
                
            </div>

            

            {(!medicines || !filteredMedicines)
            ? (<Spin size="large"/>)
            : (
                <Table
                columns={medicinesColumn}
                dataSource={filteredMedicines.map(item => ({...item, key: item.id}))}
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