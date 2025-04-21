import { useEffect, useState } from "react";
import { fetchAllLogsWhereType } from "../../../Services/AdminLogsServices";
import {Spin, Table} from "antd";
import { formatDateTime } from "../../../assets/js/utils";
import * as XLSX from "xlsx";

export default function AdminLogsSettings() {
    const [logs, setLogs] = useState(null);



    /**
     * Onmount
     */
    useEffect(() => {
        const getAll = async() => {
            const data = await fetchAllLogsWhereType("Settings");
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
            title: "Admin",
            render: (_, row) =>  row.admin ? `${row.admin.firstname} ${row.admin.lastname}` : "N/A",
            key: 'id',
        },
        {
            title: "Activity",
            dataIndex: 'settings_activity',
            key: 'id',
        },
        {
            title: "Discount",
            render: (_, row) =>  row.discount ? row.discount.discount_name : "N/A",
            key: 'id',
        },
        {
            title: "Old Value",
            render: (_, row) =>  row.old_discount_info ? row.old_discount_info : "N/A",
            key: 'id',
        },
        {
            title: "New Value",
            render: (_, row) =>  row.new_discount_info ? row.new_discount_info : "N/A",
            key: 'id',
        },
        {
            title: "Timestamp",
            render: (_, row) => formatDateTime(row.created_at),
            key: 'id',
        },
    ];



    /**
     * Handlers
     */
    const handlePrintAsExcel = () => {
        if (!logs || logs.length === 0) return;

        // Convert data to Excel format
        const exportData = logs.map((log) => ({
            "LOG ID": log.id,
            "Admin": log.admin ? `${log.admin.firstname} ${log.admin.lastname}` : "N/A",
            "Activity": log.settings_activity,            
            "Discount": log.discount ? log.discount.discount_name : "N/A",
            "Timestamp": formatDateTime(log.created_at),
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Audit Logs");

        // Download the file
        XLSX.writeFile(workbook, "settings_audit_logs.xlsx");
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
                    dataSource={logs}
                    pagination={{pageSize: 10}}
                    bordered
                    />
                </>
            )}
        </>
    );
}