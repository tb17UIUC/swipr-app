import clothes from '../test_data/test_clothes';
import client from './client';

// FILTER AND FETCH

export const getFilteredClothes = async (filters) => {
    return clothes;

    try {
        const response = await client.get('/clothes/get-filtered', {
            params: filters,
        });
        console.log(response.data); // Logging the response data
        return response.data;
    } catch (error) {
        console.error('Failed to retrieve clothes:', error);
    }
};

export const getMatches = async (userId) => {
    return clothes;

    try {
        const response = await client.get('/clothes/get-matches', {
            params: { userId },
        });
        console.log(response.data); // Logging the response data
        return response.data;
    } catch (error) {
        console.error('Failed to retrieve clothes:', error);
    }
};
