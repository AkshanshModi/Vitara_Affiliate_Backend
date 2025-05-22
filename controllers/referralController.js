const ReferralLink = require('../models/ReferralLink');
const moment = require('moment');

exports.getReferralLinksAndStats = async (req, res) => {
    try {
      const userId = req.userId;
  
      const referralLinks = await ReferralLink.find({ user_id: userId });
  
      if (!referralLinks || referralLinks.length === 0) {
        return res.status(400).json({ message: 'No Referral links are available' });
      }
  
      let totalVisitors = 0;
      let totalLeads = 0;
      let totalConversions = 0;
  
      const links = referralLinks.map(link => {
        totalVisitors += link.visitors || 0;
        totalLeads += link.leads || 0;
        totalConversions += link.conversions || 0;
  
        return {
          _id: link._id,
          slug: link.slug,
          visitors: link.visitors || 0,
          leads: link.leads || 0,
          conversions: link.conversions || 0,
          url: `https://vitara.dev?via=${link.slug}`
        };
      });
  
      return res.json({
        total: {
          visitors: totalVisitors,
          leads: totalLeads,
          conversions: totalConversions
        },
        links
      });
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  };

  exports.getMonthlyReferralSummary = async (req, res) => {
    try {
      const userId = req.userId;
      const { range = 'last_3_months' } = req.query;
  
      // Calculate date range
      let startDate;
      switch (range) {
        case 'last_3_months':
          startDate = moment().subtract(3, 'months').startOf('month');
          break;
        case 'last_6_months':
          startDate = moment().subtract(6, 'months').startOf('month');
          break;
        case 'last_1_year':
          startDate = moment().subtract(1, 'year').startOf('month');
          break;
        case 'last_3_years':
          startDate = moment().subtract(3, 'years').startOf('month');
          break;
        default:
          startDate = moment('2000-01-01');
      }
  
      const data = await ReferralLink.aggregate([
        { $match: { user_id: userId, createdAt: { $gte: startDate.toDate() } } },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            visitors: { $sum: "$visitors" },
            leads: { $sum: "$leads" },
            conversions: { $sum: "$conversions" }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]);
  
      const formatted = data.map(item => {
        const monthName = moment().month(item._id.month - 1).format("MMMM");
        return {
          month: `${monthName} ${item._id.year}`,
          visitors: item.visitors,
          leads: item.leads,
          conversions: item.conversions
        };
      });
  
      const totals = {
        visitors: formatted.reduce((a, b) => a + b.visitors, 0),
        leads: formatted.reduce((a, b) => a + b.leads, 0),
        conversions: formatted.reduce((a, b) => a + b.conversions, 0)
      };
  
      res.json({ data: formatted, totals });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  };
  
