import client from './client';

export const postPurchase = async (purchaseInfo) => {
    try {
        await client.post('/purchases/create', purchaseInfo);
        console.log('Purchase posted successfully!');
    } catch (err) {
        console.error('Error posting purchase:', err);
        throw err;
    }
};

export const deletePurchase = async (purchaseInfo) => {
    try {
        const response = await client.delete('/purchases/delete', {
            data: purchaseInfo,
        });
        if (response.status === 404) {
            console.error('No purchase found to delete');
        } else {
            console.log('Purchase deleted successfully');
        }
    } catch (error) {
        console.error('Error deleting purchase:', error);
        throw error;
    }
};
