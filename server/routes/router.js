// const express = require('express');
// const router = express.Router();
// const bodyParser = require('body-parser');

// router.use(bodyParser.json());

// const {
//     getFilteredClothes,
//     getMatches,
//     getFilterInfo,
// } = require('../controllers/get');
// const { postOpinion, postCustomer } = require('../controllers/post');
// const { updateCustomer } = require('../controllers/put');

// router.get('/api/clothes/get-filtered', getFilteredClothes);
// router.get('/api/clothes/get-matches', getMatches);

// router.post('/api/opinion/create', bodyParser.json(), postOpinion);

// router.post('/api/customer/create', bodyParser.json(), postCustomer);
// router.put('/api/customer/create', bodyParser.json(), updateCustomer);

// router.get('/api/filters/get-info', getFilterInfo);

// module.exports = router;

module.exports = function (getPoolConnection) {
    const express = require('express');
    const router = express.Router();
    const bodyParser = require('body-parser');

    router.use(bodyParser.json());

    // Import controllers with the connection pool handler
    const {
        getFilteredClothes,
        getMatches,
        getFilterInfo,
        getClothingOpinions,
        getCustomerOpinions,
        getCustomerInfo,
    } = require('../controllers/get')(getPoolConnection);
    const { postOpinion, postCustomer, loginCustomer } =
        require('../controllers/post')(getPoolConnection);
    const { putCustomer, putOpinion } =
        require('../controllers/put')(getPoolConnection);
    const { deleteOpinion } = require('../controllers/delete')(
        getPoolConnection
    );

    router.get('/api/clothes/get-filtered', getFilteredClothes);
    router.get('/api/clothes/get-matches', getMatches);

    router.post('/api/opinions/create', bodyParser.json(), postOpinion);
    router.get('/api/opinions/get-customer-opinions/:id', getCustomerOpinions);
    router.get('/api/opinions/get-clothing-opinions/:id', getClothingOpinions);
    router.put('/api/opinions/update', bodyParser.json(), putOpinion);
    router.delete('/api/opinions/delete', bodyParser.json(), deleteOpinion);

    router.post('/api/customer/register', bodyParser.json(), postCustomer);
    router.get('/api/customer/info/:id', getCustomerInfo);
    router.post('/api/customer/login', bodyParser.json(), loginCustomer);
    router.put('/api/customer/update/:id', bodyParser.json(), putCustomer);

    router.get('/api/filters/get-info', getFilterInfo);

    return router;
};
