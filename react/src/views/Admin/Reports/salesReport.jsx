import { useEffect, useState } from "react";
import { fetchAllFullPurchaseTransactions, fetchAllPurchasTransactionsWhereDateRange, fetchNecessaryForReport } from "../../../Services/PurchaseTransactionServices";
import { calculatePercentageDifference, formatDateTime, formatToPhilPeso, isEmptyOrSpaces } from "../../../assets/js/utils";
import '../../../assets/css/sales.css'
import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';
import { Spin, Table } from "antd";
import { useModal } from "../../../Context/ModalContext";

export default function AdminSalesReports() {
    const {showModal} = useModal();
    const [sales, setSales] = useState(null);
    const [filteredSales, setFilteredSales] = useState(null);

    const dateToday = new Date();

    const [fromDate, setFromDate] = useState('2024-01-01');
    const [toDate, setToDate] = useState(`${dateToday.getFullYear()}-${dateToday.getMonth() + 1}-${dateToday.getDate()}`);

    const [selectedReportMonth, setSelectedReportMonth] = useState('');
    const [selectedReportYear, setSelectedReportYear] = useState('');
    const [isShowReport, setShowReport] = useState(false);
    const [reportData, setReportData] = useState(null);



    /**
     * Onmount
     */
    useEffect(() => {
        const getAll = async() => {
            try {
                const [salesDb] = await Promise.all([
                    fetchAllFullPurchaseTransactions()
                ]);
                setSales(salesDb);
                setFilteredSales(salesDb);
                console.log(salesDb);

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



    /**
     * Setup Table Columns
     */
    const transactionsColumns = [
        {
            title: "Reference Id",
            dataIndex: "id"
        },
        {
            title: "Total",
            render: (_, row) => formatToPhilPeso(row.total)
        },
        {
            title: "Transaction Date",
            render: (_, row) => formatDateTime(row.created_at)
        }
    ]



    /**
     * Render
     */
    return(
        <div className="content1">
            {!filteredSales
            ? (<Spin size="large"/>)
            : (
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

                    <Table
                    columns={transactionsColumns}
                    dataSource={filteredSales.map((item) => ({...item, key: item.id}))}
                    pagination={{pageSize: 10}}
                    bordered
                    onRow={(row) => ({onDoubleClick: () => showModal("AdminViewReceiptModal1", {data: row, })})}/>
                </>
            )}       

        </div>
    );
}