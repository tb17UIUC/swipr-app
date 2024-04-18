const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());

const getClothes = require('../controllers/get');
const postOpinion = require('../controllers/post');

router.get('/api/clothes/get', getClothes);
router.post('/api/opinion/create', bodyParser.json(), postOpinion);

module.exports = router;
