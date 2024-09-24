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