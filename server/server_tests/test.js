const axios = require('axios');
const client = axios.create({ baseURL: 'http://localhost:4029/api/' });

const getMatchesTest = async () => {
    try {
        const response = await client.get('/clothes/get-matches', {
            params: { customerId: 1 },
        });
        console.log(response.data); // Logging the response data // console.log('hello'); // return response.data;
    } catch (error) {
        console.error('Failed to retrieve clothes:', error);
    }
};

getMatchesTest(); // Execute the test function
