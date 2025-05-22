const ReferralLink = require('../models/ReferralLink');

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
  
