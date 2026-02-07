const express = require('express');
const { searchResultByCode } = require('../controllers/publicController');

const router = express.Router();

router.get('/search/:code', searchResultByCode);

module.exports = router;
