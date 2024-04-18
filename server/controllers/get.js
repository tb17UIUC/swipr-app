const getClothes = (req, res) => {
    const { limit, brand, type, stars } = req.query;

    // SAMPLE QUERY HANDLING
    // let query = 'SELECT * FROM clothes WHERE 1 = 1';
    // if (brand) {
    //     query += ` AND brand = ${mysql.escape(brand)}`;
    // }
    // if (type) {
    //     query += ` AND type = ${mysql.escape(type)}`;
    // }
    // if (stars) {
    //     query += ` AND stars >= ${mysql.escape(stars)}`;
    // }
    // if (limit) {
    //     query += ` LIMIT ${mysql.escape(limit)}`;
    // }

    // connection.query(query, (error, results, fields) => {
    //     if (error) throw error;
    //     res.json(results);
    // });

    console.log('backend get clothes handled');
};

module.exports = getClothes;
