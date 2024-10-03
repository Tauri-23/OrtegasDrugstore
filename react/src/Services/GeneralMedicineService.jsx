import axiosClient from "../axios-client";

export const fetchAllMedicinesFull = async() => {
    try {
        const response = await axiosClient.get('/get-all-medicines-full');
        return response.data;
    } catch(error) {
        console.error('Failed fetching all medicines : ', error);
        throw error;
    }
}

export const fetchMedicineFullInfoById = async(medId) => {
    try {
        const response = await axiosClient.get(`/get-medicine-info-full-by-id/${medId}`);
        return response.data;
    } catch(error) {
        console.error('Failed fetching all medicines : ', error);
        throw error;
    }
}