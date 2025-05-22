const mongoose = require('mongoose');

const referralLinkSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slug: { type: String, required: true }, // like "akshansh"
  visitors: { type: Number, default: 0 },
  leads: { type: Number, default: 0 },
  conversions: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('ReferralLink', referralLinkSchema);