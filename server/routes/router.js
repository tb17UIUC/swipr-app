const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());

const {
    getFilteredClothes,
    getMatches,
    getFilterInfo,
} = require('../controllers/get');
const { postOpinion, postCustomer } = require('../controllers/post');
const { updateCustomer } = require('../controllers/put');

router.get('/api/clothes/get-filtered', getFilteredClothes);
router.get('/api/clothes/get-matches', getMatches);

router.post('/api/opinion/create', bodyParser.json(), postOpinion);

router.post('/api/customer/create', bodyParser.json(), postCustomer);
router.put('/api/customer/create', bodyParser.json(), updateCustomer);

router.get('/api/filters/get-info', getFilterInfo);

module.exports = router;
