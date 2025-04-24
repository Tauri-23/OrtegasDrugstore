import { useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom";
import { fetchAllPurchaseRequests } from "../../../Services/PurchaseRequestsServices";
import { Spin, Table } from "antd";
import { useModal } from "../../../Context/ModalContext";

export default function AdminViewPurchaseRequest() {
    const {setPage} = useOutletContext();
    const {showModal} = useModal();

    const [purchaseReqs, setPurchaseReqs] = useState(null);


    /**
     * Onmount
     */
    useEffect(() => {
        setPage("Purchase Requests");

        const getAll = async() => {
            const data = await fetchAllPurchaseRequests();
            setPurchaseReqs(data);
        }

        getAll();
    }, []);



    /**
     * Columns
     */
    const purchaseReqColumns = [
        {
            title: "Purchase Request ID",
            dataIndex: "id"
        },
        {
            title: "Item",
            render: (_, row) => row.medicine.name
        },
        {
            title: "Quantity",
            dataIndex: "qty"
        },
        {
            title: "Supplier Name",
            dataIndex: "supplier_name"
        },
        {
            title: "Contact Person",
            dataIndex: "supplier_contact_person"
        },
        {
            title: "Contact Number",
            dataIndex: "supplier_contact_number"
        },
        {
            title: "Requested by",
            render: (_, row) => row.requested_by ? `${row.requested_by.firstname} ${row.requested_by.lastname}` : "N/A"
        },
    ]



    /**
     * Handlers
     */
    const handleViewPurchaseReq = (purchaseReq) => {
        console.log(purchaseReq);
        showModal("AdminViewPurchaseRequestModal", {purchaseReq})
    }



    /**
     * Render
     */
    return(
        <>
            {purchaseReqs
            ? (
                <Table
                columns={purchaseReqColumns}
                dataSource={purchaseReqs.map((item) => ({
                    ...item, 
                    key: item.id
                }))}
                bordered
                onRow={(row) => ({
                    onDoubleClick: () => handleViewPurchaseReq(row)
                })}
                pagination={{pageSize: 20}}/>
            )
            : (<Spin size="large"/>)}
        </>
    )
}