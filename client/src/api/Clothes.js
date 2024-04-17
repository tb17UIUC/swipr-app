import client from './client';

export const test_api = async () => {
    try {
        await client.get(`/get-clothes`);
    } catch (err) {
        console.error('Error fetching logo details:', err);
        throw err;
    }
};
