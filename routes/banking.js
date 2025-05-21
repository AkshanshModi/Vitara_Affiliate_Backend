const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const bankingController = require('../controllers/bankingController');

// Add or Update banking info
router.post('/banking', authMiddleware, bankingController.addOrUpdateBankingInfo);

// Get banking info
router.get('/banking', authMiddleware, bankingController.getBankingInfo);

module.exports = router;

