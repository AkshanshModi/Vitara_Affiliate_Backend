const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');
const authMiddlewareUserID = require('../middleware/authMiddlewareUserID');

router.get('/links-and-stats', authMiddlewareUserID, referralController.getReferralLinksAndStats);

module.exports = router;
