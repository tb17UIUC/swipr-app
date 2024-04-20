module.exports = function (getPoolConnection) {
    const putCustomer = async (req, res) => {
        const {
            firstName,
            lastName,
            email,
            password,
            profilePicture,
            universityId,
        } = req.body;
        const customerId = req.params.id; // Extracting customerId from URL parameter

        const profilePictureBuffer = Buffer.from(profilePicture, 'base64');

        const { sc_h, sc_s, sc_v } = identifySkinTone(profilePictureBuffer);

        const query = `
        UPDATE Customers
        SET Email = ?, Pwd = ?, First_Name = ?, Last_Name = ?, Profile_Picture = ?, Skin_Color_H = ?, Skin_Color_S = ?, Skin_Color_V = ?, University_Id = ?
        WHERE Customer_Id = ?`;
        const values = [
            email,
            password,
            firstName,
            lastName,
            profilePictureBuffer,
            sc_h,
            sc_s,
            sc_v,
            universityId,
            customerId,
        ];

        try {
            const connection = await getPoolConnection();
            await connection.query(query, values);
            res.status(200).send('Customer updated successfully');
            connection.release();
        } catch (error) {
            console.error('Error updating customer:', error);
            res.status(500).send('Error updating customer');
        }
    };

    const putOpinion = async (req, res) => {
        const { customerId, clothingId, opinion } = req.body;
        const query =
            'UPDATE opinions SET Opinion_Type = ? WHERE Customer_Id = ? AND Clothing_Id = ?';
        const values = [opinion, customerId, clothingId];

        try {
            const connection = await getPoolConnection();
            const result = await connection.query(query, values);
            if (result.affectedRows === 0) {
                res.status(404).send('No opinion found to update');
            } else {
                res.status(200).send('Opinion updated successfully');
            }
            connection.release();
        } catch (error) {
            console.error('Error updating opinion:', error);
            res.status(500).send('Error updating opinion');
        }
    };

    return { putCustomer, putOpinion };
};
