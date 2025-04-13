import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { formatToPhilPeso } from "../../../assets/js/utils";
import { fetchAllMedicineShortage } from "../../../Services/DashboardService";
import { Badge, Spin, Table } from "antd";
import { fetchAllMedGroups } from "../../../Services/GeneralMedicineGroupService";

export default function AdminViewShortage() {
    const { setPage } = useOutletContext();
    const [medicines, setMedicines] = useState(null);
    const [filteredMedicines, setFilteredMedicines] = useState(null);

    const [groups, setGroups] = useState(null);

    const navigate = useNavigate();



    /**
     * Onmount
     */
    useEffect(() => {
        setPage("Shortage");
        
        const getAllMedicines = async() => {
            try {
                const [medsDb, groupsDb] = await Promise.all([
                    fetchAllMedicineShortage(),
                    fetchAllMedGroups()
                ])
                setMedicines(medsDb);
                setFilteredMedicines(medsDb);
                setGroups(groupsDb);
            } catch(error) {console.error(error)}
        };

        getAllMedicines();
    }, []);



    /**
     * Setup Columns
     */
    const medicineColumns = [
        {
            title: "Medicine Name",
            dataIndex: "name"
        },
        {
            title: "Group",
            render: (_, row) => row.group.group_name || "N/A",
            filters: groups ? [
                ...groups.map(group => 
                    ({text: group.group_name, value: group.id})
                )
            ] : [],
            onFilter: (value, record) => record.group.id === value,
        },
        {
            title: "Type",
            render: (_, row) => row.type || "N/A",
            filters: [
                { text: 'Generic', value: 'Generic' },
                { text: 'Branded', value: 'Branded' }
            ],
            onFilter: (value, record) => record.type === value,
        },
        {
            title: "Price",
            render: (_, row) => formatToPhilPeso(row.price),
            sorter: (a, b) => parseFloat(a.price) - parseFloat(b.price)
        },
        {
            title: "Stock",
            dataIndex: "qty",
            sorter: (a, b) => a.qty - b.qty
        },
        {
            title: "Stock Status",
            render: (_, row) => {
                const statusMap = {
                  "Re-Order": { color: "gold", text: "Re-Order" },
                  "Critical": { color: "red", text: "Critical" },
                  "Out of Stock": { color: "gray", text: "Out of Stock" },
                };
                const { color, text } = statusMap[row.status] || {};
                return <Badge color={color} text={text} />;
            },
            filters: [
                { text: 'Re-Order', value: 'Re-Order' },
                { text: 'Critical', value: 'Critical' },
                { text: 'Out of Stock', value: 'Out of Stock' }
            ],
            onFilter: (value, record) => record.status === value,
        }
    ]



    /**
     * Render
     */
    return(
        <>
            {(medicines && filteredMedicines)
            ? (
                <Table
                columns={medicineColumns}
                dataSource={filteredMedicines.map((item) => ({
                    ...item, 
                    key: item.id, 
                    status: item.qty <= 20 && item.qty > 10 ? "Re-Order" : (item.qty <= 10 && item.qty > 0 ? "Critical" : "Out of Stock")
                }))}
                bordered
                onRow={(medicine) => ({
                    onDoubleClick: () => navigate(`/OrtegaAdmin/ViewMedicines/${medicine.id}`)
                })}
                pagination={{pageSize: 20}}/>
            )
            : (<Spin size="large"/>)}
        </>
    );
}