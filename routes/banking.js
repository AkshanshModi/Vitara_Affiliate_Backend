const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bankingController = require('../controllers/bankingController');

// Add or Update banking info
router.post('/banking', auth, bankingController.addOrUpdateBankingInfo);

// Get banking info
router.get('/banking', auth, bankingController.getBankingInfo);

module.exports = router;

