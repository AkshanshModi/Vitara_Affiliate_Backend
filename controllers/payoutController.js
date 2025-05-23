const moment = require('moment');
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');

exports.getPayoutData = async (req, res) => {
  try {
    const userId = req.userId;
    const filter = req.query.filter || 'current_year';

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Time range filter
    let startDate, endDate = moment().endOf('day');
    switch (filter) {
      case 'current_month':
        startDate = moment().startOf('month');
        break;
      case 'last_month':
        startDate = moment().subtract(1, 'month').startOf('month');
        endDate = moment().subtract(1, 'month').endOf('month');
        break;
      case 'last_year':
        startDate = moment().subtract(1, 'year').startOf('year');
        endDate = moment().subtract(1, 'year').endOf('year');
        break;
      case 'all_time':
        startDate = null;
        break;
      case 'current_year':
      default:
        startDate = moment().startOf('year');
        break;
    }

    // Filter withdrawals
    const filterQuery = { user_id: userId };
    if (startDate) {
      filterQuery.createdAt = { $gte: startDate.toDate(), $lte: endDate.toDate() };
    }

    const withdrawals = await Withdrawal.find(filterQuery).sort({ createdAt: -1 });

    const history = withdrawals.map(w => ({
      date: moment(w.createdAt).format('MMM D, YYYY'),
      time: moment(w.createdAt).format('h:mm A'),
      amount: w.amount,
      status: w.status, // Completed, Pending, Cancelled
      balanceBefore: w.balanceBefore,
      balanceAfter: w.balanceAfter,
      notes: w.notes || '',
    }));

    const totalWithdrawn = withdrawals.reduce((sum, w) => sum + w.amount, 0);

    res.json({
      currentAvailableBalance: user.availableBalance,
      totalCommissionEarned: user.totalCommissionEarned,
      totalWithdrawn,
      history
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const requestWithdrawal = async (req, res) => {
    try {
      const userId = req.userId;
      const { amount, note } = req.body;
  
      // Validate amount
      if (!amount || isNaN(amount) || amount < 50) {
        return res.status(400).json({ error: 'Minimum withdrawal amount is $50.' });
      }
  
      const user = await User.findById(userId);
  
      if (!user) return res.status(400).json({ error: 'User not found' });
  
      if (user.availableBalance < amount) {
        return res.status(400).json({ error: 'Insufficient balance.' });
      }
  
      const balanceBefore = user.availableBalance;
      const balanceAfter = balanceBefore - amount;
  
      // Deduct balance and save withdrawal
      user.availableBalance = balanceAfter;
      await user.save();
  
      const withdrawal = new Withdrawal({
        userId,
        amount,
        status: 'Pending',
        note,
        createdAt: new Date(),
        balanceBefore,
        balanceAfter
      });
  
      await withdrawal.save();
  
      res.status(201).json({ message: 'Withdrawal requested successfully.', withdrawal });
    } catch (error) {
      console.error('Withdrawal request error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  module.exports = {
    requestWithdrawal
  };
