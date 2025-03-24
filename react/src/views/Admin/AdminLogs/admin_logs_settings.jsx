import { useEffect, useState } from "react";
import { fetchAllLogsWhereType } from "../../../Services/AdminLogsServices";
import {Spin, Table} from "antd";
import { formatDateTime } from "../../../assets/js/utils";

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
            title: "Timestamp",
            render: (_, row) => formatDateTime(row.created_at),
            key: 'id',
        },
    ]



    /**
     * Render
     */
    return(
        <>
            {!logs
            ? (<Spin size="large"/>)
            : (
                <Table
                columns={logsColumns}
                dataSource={logs}
                pagination={{pageSize: 10}}
                bordered
                />
            )}
        </>
    );
}