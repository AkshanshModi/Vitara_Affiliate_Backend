const BankingInfo = require('../models/bankingInfo');

exports.saveBankingInfo = async (req, res) => {
    try {
      const {
        account_holder_name,
        bank_name,
        account_number,
        routing_number,
        wise_email,
        wise_account_id
      } = req.body;
  
      const userId = req.userId;
  
      // ✅ Manual validation
      if (!account_holder_name) {
        return res.status(400).json({ error: 'Account Holder Name is required' });
      }
      if (!bank_name) {
        return res.status(400).json({ error: 'Bank Name is required' });
      }
      if (!account_number) {
        return res.status(400).json({ error: 'Account Number is required' });
      }
      if (!routing_number) {
        return res.status(400).json({ error: 'Routing Number / SWIFT / BIC is required' });
      }
      if (!wise_email) {
        return res.status(400).json({ error: 'Wise Email Address is required' });
      }
      if (!wise_email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        return res.status(400).json({ error: 'Invalid Wise Email Address' });
      }
  
      let bankingInfo = await BankingInfo.findOne({ user_id: userId });
  
      if (bankingInfo) {
        // Update banking info
        bankingInfo.account_holder_name = account_holder_name;
        bankingInfo.bank_name = bank_name;
        bankingInfo.account_number = account_number;
        bankingInfo.routing_number = routing_number;
        bankingInfo.wise_email = wise_email;
        bankingInfo.wise_account_id = wise_account_id;
  
        await bankingInfo.save();
  
        res.status(200).json({
          message: 'Banking details updated successfully',
          data: bankingInfo
        });
      } else {
        // Create new banking info
        const newBankingInfo = new BankingInfo({
          user_id: userId,
          account_holder_name,
          bank_name,
          account_number,
          routing_number,
          wise_email,
          wise_account_id
        });
  
        await newBankingInfo.save();
  
        res.status(200).json({
          message: 'Banking details added successfully',
          data: newBankingInfo
        });
      }
    } catch (err) {
      console.error('Banking info error:', err);
      res.status(500).json({
        error: 'Server error',
        details: err.message
      });
    }
  };

exports.getBankingInfo = async (req, res) => {
  const userId = req.userId;

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
