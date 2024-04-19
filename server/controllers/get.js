module.exports = function (getPoolConnection) {
    const getFilteredClothes = async (req, res) => {
        try {
            const connection = await getPoolConnection();
            let query = 'SELECT * FROM Clothes'; // Sample query
            const [results] = await connection.query(query);
            res.json(results);
            connection.release();
        } catch (error) {
            console.error('Failed to retrieve clothes:', error);
            res.status(500).send('Failed to retrieve clothes');
        }
    };

    const getMatches = async (req, res) => {
        try {
            const { userId } = req.query;
            // console.log(userId, typeof userId);
            const connection = await getPoolConnection();
            let query = `SELECT C.Clothing_Id, C.Name, C.Clothing_Color, C.Brand, C.Type, C.Price, C.Image, C.URL FROM Matches M JOIN Clothes C ON C.Clothing_Color = M.Color_Name WHERE M.Customer_Id = ${userId} LIMIT 200`;
            // console.log(query);
            const [results] = await connection.query(query);
            res.json(results);
            connection.release();
        } catch (error) {
            console.error('Failed to retrieve matches:', error);
            res.status(500).send('Failed to retrieve matches');
        }
    };

    const getFilterInfo = async (req, res) => {
        try {
            const connection = await getPoolConnection();
            let query =
                'SELECT University_Id, University_Name FROM Universities';
            const [universityResults] = await connection.query(query);
            connection.release();

            const connection1 = await getPoolConnection();
            let query1 = 'SELECT Brand_Name FROM Brands';
            const [brandResults] = await connection1.query(query1);
            connection1.release();

            const connection2 = await getPoolConnection();
            let query2 = 'SELECT MAX(Price) AS maxPrice FROM Clothes';
            const [maxpriceresults] = await connection1.query(query2);
            connection2.release();

            const connection3 = await getPoolConnection();
            let query3 = 'SELECT MIN(Price) AS minPrice FROM Clothes';
            const [minpriceresults] = await connection1.query(query3);
            connection3.release();

            res.json({
                universities: universityResults,
                brands: brandResults,
                maxPrice: maxpriceresults,
                minPrice: minpriceresults,
            });

            // console.log({
            //     universities: universityResults,
            //     brands: brandResults,
            //     maxPrice: maxpriceresults,
            //     minPrice: minpriceresults,
            // });
            const connection4 = await getPoolConnection();
            connection4.release();
        } catch (error) {
            console.error('Error in getFilterInfo:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
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
