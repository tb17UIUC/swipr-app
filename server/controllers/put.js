const updateCustomer = (req, res) => {
    const { firstName, lastName, email, password, userImage, universityId } =
        req.body;

    // const {sc_h, sc_s, sc_v} = colorAlgorithm(userImage);

    // const query =
    //     'INSERT INTO your_table_name (Email, Pwd, First_Name, Last_Name, Skin_Color_H, Skin_Color_S, Skin_Color_V, University_Id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    // const values = [email, password, firstName, lastName, sc_h, sc_s, sc_v, universityId ];

    // connection.query(query, values, (error, results, fields) => {
    //     if (error) {
    //         res.status(500).send('Error posting customer');
    //         throw error;
    //     }
    //     res.status(201).send('Customer added to database');
    // });

    console.log('backend customer update handled');
};

module.exports = { updateCustomer };
