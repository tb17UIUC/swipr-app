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
        getClothesById,
        getMatches,
        readReview, 
        filterReview,
        getFilterInfo,
        getClothingOpinions,
        getCustomerActions,
        getCustomerInfo,
    } = require('../controllers/get')(getPoolConnection);
    const {
        postOpinion,
        postCustomer,
        loginCustomer,
        postPurchase,
        postReview,
        postClothes,
    } = require('../controllers/post')(getPoolConnection);
    const { putCustomer, putOpinion, putClothes } =
        require('../controllers/put')(getPoolConnection);
    const {
        deleteOpinion,
        deletePurchase,
        deleteReview,
        deleteClothing,
        deleteCustomer,
    } = require('../controllers/delete')(getPoolConnection);

    router.get('/api/clothes/get-filtered', getFilteredClothes);
    router.get('/api/clothes/get-id', getClothesById);
    router.get('/api/clothes/get-matches', getMatches);
    router.post('/api/clothes/create', bodyParser.json(), postClothes);
    router.put('/api/clothes/update/:id', bodyParser.json(), putClothes);
    router.delete('/api/clothes/delete/', deleteClothing);

    router.post('/api/opinions/create', bodyParser.json(), postOpinion);
    router.get('/api/opinions/get-customer-opinions/:id', getCustomerActions);
    router.get('/api/opinions/get-clothing-opinions/:id', getClothingOpinions);
    router.put('/api/opinions/update', bodyParser.json(), putOpinion);
    router.delete('/api/opinions/delete', bodyParser.json(), deleteOpinion);

    router.post('/api/customer/register', bodyParser.json(), postCustomer);
    router.get('/api/customer/info/:id', getCustomerInfo);
    router.post('/api/customer/login', bodyParser.json(), loginCustomer);
    router.put('/api/customer/update/:id', bodyParser.json(), putCustomer);
    router.delete('/api/customer/delete/', deleteCustomer);

    router.post('/api/purchases/create', bodyParser.json(), postPurchase);
    router.delete('/api/purchases/delete', bodyParser.json(), deletePurchase);
  
    router.get('/api/reviews/read/:id', bodyParser.json(), readReview);
    router.get('/api/reviews/filter', bodyParser.json(), filterReview);
    router.post('/api/reviews/create/', bodyParser.json(), postReview);
  
    router.delete('/api/reviews/delete', bodyParser.json(), deleteReview);

    router.get('/api/filters/get-info', getFilterInfo);

    // for admin page


    return router;
};
