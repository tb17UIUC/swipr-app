module.exports = function (getPoolConnection) {
    const deleteOpinion = async (req, res) => {
        const { customerId, clothingId } = req.body;
        const query =
            'DELETE FROM Opinions WHERE Customer_Id = ? AND Clothing_Id = ?';
        const values = [customerId, clothingId];

        try {
            const connection = await getPoolConnection();
            const result = await connection.query(query, values);
            connection.release();
            if (result.affectedRows === 0) {
                res.status(404).send('No opinion found to delete'); // No rows affected means no opinion was found
            } else {
                res.status(200).send('Opinion deleted successfully'); // Success response
            }
        } catch (error) {
            console.error('Error deleting opinion:', error);
            res.status(500).send('Error deleting opinion');
        }
    };

    const deletePurchase = async (req, res) => {
        const { customerId, clothingId } = req.body;
        const query =
            'DELETE FROM Purchases WHERE Customer_Id = ? AND Clothing_Id = ?';
        const values = [customerId, clothingId];

        try {
            const connection = await getPoolConnection();
            const result = await connection.query(query, values);
            connection.release();
            if (result.affectedRows === 0) {
                res.status(404).send('No purchase found to delete'); // No rows affected means no purchase was found
            } else {
                res.status(200).send('Purchase deleted successfully'); // Success response
            }
        } catch (error) {
            console.error('Error deleting purchase:', error);
            res.status(500).send('Error deleting purchase');
        }
    };

    const deleteReview = async (req, res) => {
        const { reviewId } = req.body;
        const query = `DELETE FROM Reviews WHERE Review_Id = ?;`;

        try {
            const connection = await getPoolConnection();
            const result = await connection.query(query, [reviewId]);
            if (result.affectedRows === 0) {
                res.status(404).send('No review found');
            } else {
                res.status(200).send('Review deleted successfully');
            }
            connection.release();
        } catch (error) {
            console.error('Error deleting review:', error);
            res.status(500).send('Error deleting review');
        }
    };

    const deleteCustomer = async (req, res) => {
        const { customerId } = req.body;
        const query = 'DELETE FROM Customers WHERE Customer_Id = ?';

        try {
            const connection = await getPoolConnection();
            const result = await connection.query(query, [customerId]);
            connection.release();
            if (result.affectedRows === 0) {
                res.status(404).send('No customer found to delete');
            } else {
                res.status(200).send('Customer deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
            res.status(500).send('Error deleting customer');
        }
    };

    const deleteClothing = async (req, res) => {
        const { clothingId } = req.body;
        const query = 'DELETE FROM Clothes WHERE Clothing_Id = ?';

        try {
            const connection = await getPoolConnection();
            const result = await connection.query(query, [clothingId]);
            connection.release();
            if (result.affectedRows === 0) {
                res.status(404).send('No clothing found to delete');
            } else {
                res.status(200).send('Clothing deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting clothing:', error);
            res.status(500).send('Error deleting clothing');
        }
    };

    return {
        deleteOpinion,
        deletePurchase,
        deleteReview,
        deleteCustomer,
        deleteClothing,
    };
};
