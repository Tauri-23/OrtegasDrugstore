import { useEffect, useState } from "react";
import * as Icon from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { formatDate, formatToPhilPeso } from "../../assets/js/utils";
import { fetchAllMedicineShortage } from "../../Services/DashboardService";
import { Badge, Spin, Table } from "antd";
import { fetchAllMedGroups } from "../../Services/GeneralMedicineGroupService";

export default function ViewShortage() {
    const [medicines, setMedicines] = useState(null);
    const [filteredMedicines, setFilteredMedicines] = useState(null);

    const [groups, setGroups] = useState(null);

    const navigate = useNavigate();



    /**
     * Onmount
     */
    useEffect(() => {
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
        <div className="content1">
            <div className="mar-bottom-l1">
                <div className="text-l1 fw-bolder">Low Stock Items</div>
                <div className="text-m1">List of low stock items.</div>
            </div>

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

            {/* <table className="table1">
                <thead className="table1-thead">
                    <tr>
                        <th>Medicine Name</th>
                        <th>Group Name</th>
                        <th>Price</th>
                        <th>Stock in Qty</th>
                        <th>Expiration</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className="table1-tbody">
                    {medicines?.length > 0 && medicines.map((meds, index) => (
                        <tr key={index} onClick={() => navigate(`/OrtegaAdmin/ViewMedicines/${meds.id}`)}>
                            <td>{meds.name}</td>
                            <td>{meds.group.group_name}</td>
                            <td>{formatToPhilPeso(meds.price)}</td>
                            <td>{meds.qty}</td>
                            <td>{formatDate(meds.expiration)}</td>
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
        </div>
    );
}