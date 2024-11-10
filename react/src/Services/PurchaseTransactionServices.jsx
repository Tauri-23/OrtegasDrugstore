import axiosClient from "../axios-client";

export const fetchAllFullPurchaseTransactions = async() => {
    try {
        const response = await axiosClient.get('/get-all-full-purchase-transactions');
        return response.data;
    } catch(error) {
        console.error(error);
        throw error;
    }
}

export const fetchAllPurchasTransactionsWhereDateRange = async(fromDate, toDate) => {
    try {
        const response = await axiosClient.get(`/get-all-full-purchase-transactions-where-date-range/${fromDate}/${toDate}`);
        return response.data;
    } catch(error) {
        console.error(error);
        throw error;
    }
}

export const fetchNecessaryForReport = async(month, year) => {
    try {
        const response = await axiosClient.get(`/get-necessary-data-for-report/${month}/${year}`);
        return response.data;
    } catch(error) {
        console.error(error);
        throw error;
    }
}
