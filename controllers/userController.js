const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Populated by auth middleware
    console.log("USERID --------->", userId);
    const { full_name, phone } = req.body;

    // Validate
    if (!full_name || !phone) {
      return res.status(400).json({ error: 'Full name and phone are required' });
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { full_name, phone },
      { new: true } // Return updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      message: 'Profile updated successfully 🎉',
      user: {
        _id: updatedUser._id,
        full_name: updatedUser.full_name,
        phone: updatedUser.phone,
        email: updatedUser.email
      }
    });
  } catch (err) {
    console.error('Update error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.userId; // Populated from auth middleware
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Validate fields
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: 'New password and confirm password do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    // Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password_hash = hashedPassword;
    await user.save();

    // Optional: Invalidate previous sessions if you’re using a sessions model

    return res.json({
      success: true,
      message: 'Password changed successfully 🔐'
    });

  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
