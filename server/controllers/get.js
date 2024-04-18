const getFilteredClothes = (req, res) => {
    const { university, price, brand, type, stars, userId } = req.query;

    // SAMPLE QUERYING
    // let query = 'SELECT * FROM clothes WHERE 1=1';

    // if (university) query += ` AND university = ${mysql.escape(university)}`;
    // if (price) query += ` AND price <= ${mysql.escape(price)}`;
    // if (brand) query += ` AND brand = ${mysql.escape(brand)}`;
    // if (type) query += ` AND type = ${mysql.escape(type)}`;
    // if (stars) query += ` AND stars >= ${mysql.escape(stars)}`;
    // if (userId) query += ` AND userId = ${mysql.escape(userId)}`;

    // connection.query(query, (error, results) => {
    //     if (error) {
    //         console.error('Failed to retrieve clothes:', error);
    //         return res.status(500).send('Failed to retrieve clothes');
    //     }
    //     res.json(results); // Sending back the results as JSON
    // });

    // console.log('Executed getFilteredClothes:', query);

    console.log(university, price, brand, type, stars, userId);

    console.log('backend get clothes handled');
};

const getMatches = (req, res) => {
    const { userId } = req.query;

    console.log(userId);

    // SAMPLE QUERY
    // const query = `SELECT * FROM clothes WHERE userId = ${mysql.escape(
    //     userId
    // )}`;

    // connection.query(query, (error, results) => {
    //     if (error) {
    //         console.error('Failed to retrieve matches:', error);
    //         return res.status(500).send('Failed to retrieve matches');
    //     }
    //     res.json(results); // Sending back the results as JSON
    // });

    console.log('backend get clothes handled');
};

const getFilterInfo = (req, res) => {
    // SAMPLE QUERY
    // const query = `SELECT * FROM clothes WHERE userId = ${mysql.escape(
    //     userId
    // )}`;

    // connection.query(query, (error, results) => {
    //     if (error) {
    //         console.error('Failed to retrieve matches:', error);
    //         return res.status(500).send('Failed to retrieve matches');
    //     }
    //     res.json(results); // Sending back the results as JSON
    // });

    console.log('get filter info handled');
};

module.exports = { getFilteredClothes, getMatches, getFilterInfo };
