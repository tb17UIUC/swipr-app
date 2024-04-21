const axios = require('axios');
const client = axios.create({ baseURL: 'http://localhost:4029/api/' });

const getMatchesTest = async () => {
    const filter = {
        customerId: 1, // Assuming you're filtering by a specific customer ID
        brands: ['Nike', 'Adidas'], // Filtering by multiple brands
        // priceRange: [50, 200], // Assuming you want to filter by a price range, from $50 to $200
        type: ['Tops', 'Bottoms'], // Filtering by types
        // universities: [7, 16, 18, 22, 23, 32, 34, 39, 74], // Filtering by university IDs
        stars: 3, // Assuming you want items with an average star rating greater than 4
    };

    try {
        const response = await client.get('/clothes/get-filtered', {
            params: filter,
        });
        if (response.data && response.data.length > 0) {
            console.log('Filtered Clothes:', response.data.slice(0, 10)); // Log only the first 10 entries
        } else {
            console.log(
                'No clothes matched the filters or empty data received.'
            );
        }
    } catch (error) {
        console.error('Failed to retrieve clothes:', error);
    }
};

getMatchesTest(); // Execute the test function
