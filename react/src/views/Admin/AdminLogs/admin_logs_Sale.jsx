import { useEffect, useState } from "react";
import { fetchAllLogsWhereType } from "../../../Services/AdminLogsServices";
import {Spin, Table} from "antd";
import { formatDateTime, formatToPhilPeso } from "../../../assets/js/utils";
import * as XLSX from "xlsx";

export default function AdminLogsSale() {
    const [logs, setLogs] = useState(null);



    /**
     * Onmount
     */
    useEffect(() => {
        const getAll = async() => {
            const data = await fetchAllLogsWhereType("Sale");
            setLogs(data);
        }

        getAll();
    }, []);



    /**
     * Logs Columns
     */
    const logsColumns = [
        {
            title: "LOG ID",
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: "Cashier",
            render: (_, row) =>  row.cashier ? `${row.cashier.firstname} ${row.cashier.lastname}` : "N/A",
            key: 'id',
        },
        {
            title: "Activity",
            dataIndex: 'sale_activity',
            key: 'id',
        },
        {
            title: "Reference Id",
            render: (_, row) =>  row.transaction ? row.transaction.id : "N/A",
            key: 'id',
        },
        {
            title: "Total Price",
            render: (_, row) =>  row.transaction ? formatToPhilPeso(row.transaction.total) : "N/A",
            key: 'id',
        },
        {
            title: "Timestamp",
            dataIndex: 'created_at',
            render: (_, row) => formatDateTime(row.created_at),
            key: 'id',
        },
    ];



    /**
     * Print as XLSX
     */
    const handlePrintAsExcel = () => {
        if (!logs || logs.length === 0) return;

        // Convert data to Excel format
        const exportData = logs.map((log) => ({
            "LOG ID": log.id,
            "Cashier": log.cashier ? `${log.cashier.firstname} ${log.cashier.lastname}` : "N/A",
            "Activity": log.sale_activity,            
            "Reference Id": log.transaction ? String(log.transaction.id) : "N/A",
            "Total Price": log.transaction ? formatToPhilPeso(log.transaction.total) : "N/A",
            "Timestamp": formatDateTime(log.created_at),
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Audit Logs");

        // Download the file
        XLSX.writeFile(workbook, "sales_audit_logs.xlsx");
    }



    /**
     * Render
     */
    return(
        <>
            {!logs
            ? (<Spin size="large"/>)
            : (
                <>
                    <button 
                    onClick={handlePrintAsExcel}
                    className="primary-btn-dark-blue1 mar-bottom-1">
                        Download as .xlsx
                    </button>

                    <Table
                    columns={logsColumns}
                    dataSource={logs.map((item) => ({...item, key: item.id}))}
                    pagination={{pageSize: 10}}
                    bordered
                    />
                </>
            )}
        </>
    );
}