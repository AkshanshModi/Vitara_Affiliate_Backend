const express = require('express');
const router = express.Router();
const payoutController = require('../controllers/payoutController');
const authMiddlewareUserID = require('../middleware/authMiddlewareUserID');

router.get('/data', authMiddlewareUserID, payoutController.getPayoutData);

module.exports = router;
