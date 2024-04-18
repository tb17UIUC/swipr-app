module.exports = function (getPoolConnection) {
    const getFilteredClothes = async (req, res) => {
        try {
            const connection = await getPoolConnection();
            let query = 'SELECT * FROM Clothes'; // Sample query
            const [results] = await connection.query(query);
            res.json(results);
        } catch (error) {
            console.error('Failed to retrieve clothes:', error);
            res.status(500).send('Failed to retrieve clothes');
        } finally {
            connection.release();
        }
    };

    const getMatches = async (req, res) => {
        try {
            const connection = await getPoolConnection();
            let query = 'SELECT * FROM Clothes'; // Sample query
            const [results] = await connection.query(query);
            res.json(results);
        } catch (error) {
            console.error('Failed to retrieve matches:', error);
            res.status(500).send('Failed to retrieve matches');
        } finally {
            connection.release();
        }
    };

    const getFilterInfo = async (req, res) => {
        console.log('get filter info handled');
        res.send('Filter info');
    };

    return {
        getFilteredClothes,
        getMatches,
        getFilterInfo,
    };
};

// module.exports = function (getPoolConnection) {
//     const getFilteredClothes = async (req, res) => {
//         const { universityId, price, brand, type, stars, userId } = req.query;

//         let query = 'SELECT * FROM Clothes';
//         // if (universityId)
//         //     query += ` AND university = ${mysql.escape(universityId)}`;
//         // if (price) query += ` AND price <= ${mysql.escape(price)}`;
//         // if (brand) query += ` AND brand = ${mysql.escape(brand)}`;
//         // if (type) query += ` AND type = ${mysql.escape(type)}`;
//         // if (stars) query += ` AND stars >= ${mysql.escape(stars)}`;
//         // if (userId) query += ` AND userId = ${mysql.escape(userId)}`;

//         try {
//             const pool = await sqlInit(); // Get the pool
//             const connection = await pool.getConnection(); // Get a connection
//             const [results] = await connection.query(query);
//             res.json(results); // Sending back the results as JSON
//         } catch (error) {
//             console.error('Failed to retrieve clothes:', error);
//             res.status(500).send('Failed to retrieve clothes');
//         } finally {
//             if (connection) connection.release(); // Always release the connection
//         }
//     };

//     const getMatches = async (req, res) => {
//         const { userId } = req.query;

//         // console.log(userId);

//         // PULL ALL MATCHING COLORS FOR USER ID

//         // GET ALL OF CLOTHES OF THOSE MATCHING COLORS AND RETURN CLOTHES

//         // SAMPLE QUERY
//         // const query = `SELECT * FROM clothes WHERE userId = ${mysql.escape(
//         //     userId
//         // )}`;

//         let query = 'SELECT * FROM Clothes';

//         try {
//             const pool = await sqlInit(); // Get the pool

//             const connection = await pool.getConnection(); // Get a connection

//             const [results] = await connection.query(query);

//             res.json(results); // Sending back the results as JSON
//         } catch (error) {
//             console.error('Failed to retrieve clothes:', error);
//             res.status(500).send('Failed to retrieve clothes');
//         } finally {
//             if (connection) connection.release(); // Always release the connection
//         }

//         console.log('backend get clothes handled');
//     };

//     const getFilterInfo = async (req, res) => {
//         // SAMPLE QUERY
//         // const query = `SELECT * FROM clothes WHERE userId = ${mysql.escape(
//         //     userId
//         // )}`;

//         // connection.query(query, (error, results) => {
//         //     if (error) {
//         //         console.error('Failed to retrieve matches:', error);
//         //         return res.status(500).send('Failed to retrieve matches');
//         //     }
//         //     res.json(results); // Sending back the results as JSON
//         // });

//         console.log('get filter info handled');
//     };
// };
