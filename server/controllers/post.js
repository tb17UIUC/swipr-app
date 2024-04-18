const postOpinion = (req, res) => {
    const { userId, clothesId, opinion } = req.body;

    // const query =
    //     'INSERT INTO opinions (userId, clothesId, opinion) VALUES (?, ?, ?)';
    // const values = [userId, clothesId, opinion];

    // connection.query(query, values, (error, results, fields) => {
    //     if (error) {
    //         res.status(500).send('Error posting opinion');
    //         throw error;
    //     }
    //     res.status(201).send('Opinion added');
    // });

    console.log('backend opinions post handled');
};

module.exports = postOpinion;
