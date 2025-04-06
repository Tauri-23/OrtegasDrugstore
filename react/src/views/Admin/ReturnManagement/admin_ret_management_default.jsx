import { useEffect, useState } from "react";
import { fetchAllFullPurchaseTransactions, fetchAllReturnedItems } from "../../../Services/PurchaseTransactionServices";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "antd";

export default function AdminReturnManagementDefault() {
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState("Index");
    const [transactionItems, setTransactionItems] = useState(null);
    const [filteredTransactionItems, setFileteredTransactionItems] = useState(null);

    const [returnedItems, setReturnedItems] = useState(null);
    const [filteredReturnedItems, setFilteredReturnedItems] = useState(null);


    /**
     * Onmount
     */
    useEffect(() => {
        const getAll = async() => {
            const [transactions, returnedItemsDb] = await Promise.all([
                fetchAllFullPurchaseTransactions(),
                fetchAllReturnedItems()
            ]);
            const transactionItemsExtracted = await transactions.flatMap(transaction => {return transaction.items});
            setTransactionItems(transactionItemsExtracted);
            setFileteredTransactionItems(transactionItemsExtracted);

            setReturnedItems(returnedItemsDb);
            setFilteredReturnedItems(returnedItemsDb);
        }

        getAll();
    }, []);



    /**
     * Render
     */
    return(
        <div className="content1">
            <h2 className="mar-bottom-l1 fw-bold">Return Management</h2>

            <div className="d-flex mar-bottom-l1 gap3">
                <Button
                size="large"
                type={activePage === "Index" ? "primary" : ""}
                onClick={() => navigate('/OrtegaAdmin/ReturnManagement')}>
                    Return an item
                </Button>

                <Button
                size="large"
                type={activePage === "History" ? "primary" : ""}
                onClick={() => navigate('/OrtegaAdmin/ReturnManagement/History')}>
                    Return history
                </Button>
            </div>
            
            <Outlet context={{
                setActivePage,
                transactionItems, setTransactionItems,
                filteredTransactionItems, setFileteredTransactionItems,
                returnedItems, setReturnedItems,
                filteredReturnedItems, setFilteredReturnedItems
            }}/>
        </div>
    )
}