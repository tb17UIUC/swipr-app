// import identifySkinTone from '../helpers/skinTone';

module.exports = function (getPoolConnection) {
    const postOpinion = async (req, res) => {
        const { customerId, clothingId, opinionType } = req.body;
        const query = `
        INSERT INTO Opinions (Customer_Id, Clothing_Id, Opinion_Type) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE Opinion_Type = VALUES(Opinion_Type);`;
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

        const profilePictureBuffer = Buffer.from(profilePicture, 'base64');

        // implement identifyskintone
        // const { sc_h, sc_s, sc_v, matchingColors } =
        //     identifySkinTone(profilePictureBuffer);

        const sc_h = 0; // Assuming skin color values are determined elsewhere
        const sc_s = 0;
        const sc_v = 0;
        const matchingColors =
            'air_force_blue_raf,air_force_blue_usaf,air_superiority_blue,alabama_crimson,alice_blue,alizarin_crimson,alloy_orange,almond,amaranth,amber,amber_sae_ece,american_rose,amethyst,android_green,antique_brass,antique_fuchsia,antique_ruby,antique_white,anti_flash_white,ao_english';

        const callProcedure = 'CALL RegisterUser(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const params = [
            email,
            password,
            firstName,
            lastName,
            sc_h,
            sc_s,
            sc_v,
            universityId,
            matchingColors,
            profilePictureBuffer,
        ];

        try {
            const connection = await getPoolConnection();
            const [results] = await connection.query(callProcedure, params);

            console.log(results);

            // Assuming the SELECT statement in the stored procedure returns the customer_id
            const newCustomerId = results[0][0].CustomerId;

            res.status(201).send({
                message: 'Customer registered successfully',
                customerId: newCustomerId,
            });

            connection.release();
        } catch (error) {
            console.error('Error registering customer:', error);
            res.status(500).send('Error registering customer');
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

    const postPurchase = async (req, res) => {
        const { customerId, clothingId } = req.body;
        const query = `INSERT INTO Purchases (Customer_Id, Clothing_Id) VALUES (?, ?);`;
        const values = [customerId, clothingId];

        try {
            const connection = await getPoolConnection();
            await connection.query(query, values);
            res.status(201).send('Purchase recorded');
            connection.release();
        } catch (error) {
            console.error('Error posting purchase:', error);
            res.status(500).send('Error posting purchase');
        }
    };

    const postReview = async (req, res) => {
        const { customerId, clothingId, brand, starRating, fit, text } =
            req.body;
        const query = `INSERT INTO Reviews (Customer_Id, Clothing_Id, Brand, Star_Rating, Fit, Text) VALUES (?, ?, ?, ?, ?, ?);`;
        const values = [customerId, clothingId, brand, starRating, fit, text];

        try {
            const connection = await getPoolConnection();
            await connection.query(query, values);
            res.status(201).send('Review added successfully');
            connection.release();
        } catch (error) {
            console.error('Error posting review:', error);
            res.status(500).send('Error posting review');
        }
    };

    return {
        postOpinion,
        postCustomer,
        loginCustomer,
        postPurchase,
        postReview,
    };
};
