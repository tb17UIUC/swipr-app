import client from './client';

// FILTER AND FETCH

export const getFilterInfo = async (filters) => {
    try {
        const response = await client.get('/filters/get-info');
        // console.log(response.data); // Logging the response data
        return response.data;
    } catch (error) {
        console.error('Failed to retrieve filter info:', error);
    }
};

// return {
//     brands: ['Nike', 'Adidas', 'Uniqlo'],
//     universities: ['UIUC', 'UCLA', 'Syracuse', 'Harvard'],
//     maxPrice: 500,
//     minPrice: 24,
// };
