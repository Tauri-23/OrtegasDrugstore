import axiosClient from "../axios-client";

export const fetchAllMedGroups = async() => {
    try {
        const response = await axiosClient.get('/get-all-medicine');
        return response.data;
    } catch (error) {
        console.error('Failed fetching medicine groups : ', error);
        throw error;
    }
}



export const fetchMedGroupById = async(medGpId) => {
    try {
        const response = await axiosClient.get(`/get-all-med-group-where-id/${medGpId}`);
        return response.data;
    } catch (error) {
        console.error('Failed fetching medicine groups : ', error);
        throw error;
    }
}