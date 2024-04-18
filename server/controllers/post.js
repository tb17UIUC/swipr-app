module.exports = function (getPoolConnection) {
    const postOpinion = async (req, res) => {
        const { userId, clothesId, opinion } = req.body;
        const query =
            'INSERT INTO opinions (userId, clothesId, opinion) VALUES (?, ?, ?)';
        const values = [userId, clothesId, opinion];

        try {
            const connection = await getPoolConnection();
            await connection.query(query, values);
            res.status(201).send('Opinion added');
            connection.release();
        } catch (error) {
            console.error('Error posting opinion:', error);
            res.status(500).send('Error posting opinion');
        }
    };

    const postCustomer = async (req, res) => {
        const {
            firstName,
            lastName,
            email,
            password,
            userImage,
            universityId,
        } = req.body;
        // You might need to define pullSkinColor or ensure it's imported if used here.
        const { sc_h, sc_s, sc_v } = pullSkinColor(userImage); // Ensure this function is defined/imported.

        const query =
            'INSERT INTO your_table_name (Email, Pwd, First_Name, Last_Name, Skin_Color_H, Skin_Color_S, Skin_Color_V, University_Id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [
            email,
            password,
            firstName,
            lastName,
            sc_h,
            sc_s,
            sc_v,
            universityId,
        ];

        try {
            const connection = await getPoolConnection();
            await connection.query(query, values);
            res.status(201).send('Customer added to database');
            connection.release();
        } catch (error) {
            console.error('Error posting customer:', error);
            res.status(500).send('Error posting customer');
        }
    };

    return { postOpinion, postCustomer };
};
