module.exports = function (getPoolConnection) {
    const postOpinion = async (req, res) => {
        const { customerId, clothingId, opinionType } = req.body;
        const query =
            'INSERT INTO Opinions (Customer_Id, Clothing_Id, Opinion_Type) VALUES (?, ?, ?)';
        const values = [customerId, clothingId, opinionType];

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
            profilePicture,
            universityId,
        } = req.body;

        // const customerData = {
        //     firstName: firstName,
        //     lastName: lastName,
        //     email: email,
        //     password: password,
        //     profilePicture: profilePicture,
        //     universityId: universityId,
        // };

        const profilePictureBuffer = Buffer.from(profilePicture, 'base64');

        // You might need to define pullSkinColor or ensure it's imported if used here.
        // const { sc_h, sc_s, sc_v } = identifySkinTone(profilePicture); // This is not defined yet so we are using 000 for testing
        const sc_h = 0;
        const sc_s = 0;
        const sc_v = 0;

        const query =
            'INSERT INTO Customers (Email, Pwd, First_Name, Last_Name, Profile_Picture, Skin_Color_H, Skin_Color_S, Skin_Color_V, University_Id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
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
        ];

        try {
            const connection = await getPoolConnection();
            const result = await connection.query(query, values);

            // Here, result.insertId should give you the id of the newly inserted record.
            const newCustomerId = result.insertId;

            res.status(201).send({
                message: 'Customer added to database',
                customerId: newCustomerId, // Send back the new Customer_Id
            });

            connection.release();
        } catch (error) {
            console.error('Error posting customer:', error);
            res.status(500).send('Error posting customer');
        }
    };

    const loginCustomer = async (req, res) => {
        const { email, password } = req.body;

        try {
            const connection = await getPoolConnection();
            // Update the query to also select the Customer_Id
            const query =
                'SELECT Pwd, Customer_Id FROM Customers WHERE Email = ?';
            const [result] = await connection.query(query, [email.trim()]);

            if (result.length === 0) {
                res.status(404).send('No user found with that email');
            } else {
                const storedPassword = result[0].Pwd;
                const customerId = result[0].Customer_Id;
                if (password === storedPassword) {
                    res.status(201).send({
                        message: 'Login successful',
                        customerId: customerId,
                    });
                } else {
                    res.status(401).send('Invalid credentials');
                }
            }
            connection.release();
        } catch (error) {
            console.error('Failed to login:', error);
            res.status(500).send('Internal server error');
        }
    };

    return { postOpinion, postCustomer, loginCustomer };
};
