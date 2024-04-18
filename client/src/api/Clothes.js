import client from './client';

// FILTER AND FETCH

export const getFilteredClothes = async (filters) => {
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
