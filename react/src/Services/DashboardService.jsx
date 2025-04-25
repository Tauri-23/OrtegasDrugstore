import axiosClient from "../axios-client";

export const fetchAllRevenue = async() => {
    try {
        const response = await axiosClient.get('/get-all-revenues');
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const fetchAllMedicineCount = async() => {
    try {
        const response = await axiosClient.get('/get-all-medicine-count');
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const fetchAllMedicineShortage = async() => {
    try {
        const response = await axiosClient.get('/get-all-medicine-shortage');
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const fetchAllExpiringMedicine = async() => {
    try {
        const response = await axiosClient.get('/get-all-expiring-medicine');
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const fetchAllExpiredMedicine = async() => {
    try {
        const response = await axiosClient.get('/get-all-expired-medicine');
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}