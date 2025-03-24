import axiosClient from "../axios-client";

/**
 * 
 * @param {string} type - Inventory | Sale | Settings
 * @returns object[]
 */
export const fetchAllLogsWhereType = async(type) => {
    try {
        const response = await axiosClient.get(`/get-all-audit-logs-where-type/${type}`);
        return response.data;
    } catch (error) {
        console.error('Failed fetching medicine groups : ', error);
        throw error;
    }
}