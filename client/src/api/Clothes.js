// import clothes from '../test_data/test_clothes';
import client from './client';

// FILTER AND FETCH

export const getFilteredClothes = async (filters) => {
    // console.log(filters);

    try {
        const response = await client.get('/clothes/get-filtered', {
            params: filters,
        });
        // console.log(response.data); // Logging the response data
        return response.data;
    } catch (error) {
        console.error('Failed to retrieve clothes:', error);
    }
};

export const getMatches = async (filters) => {
    try {
        const response = await client.get('/clothes/get-matches', {
            params: filters,
        });
        // console.log(response.data); // Logging the response data
        return response.data;
    } catch (error) {
        console.error('Failed to retrieve clothes:', error);
    }
};

export const updateClothing = async (clothingId, clothingData) => {
    try {
        const response = await client.put(
            `/clothes/update/${clothingId}`,
            clothingData
        );
        return response.data;
    } catch (error) {
        console.error('Failed to update clothing:', error);
        throw error;
    }
};

export const deleteClothing = async (clothingId) => {
    try {
        const response = await client.delete(`/clothes/delete/${clothingId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to delete clothing:', error);
        throw error;
    }
};
