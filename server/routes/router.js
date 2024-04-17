const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());

const getClothes = require('../controllers/get');

router.get('/api/get-clothes', getClothes);

module.exports = router;
