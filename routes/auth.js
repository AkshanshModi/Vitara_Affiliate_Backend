const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');
const authMiddlewareUpdate = require('../middleware/authMiddlewareUpdate');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/request-password-reset', authController.requestPasswordReset);

router.get('/me', authMiddleware, (req, res) => {
    res.json({
      message: 'User details fetched successfully',
      user: req.user
    });
  });

// PUT /api/auth/update-profile
router.put('/update-profile', authMiddlewareUpdate, userController.updateProfile);

// Change Password
router.post('/change-password', authMiddlewareUpdate, userController.changePassword);

// Signout route (requires token)
router.post('/signout', authMiddleware, authController.signout);
  
module.exports = router;