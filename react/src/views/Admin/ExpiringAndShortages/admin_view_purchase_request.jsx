import { useEffect, useRef, useState } from "react"
import { useOutletContext } from "react-router-dom";
import { fetchAllPurchaseRequests } from "../../../Services/PurchaseRequestsServices";
import { Button, Spin, Table } from "antd";
import { useModal } from "../../../Context/ModalContext";
import { useReactToPrint } from "react-to-print";
import printJS from 'print-js';
import { formatDateTime } from "../../../assets/js/utils";

export default function AdminViewPurchaseRequest() {
    const {setPage} = useOutletContext();
    const {showModal} = useModal();

    const [purchaseReqs, setPurchaseReqs] = useState(null);
    const [selectedPurchaseReqs, setSelectedPurchaseReqs] = useState(null);
    const [isViewPurchaseReq, setIsViewPurchaseReq] = useState(false);
    const [isPrintingAll, setPrintingAll] = useState(false);

    const printRef = useRef(null);
    const allPrintRef = useRef(null);



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
        setSelectedPurchaseReqs(purchaseReq);
        // showModal("AdminViewPurchaseRequestModal", {purchaseReq})
        setIsViewPurchaseReq(true);
    }

    const handlePrint = () => {
        if (printRef.current) {
            printJS({
                printable: printRef.current,
                type: 'html',
                targetStyles: ['*'], // Print all styles
            });
        } else {
            console.error('No content to print');
        }
    };

    const handlePrintAll = () => {
        setPrintingAll(true);
    
        setTimeout(() => {
            if (allPrintRef.current) {
                printJS({
                    printable: 'print-all', // use an ID (not the DOM node itself)
                    type: 'html',
                    targetStyles: ['*'], // Include all styles
                });
            } else {
                console.error('No content to print');
            }
    
            setPrintingAll(false);
        }, 100);
    };
    



    /**
     * Render
     */
    return(
        <>
            {purchaseReqs
            ? (isViewPurchaseReq
                ? (
                    <>
                        <div ref={printRef} style={{ background: 'white', padding: 20 }}>
                            <center><h3 className='mar-bottom-1'>Purchase Request</h3></center>

                            <div className="d-flex w-100 gap3">
                                <div className="w-50">
                                    <div>Request ID:</div>
                                    <div>Requested Date:</div>
                                    <div>Request By:</div>
                                    <div>Item Name:</div>
                                    <div>Quantity:</div>
                                </div>

                                <div className="w-50">
                                    <div>{selectedPurchaseReqs?.id}</div>
                                    <div>{formatDateTime(selectedPurchaseReqs?.created_at)}</div>
                                    <div>{selectedPurchaseReqs?.requested_by?.firstname} {selectedPurchaseReqs?.requested_by?.lastname}</div>
                                    <div>{selectedPurchaseReqs?.medicine?.name}</div>
                                    <div>{selectedPurchaseReqs?.qty}</div>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex gap3">
                            <Button className="mar-top-1" onClick={() => setIsViewPurchaseReq(false)}>
                                Back
                            </Button>
                            <Button 
                            type="primary" 
                            className="mar-top-1" 
                            onClick={() => {
                                if (printRef.current) {
                                    console.log("Content ready to print");
                                    handlePrint();
                                } else {
                                    console.error("No content to print");
                                }
                            }}>
                                Print
                            </Button>
                        </div>
                    </>
                )
                : (
                    <>
                        <Button type="primary" onClick={handlePrintAll} className="mar-bottom-1">Print All</Button>
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

                        {/* All Purchase Requests content to print */}
                        
                        {isPrintingAll && (
                            <div id="print-all" ref={allPrintRef}>
                                <center><h3 className="mar-bottom-1">All Purchase Requests</h3></center>
                                {purchaseReqs?.map((purchaseReq) => (
                                    <div key={purchaseReq.id} className="purchase-request">
                                    <h4>Purchase Request ID: {purchaseReq.id}</h4>
                                    <div>Requested Date: {formatDateTime(purchaseReq.created_at)}</div>
                                    <div>Item Name: {purchaseReq.medicine.name}</div>
                                    <div>Quantity: {purchaseReq.qty}</div>
                                    <div>Supplier Name: {purchaseReq.supplier_name}</div>
                                    <div>Contact Person: {purchaseReq.supplier_contact_person}</div>
                                    <div>Contact Number: {purchaseReq.supplier_contact_number}</div>
                                    <div>Requested By: {purchaseReq.requested_by ? `${purchaseReq.requested_by.firstname} ${purchaseReq.requested_by.lastname}` : 'N/A'}</div>
                                    <hr />
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )
            )
            : (<Spin size="large"/>)}
        </>
    )
}