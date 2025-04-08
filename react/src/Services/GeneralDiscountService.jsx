import axiosClient from "../axios-client";

export const fetchAllDiscounts = async() => {
    try {
        const response = await axiosClient.get('/get-all-discount');
        return response.data;
    } catch (error) {
        console.error('Failed fetching medicine groups : ', error);
        throw error;
    }
}

export const fetchAllEnabledDiscounts = async() => {
    try {
        const response = await axiosClient.get('/get-all-enabled-discount');
        return response.data;
    } catch (error) {
        console.error('Failed fetching medicine groups : ', error);
        throw error;
    }
}