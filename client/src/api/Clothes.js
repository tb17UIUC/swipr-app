import client from './client';

// CREATE LIKE
// CREATE DISLIKE
// FILTER AND FETCH

export const postOpinion = async ({ userId, clothingId, opinionType }) => {
    // Construct the payload to be sent in the POST request
    const payload = {
        userId: userId,
        clothingId: clothingId,
        opinionType: opinionType,
    };

    try {
        // Send the POST request with the payload
        await client.post('/create-opinion', payload);
        console.log('Opinion posted successfully!');
    } catch (err) {
        console.error('Error posting opinion:', err);
        throw err;
    }
};

export const getClothes = async ({ filter }) => {
    // Construct the payload to be sent in the POST request
    const payload = {
        userId: userId,
        clothingId: clothingId,
        opinionType: opinionType,
    };

    try {
        // Send the POST request with the payload
        await client.post('/create-opinion', payload);
        console.log('Opinion posted successfully!');
    } catch (err) {
        console.error('Error posting opinion:', err);
        throw err;
    }
};
