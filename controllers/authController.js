const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Session = require('../models/Session');
const PasswordResetToken = require('../models/PasswordResetToken');

exports.register = async (req, res) => {
  const { email, password, full_name, phone } = req.body;
  console.log(req.body);
  try {
    // Basic validation
    if (full_name == "" || full_name == null){
      return res.status(401).json({ error: 'Full name field is required' });
    } else if (email == "" || email == null){
      return res.status(401).json({ error: 'Email field is required' });
    } else if (phone == "" || phone == null){
      return res.status(401).json({ error: 'Phone number field is required' });
    } else if (password == "" || password == null){
      return res.status(401).json({ error: 'Password field is required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password_hash: hashedPassword, full_name, phone });
    await user.save();
    res.status(201).json({ user });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Basic validation
    if (email == "" || email == null){
      return res.status(401).json({ error: 'Email field is required' });
    } else if (password == "" || password == null){
      return res.status(401).json({ error: 'Password field is required' });
    }
    // Functional validation
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    } 

    // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const session = new Session({
      user_id: user._id,
      //token,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
      expires_at: new Date(Date.now() + 3600000)
    });
    await session.save();

    res.json({ message: 'Login Success 😊' });
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
