const express = require('express');
const { 
    getResults, 
    createResult, 
    updateResult, 
    deleteResult 
} = require('../controllers/resultController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.route('/')
    .get(getResults)
    .post(createResult);

router.route('/:id')
    .put(updateResult)
    .delete(deleteResult);

module.exports = router;
