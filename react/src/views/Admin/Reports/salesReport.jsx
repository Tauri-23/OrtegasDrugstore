import { useEffect, useState } from "react";
import { fetchAllMedGroups } from "../../../Services/GeneralMedicineGroupService";
import { fetchAllFullPurchaseTransactions, fetchAllPurchasTransactionsWhereDateRange, fetchNecessaryForReport } from "../../../Services/PurchaseTransactionServices";
import { calculatePercentageDifference, formatDateTime, formatToPhilPeso, isEmptyOrSpaces } from "../../../assets/js/utils";
import '../../../assets/css/sales.css'

export default function AdminSalesReports() {
    const [sales, setSales] = useState(null);
    const dateToday = new Date();

    const [fromDate, setFromDate] = useState('2024-01-01');
    const [toDate, setToDate] = useState(`${dateToday.getFullYear()}-${dateToday.getMonth() + 1}-${dateToday.getDate()}`);

    const [isShowReport, setShowReport] = useState(true);


    useEffect(() => {
        const getAll = async() => {
            try {
                const [salesDb] = await Promise.all([
                    fetchAllFullPurchaseTransactions()
                ]);
                setSales(salesDb);

            } catch (error) {
                console.error(error);
            }
        }

        getAll();
    }, []);



    /**
     * Handlers
     */
    const handleFilter = async() => {
        const data = await fetchAllPurchasTransactionsWhereDateRange(fromDate, toDate);
        setSales(data);
    }

    const downloadReport = async () => {
        try {
            const data = await fetchNecessaryForReport(11, 2024);
            console.log(data);
            let medicineAndQtyNow = [];

            await data.extracted_items_now.forEach(element => {
                const medicineId = element.medicine.id;
                // Check if the medicine already exists in the medicineAndQty array
                const existingMedicine = medicineAndQtyNow.find(med => med.id === medicineId);
                if(existingMedicine) {
                    existingMedicine.qty += element.qty;
                }
                else {
                    medicineAndQtyNow.push({
                        id: medicineId,
                        name: element.medicine.name,
                        qty: element.qty
                    });
                }
            });

            const sortedMedicineAndQty = medicineAndQtyNow.sort((a, b) => b.qty - a.qty);

            console.log(calculatePercentageDifference(data.total_sales_now, data.total_sales_last_month));

            console.log(sortedMedicineAndQty);
        } catch (error) {
            console.error(error);
        }
    }



    /**
     * Render
     */
    return(
        <div className="content1">
            {!isShowReport && (
                <>
                    <div className="d-flex align-items-center justify-content-between mar-bottom-l1 w-100">
                        <div className="text-l1 fw-bolder">Sales Reports</div>
                        <div className="primary-btn-dark-blue1" onClick={downloadReport}>Download Report</div>
                    </div>
                    
                    <div className="d-flex gap1 w-100 mar-bottom-l1">
                        <div className="w-50">
                            <div className="text-m1">Date Range</div>
                            <div className="d-flex gap3">
                                <input type="date" id="from" className="input1 w-50" value={fromDate} onChange={(e) => setFromDate(e.target.value)}/>
                                
                                <input type="date" id="to" className="input1 w-50" value={toDate} onChange={(e) => setToDate(e.target.value)}/>
                            </div>
                        </div>

                        <div className="d-flex align-items-end">
                            <div className="primary-btn-dark-blue1" onClick={handleFilter}>Apply</div>
                        </div>
                    </div>

                    <div className="d-flex gap1 w-100">
                        <div className="cont-box1 w-50">
                            <div className="cont-box1-head">
                                <div className="text-l3">Sales Made</div>
                            </div>
                            <div className="hr-line1-black3"></div>
                            <div className="cont-box1-body" style={{height: "400px"}}>
                            </div>
                        </div>

                        <div className="cont-box1 w-50">
                            <div className="cont-box1-head d-flex w-100">
                                <div className="text-l3 w-50 text-center">Order Id</div>
                                <div className="text-l3 w-50 text-center">Date & Time</div>
                            </div>
                            <div className="hr-line1-black3"></div>
                            <div className="cont-box1-body" style={{height: "400px"}}>
                                
                                {!sales && (
                                    <div className="text-m1">Loading...</div>
                                )}

                                {sales?.length < 1 && (
                                    <div className="text-m1">No records.</div>
                                )}

                                {sales?.length > 0 && sales.map(sale => (
                                    <div key={sale.id} className="sales-row">
                                        <div className="w-50 text-center">
                                            {sale.id}
                                        </div>

                                        <div className="w-50 text-center">
                                            {formatDateTime(sale.created_at)}
                                        </div>
                                    </div>
                                ))}


                            </div>
                        </div>
                    </div>
                </>
            )}

            {isShowReport && (
                <div className="report-paper m-auto">
                    <div className="text-center text-l1 fw-bold">Ortega's Drugstore</div>
                    <div className="text-center text-m1 mar-bottom-l1">Makati City</div>
                    
                    <div className="text-center text-l2 fw-bold mar-bottom-l3">Sales Report</div>
                    <div className="text-m2">November 2024</div>

                    <div className="hr-line1-black3 mar-y-3"></div>

                    <div className="d-flex justify-content-between w-100 text-m2">
                        <div>Total Sales:</div>
                        <div>{formatToPhilPeso(100000)} + 100%</div>
                    </div>

                    <div className="d-flex justify-content-between w-100 text-m2">
                        <div>Item Sold:</div>
                        <div>{100} + 100%</div>
                    </div>

                    <div className="hr-line1-black3 mar-y-3"></div>

                    <div className="text-m1 mar-y-2 fw-bold">Top 3 most item sold:</div>

                    <table className="report-paper-table">
                        <thead className="report-paper-table-thead">
                            <tr>
                                <th>Item ID</th>
                                <th>Item Name</th>
                                <th>Quantity Sold</th>
                                <th>Sales</th>
                            </tr>
                        </thead>
                        <tbody className="report-paper-table-tbody">
                            {Array.from({length: 3}).map((_, index) => (
                                <tr key={index}>
                                    <td>{index}</td>
                                    <td>Item Name {index}</td>
                                    <td>101 + 50%</td>
                                    <td>{formatToPhilPeso(100)} + 100%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="text-m1 mar-y-2 fw-bold">New Items (3):</div>

                    <table className="report-paper-table">
                        <thead className="report-paper-table-thead">
                            <tr>
                                <th>Item ID</th>
                                <th>Item Name</th>
                                <th>Group</th>
                                <th>Price</th>
                                <th>QTY</th>
                            </tr>
                        </thead>
                        <tbody className="report-paper-table-tbody">
                            {Array.from({length: 3}).map((_, index) => (
                                <tr key={index}>
                                    <td>{index}</td>
                                    <td>item{index}</td>
                                    <td>Group {index}</td>
                                    <td>{formatToPhilPeso(100)}</td>
                                    <td>100</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="hr-line1-black3 mar-y-1"></div>

                    <div className="text-m1 mar-y-2 fw-bold">All Item Sales (3):</div>

                    <table className="report-paper-table">
                        <thead className="report-paper-table-thead">
                            <tr>
                                <th>Item ID</th>
                                <th>Item Name</th>
                                <th>Group</th>
                                <th>Price</th>
                                <th>QTY</th>
                            </tr>
                        </thead>
                        <tbody className="report-paper-table-tbody">
                            {Array.from({length: 3}).map((_, index) => (
                                <tr key={index}>
                                    <td>{index}</td>
                                    <td>item{index}</td>
                                    <td>Group {index}</td>
                                    <td>{formatToPhilPeso(100)}</td>
                                    <td>100</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                
            )}
            

        </div>
    );
}