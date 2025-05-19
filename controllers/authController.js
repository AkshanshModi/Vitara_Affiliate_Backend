const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Session = require('../models/Session');
const PasswordResetToken = require('../models/PasswordResetToken');

exports.register = async (req, res) => {
  const { email, password, full_name, phone } = req.body;

  try {
    // Basic validation
    if (!full_name) {
      return res.status(401).json({ error: 'Full name field is required' });
    }
    if (!email) {
      return res.status(401).json({ error: 'Email field is required' });
    }
    if (!phone) {
      return res.status(401).json({ error: 'Phone number field is required' });
    }
    if (!password) {
      return res.status(401).json({ error: 'Password field is required' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password_hash: hashedPassword,
      full_name,
      phone
    });
    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Create session
    const session = new Session({
      user_id: user._id,
      token,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
      expires_at: new Date(Date.now() + 3600000), // 1 hour
    });
    await session.save();

    // Respond with token and user info
    res.status(200).json({
      message: 'Registration successful 🎉',
      token,
      user: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Basic validation
    if (!email) {
      return res.status(401).json({ error: 'Email field is required' });
    }
    if (!password) {
      return res.status(401).json({ error: 'Password field is required' });
    }

    // Functional validation
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Save session
    const session = new Session({
      user_id: user._id,
      token,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
      expires_at: new Date(Date.now() + 3600000)
    });
    await session.save();

    // Send success response with token
    res.json({
      message: 'Login Success 🎉',
      token, // include token in response
      user: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    const resetToken = new PasswordResetToken({ email, token, expires_at: expiresAt });
    await resetToken.save();

    res.json({ message: 'Reset token generated', token }); // For dev; in real use, send via email
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
