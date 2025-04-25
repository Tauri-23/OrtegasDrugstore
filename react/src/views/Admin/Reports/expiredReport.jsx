import { useEffect, useState } from "react";
import { fetchAllFullPurchaseTransactions } from "../../../Services/PurchaseTransactionServices";
import { formatDate, formatDateTime, formatToPhilPeso } from "../../../assets/js/utils";
import '../../../assets/css/sales.css'
import { Button, DatePicker, Spin, Table } from "antd";
import { useModal } from "../../../Context/ModalContext";
import * as XLSX from "xlsx";
import { fetchAllExpiredMedicine } from "../../../Services/DashboardService";

export default function AdminExpiredReport() {
    const [expiredMeds, setexpiredMeds] = useState(null);
    const [filteredExpiredMeds, setFilteredExpiredMeds] = useState(null);


    /**
     * Onmount
     */
    useEffect(() => {
        const getAll = async() => {
            try {
                const [expiredMedsDb] = await Promise.all([
                    fetchAllExpiredMedicine()
                ]);
                setexpiredMeds(expiredMedsDb);
                setFilteredExpiredMeds(expiredMedsDb);

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
        if (!filteredExpiredMeds || filteredExpiredMeds.length === 0) return;

        const total = filteredExpiredMeds.reduce((acc, x) => acc + x.total, 0);

        // Convert data to Excel format
        const summaryData = [
            ["Total Expired Meds", filteredExpiredMeds.length],
            [], //Empty Row
        ];

        const headers = [
            "Medicine Name",
            "Stock",
            "Expiration"
        ];

        const tableData = filteredExpiredMeds.map((med) => [
            String(med.medicine.name),
            med.qty,
            formatDate(med.expiration_date)
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([
            ...summaryData,
            headers,
            ...tableData
        ]);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Expired Medicines Reports");

        // Download the file
        XLSX.writeFile(workbook, "ExpiredMedicinesReports.xlsx");
    }



    /**
     * Setup Columns
     */
    const medicineColumns = [
        {
            title: "Medicine Name",
            render: (_, item) => item.medicine.name
        },
        {
            title: "Stock",
            dataIndex: "qty",
            sorter: (a, b) => a.qty - b.qty
        },
        {
            title: "Expiration",
            render: (_, item) => formatDate(item.expiration_date)
        },
    ]



    /**
     * Render
     */
    return(
        <div className="content1">
            {!filteredExpiredMeds
            ? (<Spin size="large"/>)
            : (
                <>
                    <div className="d-flex align-items-center justify-content-between mar-bottom-l1 w-100">
                        <div className="text-l1 fw-bolder">Expired Reports</div>
                    </div>
                    
                    <div className="d-flex gap1 w-100 mar-bottom-l1">
                        <div className="w-50">
                            {/* <div className="text-m1">Date Range</div> */}
                            <div className="d-flex gap3">
                                {/* <RangePicker
                                onChange={handleDateRangeChange}
                                picker="month"
                                /> */}

                                <Button
                                type="primary"
                                onClick={handleDownloadReport}>
                                    Download Report
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Table
                    columns={medicineColumns}
                    dataSource={filteredExpiredMeds.map((item) => ({...item, key: item.id}))}
                    pagination={{pageSize: 10}}
                    bordered
                    />
                </>
            )}       

        </div>
    );
}