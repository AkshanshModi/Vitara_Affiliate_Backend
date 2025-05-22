const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');
const authMiddlewareUserID = require('../middleware/authMiddlewareUserID');

router.get('/links-and-stats', authMiddlewareUserID, referralController.getReferralLinksAndStats);
router.get('/monthly-summary', authMiddlewareUserID, referralController.getMonthlyReferralSummary);

module.exports = router;
