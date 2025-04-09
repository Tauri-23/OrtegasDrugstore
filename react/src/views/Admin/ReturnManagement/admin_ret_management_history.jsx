import { Input, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { formatDateTime, isEmptyOrSpaces } from "../../../assets/js/utils";
import { useOutletContext } from "react-router-dom";
import { fetchAllReturnedItems } from "../../../Services/PurchaseTransactionServices";

export default function AdminReturnManagementHistory() {
    const { setActivePage } = useOutletContext();

    const {Search} = Input;

    const [returnedItems, setReturnedItems] = useState(null);
    const [filteredReturnedItems, setFilteredReturnedItems] = useState(null);


    /**
     * Onmount
     */
    useEffect(() => {
        setActivePage("History");

        const getAll = async() => {
            const data = await fetchAllReturnedItems();
            setReturnedItems(data);
            setFilteredReturnedItems(data);
        }

        getAll();
    }, []);



    /**
     * Setup Table Columns
     */
    const transactionColumns = [
        {
            title: "Reference ID",
            dataIndex: 'purchase_transaction',
        },
        {
            title: "Item",
            render: (_, row) =>  row.medicine ? row.medicine.name : "N/A",
        },
        {
            title: "Quantity",
            dataIndex: 'qty',
        },
        {
            title: "Reason",
            dataIndex: 'reason',
        },
        {
            title: "Replacement Item",
            render: (_, row) =>  row.replacement_medicine ? row.replacement_medicine.name : "N/A",
        },
        {
            title: "Replacement Quantity",
            dataIndex: 'replacement_qty',
        },
        {
            title: "Return Date",
            render: (_, row) =>  formatDateTime(row.created_at),
        },
    ]



    /**
     * Handlers
     */
    const handleSearchChange = (e) => {
        const searchVal = e.target.value.toString();
        console.log(searchVal)

        if(isEmptyOrSpaces(searchVal)) {
            setFilteredReturnedItems(returnedItems);
            return;
        }

        setFilteredReturnedItems(returnedItems.filter(trans =>
            trans.purchase_transaction.toString().includes(searchVal.toLowerCase())
        ));
    }



    /**
     * Render
     */
    return(
        <>
            <div className="d-flex align-items-center justify-content-between mar-bottom-1">
                <Search 
                placeholder="Search for reference id" 
                onChange={handleSearchChange}
                enterButton 
                allowClear
                style={{width: 400}}
                size="large"
                />
            </div>

            {returnedItems === null || filteredReturnedItems === null
            ? (<Spin size="large"/>)
            : (
                <Table
                columns={transactionColumns}
                dataSource={filteredReturnedItems.map(item => ({...item, key: item.id}))}
                bordered
                pagination={{pageSize: 10}}/>
            )}
        </>
    )
}