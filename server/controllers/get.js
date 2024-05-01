const shuffleArray = require('../helpers/shuffle');

module.exports = function (getPoolConnection) {
    const getFilteredClothes = async (req, res) => {
        const { customerId, brands, universities, priceRange, type, stars } =
            req.query;

        // console.log('ewbjibourebqoiebqorboigb');
        // console.log(customerId, brands, universities, priceRange, type, stars);
        // console.log(req.query);

        let params = [];
        let conditions = ['(1=1'];

        try {
            const connection = await getPoolConnection();

            if (customerId) {
                conditions.push('M.Customer_Id = ?');
                params.push(customerId);
            }

            if (brands && brands.length) {
                conditions.push(
                    `C.Brand IN (${brands.map(() => '?').join(', ')})`
                );
                params.push(...brands);
            }

            if (priceRange) {
                conditions.push('C.Price > ? AND C.Price < ?');
                params.push(priceRange[0], priceRange[1]);
            }

            if (type && type.length) {
                conditions.push(
                    `C.Type IN (${type.map(() => '?').join(', ')})`
                );
                params.push(...type);
            }

            if (universities && universities.length) {
                let subParams = universities.map(() => '?').join(', ');
                let subquery = `SELECT O.Clothing_Id FROM Opinions O WHERE O.Opinion_Type = 'L' AND O.Customer_Id IN (SELECT Cc.Customer_Id FROM Customers Cc WHERE Cc.University_Id IN (${subParams}))`;
                conditions.push(`C.Clothing_Id IN (${subquery})`);
                params.push(...universities);
            }

            let query = `SELECT DISTINCT C.* FROM Matches M JOIN Clothes C ON C.Clothing_Color = M.Color_Name LEFT JOIN Reviews R ON R.Clothing_Id = C.Clothing_Id WHERE ${conditions.join(
                ') AND ('
            )})`;

            if (stars) {
                query +=
                    ' GROUP BY C.Clothing_Id HAVING AVG(R.Star_Rating) > ?;';
                params.push(stars);
            }

            // console.log(params, conditions);

            // console.log(query);
            const [results] = await connection.query(query, params);
            // console.log(results);
            res.json(results);
            connection.release();
        } catch (error) {
            console.error('Failed to retrieve clothes:', error);
            res.status(500).send('Failed to retrieve clothes');
        }
    };

    const getClothesById = async (req, res) => {
        try {
            const { id } = req.query;
            // console.log(id)
            // console.log(customerId, typeof customerId);
            const connection = await getPoolConnection();
            let query = `SELECT C.Clothing_Id, C.Name, C.Clothing_Color, C.Brand, C.Type, C.Price, C.Image, C.URL FROM Clothes C WHERE C.Clothing_Id = ${id}`;
            // console.log(query);
            const [results] = await connection.query(query);
            //shuffleArray(results);
            res.json(results);
            connection.release();
        } catch (error) {
            console.error('Failed to retrieve matches:', error);
            res.status(500).send('Failed to retrieve matches');
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

    const readReview = async (req, res) => {
        const clothingId = req.params.id;
        try {
            const connection = await getPoolConnection();
            let query = `SELECT Clothing_Id, Brand, Star_Rating, Fit, Text FROM Reviews WHERE Clothing_Id = ?`;
            const [results] = await connection.execute(query, [clothingId]);
            res.json(results);
            connection.release();
        } catch (error) {
            console.error('Failed to retrieve reviews:', error);
            res.status(500).send('Failed to retrieve reviews');
        }
    };

    const filterReview = async (req, res) => {
        const {
            MaxPrice,
            MinPrice,
            Sustainability,
            Brand,
            MIUSA,
            MO,
            Star_Rating,
        } = req.query;

        // console.log(req.body);
        // console.log(req.params);
        // console.log(req.query);
        // console.log(
        //     MaxPrice,
        //     MinPrice,
        //     Sustainability,
        //     Brand,
        //     MIUSA,
        //     MO,
        //     Star_Rating
        // );

        const query = `CALL Final_FilterReviews_t(?,?,?,?,?,?,?)`;
        const values = [
            MaxPrice,
            MinPrice,
            Sustainability,
            Brand,
            MIUSA,
            MO,
            Star_Rating,
        ];
        try {
            const connection = await getPoolConnection();
            const [results] = await connection.query(query, values);
            res.json(results);
            // console.log(results);
            connection.release();
        } catch (error) {
            console.error('Error filtering review:', error);
            res.status(500).send('Error filtering review');
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

    const getCustomerActions = async (req, res) => {
        const customerId = req.params.id;

        try {
            const connection = await getPoolConnection();
            let query = `
            SELECT 
                O.Clothing_Id, 
                C.Name, 
                C.Brand, 
                C.Type, 
                C.Price, 
                C.Image, 
                C.URL, 
                O.Opinion_Type,
                CASE WHEN P.Clothing_Id IS NOT NULL THEN TRUE ELSE FALSE END AS Purchased
            FROM Opinions O
            JOIN Clothes C ON O.Clothing_Id = C.Clothing_Id
            LEFT JOIN Purchases P ON O.Clothing_Id = P.Clothing_Id AND O.Customer_Id = P.Customer_Id
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
        SELECT Customer_Id, Email, First_Name, Last_Name, University_Id, TO_BASE64(Profile_Picture) as Profile_Picture, Skin_Color_H, Skin_Color_S, Skin_Color_V
        FROM Customers
        WHERE Customer_Id = ?
    `;
        try {
            const connection = await getPoolConnection();
            const [result] = await connection.query(query, [customerId]);

            if (result.length > 0) {
                const customerInfo = result[0];

                if (customerInfo.Profile_Picture) {
                    const base64Image =
                        customerInfo.Profile_Picture.toString('base64');
                    customerInfo.Profile_Picture = `data:image/jpeg;base64,${base64Image}`;
                }

                // console.log(customerInfo);

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
        getClothesById,
        getMatches,
        readReview,
        filterReview,
        getFilterInfo,
        getCustomerActions,
        getClothingOpinions,
        getCustomerInfo,
    };
};
