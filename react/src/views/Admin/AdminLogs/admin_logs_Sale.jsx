import { useEffect, useState } from "react";
import { fetchAllLogsWhereType } from "../../../Services/AdminLogsServices";
import {Spin, Table} from "antd";
import { formatDateTime, formatToPhilPeso } from "../../../assets/js/utils";

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
                dataSource={logs.map((item) => ({...item, key: item.id}))}
                pagination={{pageSize: 10}}
                bordered
                />
            )}
        </>
    );
}