const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  token: String,
  ip_address: String,
  user_agent: String,
  expires_at: Date,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', sessionSchema);
