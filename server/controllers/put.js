module.exports = function (getPoolConnection) {
    const updateCustomer = async (req, res) => {
        const {
            firstName,
            lastName,
            email,
            password,
            userImage,
            universityId,
        } = req.body;
        // Ensure colorAlgorithm is defined/imported if used here.
        // const {sc_h, sc_s, sc_v} = colorAlgorithm(userImage);

        const query =
            'UPDATE your_table_name SET Email = ?, Pwd = ?, First_Name = ?, Last_Name = ?, Skin_Color_H = ?, Skin_Color_S = ?, Skin_Color_V = ?, University_Id = ? WHERE UserId = ?';
        const values = [
            email,
            password,
            firstName,
            lastName,
            sc_h,
            sc_s,
            sc_v,
            universityId,
            userId,
        ]; // Ensure userId is provided for update operation

        try {
            const connection = await getPoolConnection();
            await connection.query(query, values);
            res.status(200).send('Customer updated successfully');
        } catch (error) {
            console.error('Error updating customer:', error);
            res.status(500).send('Error updating customer');
        } finally {
            connection.release();
        }
    };

    return { updateCustomer };
};
