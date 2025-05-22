const ReferralLink = require('../models/ReferralLink');

exports.getReferralLinksAndStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const referralLinks = await ReferralLink.find({ user_id: userId });

    let totalVisitors = 0;
    let totalLeads = 0;
    let totalConversions = 0;

    const links = referralLinks.map(link => {
      totalVisitors += link.visitors;
      totalLeads += link.leads;
      totalConversions += link.conversions;

      return {
        _id: link._id,
        slug: link.slug,
        visitors: link.visitors,
        leads: link.leads,
        conversions: link.conversions,
        url: `https://vitara.dev?via=${link.slug}`
      };
    });

    res.json({
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
