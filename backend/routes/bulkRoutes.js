const express = require('express');
const router = express.Router();
const multer = require('multer');
const { bulkImportResults } = require('../controllers/bulkController');

// Multer configuration: use memory storage for processing the buffer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// @desc    Bulk import results from Excel
// @route   POST /api/bulk/import
// @access  Private/Admin
router.post('/import', upload.single('file'), bulkImportResults);

module.exports = router;
