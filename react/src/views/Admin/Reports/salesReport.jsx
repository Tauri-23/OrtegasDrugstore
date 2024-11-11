import { useEffect, useState } from "react";
import { fetchAllFullPurchaseTransactions, fetchAllPurchasTransactionsWhereDateRange, fetchNecessaryForReport } from "../../../Services/PurchaseTransactionServices";
import { calculatePercentageDifference, formatDateTime, formatToPhilPeso, isEmptyOrSpaces } from "../../../assets/js/utils";
import '../../../assets/css/sales.css'
import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';

export default function AdminSalesReports() {
    const [sales, setSales] = useState(null);
    const dateToday = new Date();

    const [fromDate, setFromDate] = useState('2024-01-01');
    const [toDate, setToDate] = useState(`${dateToday.getFullYear()}-${dateToday.getMonth() + 1}-${dateToday.getDate()}`);

    const [selectedReportMonth, setSelectedReportMonth] = useState('');
    const [selectedReportYear, setSelectedReportYear] = useState('');
    const [isShowReport, setShowReport] = useState(false);
    const [reportData, setReportData] = useState(null);


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
    const getMonthName = () => {
        const month = selectedReportMonth ? selectedReportMonth - 1 : dateToday.getMonth();
        return new Date(0, month).toLocaleString('default', { month: 'long' });
    };

    const handleFilter = async() => {
        const data = await fetchAllPurchasTransactionsWhereDateRange(fromDate, toDate);
        setSales(data);
    }

    const downloadReport = async () => {
        if(isEmptyOrSpaces(selectedReportMonth) || isEmptyOrSpaces(selectedReportYear)) {
            return;
        }
        try {
            const data = await fetchNecessaryForReport(selectedReportMonth, selectedReportYear);
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
                        price: element.medicine.price,
                        group: element.medicine.group.group_name,
                        qty: element.qty
                    });
                }
            });

            const sortedMedicineAndQty = medicineAndQtyNow.sort((a, b) => b.qty - a.qty);
            const totalQtyNow = data.extracted_items_now.reduce((total, item) => total + item.qty, 0);
            const totalQtyLastMonth = data.extracted_items_last_month.reduce((total, item) => total + item.qty, 0);
            setReportData({
                data,
                sortedMedicineAndQty,
                totalQtyNow,
                totalQtyLastMonth
            });
            //setShowReport(true);
        } catch (error) {
            console.error(error);
        }
    }

    const downloadPDF = () => {
        if (!reportData) return;

        const doc = new jsPDF({
            orientation: "portrait",  // Set to landscape if needed
            unit: "mm",
            format: "a4",  // Adjust if your content requires a different page format
        });

        // Ensure that the content is fully rendered and available
        const element = document.getElementById("printable-report");

        if (!element) {
            console.error('Error: Element with id "printable-report" not found.');
            return;
        }

        // This line ensures proper layout recalculation before rendering
        element.offsetHeight;

        // Use jsPDF's `html` method to render the HTML to the PDF
        doc.html(element, {
            callback: function (doc) {
                // Save the PDF once it's generated
                doc.save("sales_report.pdf");
            },
            margin: [10, 10, 10, 10], // Adjust margins
            x: 10, // Adjust starting x position
            y: 10, // Adjust starting y position
            html2canvas: {
                scale: .3, // Ensure scale is set to 1 to avoid zooming
                useCORS: true,  // Enable Cross-Origin Resource Sharing if needed for images
                logging: true, // Enable logging to troubleshoot issues
                letterRendering: true,  // Makes the text rendering more accurate
            },
        });

        setReportData(null);
    };


    
    // useEffect(() => {
    //     console.log(reportData);
    //     if(reportData) {
    //         downloadPDF();
    //     }
    // }, [reportData]);



    /**
     * Render
     */
    return(
        <div className="content1">
            {!reportData && (
                <>
                    <div className="d-flex align-items-center justify-content-between mar-bottom-l1 w-100">
                        <div className="text-l1 fw-bolder">Sales Reports</div>
                        <div className="d-flex align-items-center gap3">
                            <select name="" id="" className="input1" value={selectedReportMonth} onChange={(e) => setSelectedReportMonth(e.target.value)}>
                                <option value="">Select Month Period</option>
                                {dateToday.getMonth() + 1 >= 1 && (<option value="1">January</option>)}
                                {dateToday.getMonth() + 1 >= 2 && (<option value="2">February</option>)}
                                {dateToday.getMonth() + 1 >= 3 && (<option value="3">March</option>)}
                                {dateToday.getMonth() + 1 >= 4 && (<option value="4">April</option>)}
                                {dateToday.getMonth() + 1 >= 5 && (<option value="5">May</option>)}
                                {dateToday.getMonth() + 1 >= 6 && (<option value="6">June</option>)}
                                {dateToday.getMonth() + 1 >= 7 && (<option value="7">July</option>)}
                                {dateToday.getMonth() + 1 >= 8 && (<option value="8">August</option>)}
                                {dateToday.getMonth() + 1 >= 9 && (<option value="9">September</option>)}
                                {dateToday.getMonth() + 1 >= 10 && (<option value="10">October</option>)}
                                {dateToday.getMonth() + 1 >= 11 && (<option value="11">November</option>)}
                                {dateToday.getMonth() + 1 >= 12 && (<option value="12">December</option>)}
                            </select>
                            <select name="" id="" className="input1" value={selectedReportYear} onChange={(e) => setSelectedReportYear(e.target.value)}>
                                <option value="">Select Year Period</option>
                                <option value="2024">2024</option>
                                {/* <option value="2025">2025</option>
                                <option value="2026">2026</option> */}
                            </select>
                            <div className="primary-btn-dark-blue1" onClick={downloadReport}>Download Report</div>
                        </div>
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



            {/* Report */}
            {reportData && (
                <div className="report-paper m-auto">
                    <div id="printable-report">
                        <div className="text-center text-l1 fw-bold">Ortega's Drugstore</div>
                        <div className="text-center text-m1 mar-bottom-l1">Makati City</div>
                        
                        <div className="text-center text-l2 fw-bold mar-bottom-l3">Sales Report</div>
                        <div className="text-m2">{getMonthName()} {selectedReportYear}</div>

                        <div className="hr-line1-black3 mar-y-3"></div>

                        <div className="d-flex justify-content-between w-100 text-m2">
                            <div>Total Sales:</div>
                            <div>
                                {formatToPhilPeso(reportData.data.total_sales_now)} 
                                ({reportData.data.total_sales_now > reportData.data.total_sales_last_month ? '+' : '-'} 
                                {`${calculatePercentageDifference(reportData.data.total_sales_now, reportData.data.total_sales_last_month)}%`})
                            </div>
                        </div>

                        <div className="d-flex justify-content-between w-100 text-m2">
                            <div>Item Sold:</div>
                            <div>
                            {reportData.totalQtyNow}
                            ({reportData.totalQtyNow > reportData.totalQtyLastMonth ? '+' : '-'} 
                            {`${calculatePercentageDifference(reportData.totalQtyNow, reportData.totalQtyLastMonth)}%`})</div>
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
                                {reportData.sortedMedicineAndQty.slice(0, 3).map(med => (
                                    <tr key={med.id}>
                                        <td>{med.id}</td>
                                        <td>{med.name}</td>
                                        <td>{med.qty}</td>
                                        <td>{formatToPhilPeso(med.qty * med.price)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="text-m1 mar-y-2 fw-bold">New Items ({reportData.data.new_items.length}):</div>

                        <table className="report-paper-table">
                            <thead className="report-paper-table-thead">
                                <tr>
                                    <th>Item ID</th>
                                    <th>Item Name</th>
                                    <th>Group</th>
                                    <th>Price</th>
                                    <th>QTY (Stock)</th>
                                </tr>
                            </thead>
                            <tbody className="report-paper-table-tbody">
                                {reportData.data.new_items.map((med) => (
                                    <tr key={med.id}>
                                        <td>{med.id}</td>
                                        <td>{med.name}</td>
                                        <td>{med.group.group_name}</td>
                                        <td>{formatToPhilPeso(med.price)}</td>
                                        <td>{med.qty}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="hr-line1-black3 mar-y-1"></div>

                        <div className="text-m1 mar-y-2 fw-bold">All Item Sales ({reportData.sortedMedicineAndQty.length}):</div>

                        <table className="report-paper-table">
                            <thead className="report-paper-table-thead">
                                <tr>
                                    <th>Item ID</th>
                                    <th>Item Name</th>
                                    <th>Group</th>
                                    <th>Price</th>
                                    <th>QTY (Sold)</th>
                                </tr>
                            </thead>
                            <tbody className="report-paper-table-tbody">
                                {reportData.sortedMedicineAndQty.map(med => (
                                    <tr key={med.id}>
                                        <td>{med.id}</td>
                                        <td>{med.name}</td>
                                        <td>{med.group}</td>
                                        <td>{formatToPhilPeso(med.price)}</td>
                                        <td>{med.qty}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>   
                </div>
                             
            )}
            

        </div>
    );
}