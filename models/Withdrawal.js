const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Completed', 'Pending', 'Cancelled'], default: 'Pending' },
  balanceBefore: { type: Number, required: true },
  balanceAfter: { type: Number, required: true },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
