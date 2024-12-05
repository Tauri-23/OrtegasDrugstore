import axiosClient from "../axios-client";

export const fetchAllForecast = async() => {
    try {
        const response = await axiosClient.get('/get-forecasted-data');
        return response.data;
    } catch (error) {
        console.error('Failed fetching medicine groups : ', error);
        throw error;
    }
}

export const fetchAllForecastWhereMedicine = async(medicineId) => {
    try {
        const response = await axiosClient.get(`/get-forecasted-data-where-medicine/${medicineId}`);
        return response.data;
    } catch (error) {
        console.error('Failed fetching medicine groups : ', error);
        throw error;
    }
}