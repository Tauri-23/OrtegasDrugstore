import { Input, Spin, Table } from "antd";
import { useEffect } from "react";
import { formatDateTime, isEmptyOrSpaces, notify } from "../../../assets/js/utils";
import { useModal } from "../../../Context/ModalContext";
import axiosClient from "../../../axios-client";
import { useOutletContext } from "react-router-dom";

export default function AdminReturnManagementIndex() {
    const {showModal} = useModal();
    const {
        setActivePage,
        transactionItems, setTransactionItems, 
        filteredTransactionItems, setFileteredTransactionItems,
        medicines
    } = useOutletContext();

    const {Search} = Input;


    /**
     * Onmount
     */
    useEffect(() => {
        setActivePage("Index");
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
            title: "Transaction Date",
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
            setFileteredTransactionItems(transactionItems);
            return;
        }

        setFileteredTransactionItems(transactionItems.filter(trans =>
            trans.purchase_transaction.toString().includes(searchVal.toLowerCase())
        ));
    }

    const handleTransactionItemClick = (item) => {
        showModal("ReturnItemsModal", {
            medicines,
            item,
            handleReturnPost: (returnItem) => {
                const formData = new FormData();
                formData.append("itemRet", JSON.stringify(returnItem));
        
                axiosClient.post("/return-transaction-item", formData)
                .then(({data}) => {
                    if(data.status === 200) {
                        const transactionItemsExtracted = data.transactions.flatMap(transaction => {return transaction.items});
                        setTransactionItems(transactionItemsExtracted);
                        setFileteredTransactionItems(transactionItemsExtracted);
                    }
                    notify(data.status === 200 ? "success" : "error", data.message, "top-center", 3000);
                }).catch(error => {
                    notify("error", "Server Error", "top-center", 3000);
                    console.error(error.response.data);
                })
            }
        });
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

            {transactionItems === null || filteredTransactionItems === null
            ? (<Spin size="large"/>)
            : (
                <Table
                columns={transactionColumns}
                dataSource={filteredTransactionItems.map(item => ({...item, key: item.id}))}
                bordered
                pagination={{pageSize: 10}}
                onRow={(record) => ({
                    onDoubleClick: () => handleTransactionItemClick(record)
                })}/>
            )}
        </>
    )
}