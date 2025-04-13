import { useEffect, useState } from "react";
import { fetchAllFullPurchaseTransactions } from "../../../Services/PurchaseTransactionServices";
import { formatDateTime, formatToPhilPeso } from "../../../assets/js/utils";
import '../../../assets/css/sales.css'
import { Button, DatePicker, Spin, Table } from "antd";
import { useModal } from "../../../Context/ModalContext";
import * as XLSX from "xlsx";

export default function AdminSalesReports() {
    const {showModal} = useModal();
    const [sales, setSales] = useState(null);
    const [filteredSales, setFilteredSales] = useState(null);

    const dateToday = new Date();

    const [fromDate, setFromDate] = useState('2024-01-01');
    const [toDate, setToDate] = useState(`${dateToday.getFullYear()}-${dateToday.getMonth() + 1}-${dateToday.getDate()}`);

    const [selectedReportMonth, setSelectedReportMonth] = useState('');
    const [selectedReportYear, setSelectedReportYear] = useState('');
    const [reportData, setReportData] = useState(null);

    const { RangePicker } = DatePicker;



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
    const handleDateRangeChange = (e) => {
        if(!e) {
            setFilteredSales(sales);
            return;
        }
        const startDate = e[0].startOf("month").toDate();
        const endDate = e[1].endOf("month").toDate();

        const filteredResult = sales.filter(sale => {
            const salesDate = new Date(sale.created_at);
            return salesDate >= startDate && salesDate <= endDate;
        });
        setFilteredSales(filteredResult);
    }

    const handleDownloadReport = () => {
        if (!filteredSales || filteredSales.length === 0) return;

        const total = filteredSales.reduce((acc, x) => acc + x.total, 0);

        // Convert data to Excel format
        const summaryData = [
            ["Total Sales", formatToPhilPeso(total)],
            ["Total Transactions", filteredSales.length],
            [], //Empty Row
        ];

        const headers = [
            "Reference ID",
            "Total",
            "Transaction Date"
        ];

        const tableData = filteredSales.map((sale) => [
            String(sale.id),
            formatToPhilPeso(sale.total),
            formatDateTime(sale.created_at)
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([
            ...summaryData,
            headers,
            ...tableData
        ]);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Reports");

        // Download the file
        XLSX.writeFile(workbook, "SalesReport.xlsx");
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
                    </div>
                    
                    <div className="d-flex gap1 w-100 mar-bottom-l1">
                        <div className="w-50">
                            <div className="text-m1">Date Range</div>
                            <div className="d-flex gap3">
                                <RangePicker
                                onChange={handleDateRangeChange}
                                picker="month"
                                />

                                <Button
                                type="primary"
                                onClick={handleDownloadReport}>
                                    Download Report
                                </Button>
                            </div>
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