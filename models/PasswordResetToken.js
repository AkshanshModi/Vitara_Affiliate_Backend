const mongoose = require('mongoose');

const resetTokenSchema = new mongoose.Schema({
  email: String,
  token: String,
  expires_at: Date,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PasswordResetToken', resetTokenSchema);

