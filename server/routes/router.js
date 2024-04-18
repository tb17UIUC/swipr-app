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
    const { getFilteredClothes, getMatches, getFilterInfo } =
        require('../controllers/get')(getPoolConnection);
    const { postOpinion, postCustomer } = require('../controllers/post')(
        getPoolConnection
    );
    const { updateCustomer } = require('../controllers/put')(getPoolConnection);

    router.get('/api/clothes/get-filtered', getFilteredClothes);
    router.get('/api/clothes/get-matches', getMatches);

    router.post('/api/opinion/create', bodyParser.json(), postOpinion);

    router.post('/api/customer/create', bodyParser.json(), postCustomer);
    router.put('/api/customer/update', bodyParser.json(), updateCustomer); // Note: changed the route from create to update for PUT

    router.get('/api/filters/get-info', getFilterInfo);

    return router;
};
