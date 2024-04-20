const shuffleArray = require('../helpers/shuffle');

module.exports = function (getPoolConnection) {
    const getFilteredClothes = async (req, res) => {
        const { customerId, brand, universities, priceRange, type, stars } =
            req.query;

        try {
            const connection = await getPoolConnection();
            let query =
                'SELECT DISTINCT C.* FROM Matches M JOIN Clothes C ON C.Clothing_Color = M.Color_Name LEFT JOIN Reviews R ON R.Clothing_Id = C.Clothing_Id WHERE (1=1';
            if (customerId) {
                query += ` AND M.Customer_Id = ${customerId}`;
            }
            if (brand) {
                query += ' AND (';
                for (let i = 0; i < brand.length; i++) {
                    let the_brand = brand[i];
                    if (i == brand.length - 1) {
                        query += ` C.Brand = '${the_brand}'`;
                    } else {
                        query += ` C.Brand = '${the_brand}' OR`;
                    }
                }
                query += ' )';
            }
            if (priceRange) {
                query += ` AND C.Price > ${priceRange[0]} AND C.Price < ${priceRange[1]}`;
            }
            if (type) {
                query += ' AND (';
                for (let i = 0; i < type.length; i++) {
                    let the_type = type[i];
                    if (i == type.length - 1) {
                        query += ` C.Type = '${the_type}'`;
                    } else {
                        query += ` C.Type = '${the_type}' OR`;
                    }
                }
                query += ' )';
            }
            query += ')';
            if (universities) {
                subquery =
                    "SELECT O.Clothing_Id FROM Opinions O WHERE O.Opinion_Type = 'L' AND O.Customer_Id IN (SELECT Cc.Customer_Id FROM Customers Cc WHERE";
                for (let i = 0; i < universities.length; i++) {
                    let the_uni = universities[i];
                    if (i == universities.length - 1) {
                        subquery += ` Cc.University_Id = ${the_uni}`;
                    } else {
                        subquery += ` Cc.University_Id = ${the_uni} OR`;
                    }
                }
                subquery += ' )';
                query += ` OR (C.Clothing_Id IN (${subquery}))`;
            }
            if (stars) {
                query += ` GROUP BY C.Clothing_Id HAVING AVG(R.Star_Rating) > ${stars}`;
            }

            console.log(query);
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
            const { customerId } = req.query;
            // console.log(customerId, typeof customerId);
            const connection = await getPoolConnection();
            let query = `SELECT C.Clothing_Id, C.Name, C.Clothing_Color, C.Brand, C.Type, C.Price, C.Image, C.URL FROM Matches M JOIN Clothes C ON C.Clothing_Color = M.Color_Name WHERE M.Customer_Id = ${customerId.trim()} LIMIT 200`;
            // console.log(query);
            const [results] = await connection.query(query);
            shuffleArray(results);
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

    const getCustomerOpinions = async (req, res) => {
        const customerId = req.params.id;

        try {
            const connection = await getPoolConnection();
            let query = `
                SELECT O.Clothing_Id, C.Name, C.Brand, C.Type, C.Price, C.Image, C.URL, O.Opinion_Type
                FROM Opinions O
                JOIN Clothes C ON O.Clothing_Id = C.Clothing_Id
                WHERE O.Customer_Id = ?
            `;
            const [results] = await connection.execute(query, [customerId]);
            res.json(results);
            connection.release();
        } catch (error) {
            console.error('Failed to retrieve opinions:', error);
            res.status(500).send('Failed to retrieve opinions');
        }
    };

    const getClothingOpinions = async (req, res) => {
        const clothingId = req.params.id;

        // console.log(clothingId);

        try {
            const connection = await getPoolConnection();
            let query = `
                SELECT 
                    SUM(CASE WHEN Opinion_Type = 'L' THEN 1 ELSE 0 END) AS like_count,
                    SUM(CASE WHEN Opinion_Type = 'D' THEN 1 ELSE 0 END) AS dislike_count,
                    SUM(CASE WHEN Opinion_Type = 'S' THEN 1 ELSE 0 END) AS superlike_count
                FROM Opinions
                WHERE Clothing_Id = ?
            `;
            const [results] = await connection.execute(query, [clothingId]);

            // console.log(results);

            res.json({
                like_count: results[0].like_count || 0,
                dislike_count: results[0].dislike_count || 0,
                superlike_count: results[0].superlike_count || 0,
            });
            connection.release();
        } catch (error) {
            console.error('Failed to retrieve clothing opinions:', error);
            res.status(500).send('Failed to retrieve clothing opinions');
        }
    };

    const getCustomerInfo = async (req, res) => {
        const customerId = req.params.id;

        const query = `
        SELECT Customer_Id, Email, First_Name, Last_Name, University_Id, TO_BASE64(Profile_Picture) as Profile_Picture
        FROM Customers
        WHERE Customer_Id = ?
    `;

        try {
            const connection = await getPoolConnection();
            const [result] = await connection.query(query, [customerId]);

            if (result.length > 0) {
                const customerInfo = result[0];
                res.status(200).send(customerInfo);
            } else {
                res.status(404).send({ message: 'Customer not found' });
            }

            connection.release();
        } catch (error) {
            console.error('Error fetching customer info:', error);
            res.status(500).send('Error fetching customer info');
        }
    };

    return {
        getFilteredClothes,
        getMatches,
        getFilterInfo,
        getCustomerOpinions,
        getClothingOpinions,
        getCustomerInfo,
    };
};

// module.exports = function (getPoolConnection) {
//     const getFilteredClothes = async (req, res) => {
//         const { universityId, price, brand, type, stars, customerId } = req.query;

//         let query = 'SELECT * FROM Clothes';
//         // if (universityId)
//         //     query += ` AND university = ${mysql.escape(universityId)}`;
//         // if (price) query += ` AND price <= ${mysql.escape(price)}`;
//         // if (brand) query += ` AND brand = ${mysql.escape(brand)}`;
//         // if (type) query += ` AND type = ${mysql.escape(type)}`;
//         // if (stars) query += ` AND stars >= ${mysql.escape(stars)}`;
//         // if (customerId) query += ` AND customerId = ${mysql.escape(customerId)}`;

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
//         const { customerId } = req.query;

//         // console.log(customerId);

//         // PULL ALL MATCHING COLORS FOR USER ID

//         // GET ALL OF CLOTHES OF THOSE MATCHING COLORS AND RETURN CLOTHES

//         // SAMPLE QUERY
//         // const query = `SELECT * FROM clothes WHERE customerId = ${mysql.escape(
//         //     customerId
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
//         // const query = `SELECT * FROM clothes WHERE customerId = ${mysql.escape(
//         //     customerId
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
