const BankingInfo = require('../models/bankingInfo');

exports.addOrUpdateBankingInfo = async (req, res) => {
  const userId = req.user.userId;
  const {
    account_holder_name,
    bank_name,
    account_number,
    routing_number,
    wise_email,
    wise_account_id
  } = req.body;

  try {
    const existing = await BankingInfo.findOne({ user_id: userId });

    if (existing) {
      // Update existing
      existing.account_holder_name = account_holder_name;
      existing.bank_name = bank_name;
      existing.account_number = account_number;
      existing.routing_number = routing_number;
      existing.wise_email = wise_email;
      existing.wise_account_id = wise_account_id;
      await existing.save();

      return res.status(200).json({ message: 'Banking details updated successfully', data: existing });
    }

    // Add new
    const newInfo = new BankingInfo({
      user_id: userId,
      account_holder_name,
      bank_name,
      account_number,
      routing_number,
      wise_email,
      wise_account_id
    });

    await newInfo.save();
    res.status(200).json({ message: 'Banking details added successfully', data: newInfo });

  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

exports.getBankingInfo = async (req, res) => {
  const userId = req.user.userId;

  try {
    const data = await BankingInfo.findOne({ user_id: userId });

    if (!data) {
      return res.status(400).json({ message: 'No banking details found' });
    }

    res.status(200).json({ message: 'Banking details fetched successfully', data });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};
