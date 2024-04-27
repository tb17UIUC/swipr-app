import client from './client';

export const postOpinion = async (opinionInfo) => {
    // Construct the payload to be sent in the POST request
    try {
        // Send the POST request with the payload
        await client.post('/opinions/create', opinionInfo);
        console.log('Opinion posted successfully!');
    } catch (err) {
        console.error('Error posting opinion:', err);
        throw err;
    }
};

export const updateOpinion = async (opinionInfo) => {
    // Construct the payload to be sent in the POST request
    try {
        const response = await client.put('/opinions/update', opinionInfo);
        if (response.status === 404) {
            console.error('No opinion found to update');
        } else {
            console.log('Opinion updated successfully!');
        }
    } catch (err) {
        console.error('Error posting opinion:', err);
        throw err;
    }
};

export const fetchCustomerActions = async (customerId) => {
    try {
        const response = await client.get(
            `/opinions/get-customer-opinions/${customerId}`
        );
        console.log('Fetched customer opinions successfully:', response.data);
        return response.data;
    } catch (err) {
        console.error('Error fetching customer opinions:', err);
        throw err;
    }
};

export const fetchClothingOpinions = async (clothingId) => {
    try {
        const response = await client.get(
            `/opinions/get-clothing-opinions/${clothingId}`
        );
        console.log('Fetched clothing opinions successfully:', response.data);
        return response.data;
    } catch (err) {
        console.error('Error fetching clothing opinions:', err);
        throw err;
    }
};

export const deleteOpinion = async (opinionInfo) => {
    try {
        const response = await client.delete('/opinions/delete', {
            data: opinionInfo,
        });
        if (response.status === 404) {
            console.error('No opinion found to delete');
        } else {
            console.log('Opinion deleted successfully');
        }
    } catch (error) {
        console.error('Error deleting opinion:', error);
        throw error;
    }
};
