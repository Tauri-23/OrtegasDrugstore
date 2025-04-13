import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { formatDate, formatToPhilPeso } from "../../../assets/js/utils";
import { fetchAllExpiringMedicine, fetchAllMedicineShortage } from "../../../Services/DashboardService";
import { Badge, Spin, Table } from "antd";
import { fetchAllMedGroups } from "../../../Services/GeneralMedicineGroupService";

export default function AdminViewExpiring() {
    const { setPage } = useOutletContext();
    const [medicines, setMedicines] = useState(null);
    const [filteredMedicines, setFilteredMedicines] = useState(null);

    const [groups, setGroups] = useState(null);

    const navigate = useNavigate();



    /**
     * Onmount
     */
    useEffect(() => {
        setPage("Expiring");

        const getAllMedicines = async() => {
            try {
                const [medsDb, groupsDb] = await Promise.all([
                    fetchAllExpiringMedicine(),
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
            render: (_, item) => item.medicine.name
        },
        {
            title: "Stock",
            dataIndex: "qty",
            sorter: (a, b) => a.qty - b.qty
        },
        {
            title: "Expiration",
            render: (_, item) => `Expiring on  ${formatDate(item.expiration_date)}`
        },
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
                    onDoubleClick: () => navigate(`/OrtegaAdmin/ViewMedicines/${medicine.medicine.id}`)
                })}
                pagination={{pageSize: 20}}/>
            )
            : (<Spin size="large"/>)}
        </>
    );
}