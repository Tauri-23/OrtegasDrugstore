import { useEffect, useState } from "react";
import { fetchAllMedGroups } from "../../../Services/GeneralMedicineGroupService";
import { fetchAllFullPurchaseTransactions, fetchAllPurchasTransactionsWhereDateRange } from "../../../Services/PurchaseTransactionServices";
import { formatDateTime, formatToPhilPeso, isEmptyOrSpaces } from "../../../assets/js/utils";
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
     * Dugging
     */
    useEffect(() => {
        console.log(sales);
    }, [sales]);



    /**
     * Handlers
     */
    const handleFilter = async() => {
        const data = await fetchAllPurchasTransactionsWhereDateRange(fromDate, toDate);
        setSales(data);
    }

    const downloadReport = () => {
        return
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
                        <div className="primary-btn-dark-blue1">Download Report</div>
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
                            <tr>
                                <td>Item ID</td>
                                <td>Item Name</td>
                                <td>Quantity Sold</td>
                                <td>Sales</td>
                            </tr>
                            <tr>
                                <td>Item ID</td>
                                <td>Item Name</td>
                                <td>Quantity Sold</td>
                                <td>Sales</td>
                            </tr>
                            <tr>
                                <td>Item ID</td>
                                <td>Item Name</td>
                                <td>Quantity Sold</td>
                                <td>Sales</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                
            )}
            

        </div>
    );
}