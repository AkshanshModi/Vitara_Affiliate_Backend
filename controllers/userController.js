const User = require('../models/User');

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Populated by auth middleware
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
