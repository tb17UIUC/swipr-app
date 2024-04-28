import client from './client';

export const createReview = async (reviewInfo) => {
    try {
        await client.post('/reviews/create', reviewInfo);
        console.log('Review posted successfully!');
    } catch (err) {
        console.error('Error posting review:', err);
        throw err;
    }
};

export const deleteReview = async (reviewId) => {
    try {
        const response = await client.delete('/reviews/delete', {
            data: { reviewId },
        });
        if (response.status === 404) {
            console.error('No review found to delete');
        } else {
            console.log('Review deleted successfully');
        }
    } catch (error) {
        console.error('Error deleting review:', error);
        throw error;
    }
};

export const readReview = async (clothingId) => {
    try {
        const response = await client.get(
            `/reviews/read/${clothingId}`
        );
        return response.data;
    } catch (error) {
        console.error('Failed to retrieve review:', error);
    }
}
