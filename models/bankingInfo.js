const mongoose = require('mongoose');

const bankingInfoSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  account_holder_name: { type: String, required: true },
  bank_name: { type: String, required: true },
  account_number: { type: String, required: true },
  routing_number: { type: String, required: true },
  wise_email: { type: String, required: true },
  wise_account_id: { type: String } // optional
}, {
  timestamps: true
});

module.exports = mongoose.model('BankingInfo', bankingInfoSchema);
