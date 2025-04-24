import axiosClient from "../axios-client";

export const fetchAllPurchaseRequests = async() => {
    try {
        const response = await axiosClient.get(`/get-all-purchase-request`);
        return response.data;
    } catch(error) {
        console.error(error);
        throw error;
    }
}