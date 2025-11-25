const { getUserUsage } = require('../services/userService');
const BrandProfile = require('../models/BrandProfile');
const Tenant = require('../models/Tenant');

const checkLimit = (feature) => {
    return async (req, res, next) => {
        const { tenantId } = req; // From setTenant middleware

        if (!tenantId) {
            return res.status(401).json({ message: 'Unauthorized: Tenant ID required' });
        }

        try {
            // 1. Get Tenant Plan
            let tenant = await Tenant.findOne({ tenantId });

            if (!tenant) {
                // If tenant doesn't exist, create a default free one
                // We might not have email here if it's an Org, but that's okay for free tier
                tenant = await Tenant.create({
                    tenantId,
                    plan: 'free'
                });
            }

            const plan = tenant.plan;

            // 2. Check Limits based on Plan
            if (plan === 'free') {
                if (feature === 'analysis') {
                    // Limit: 3 Brand Analyses (Total)
                    const count = await BrandProfile.countDocuments({ tenantId });
                    if (count >= 3) {
                        return res.status(403).json({
                            message: 'Free limit reached: 3 Brand Analyses. Upgrade to Pro.',
                            code: 'LIMIT_REACHED_ANALYSIS'
                        });
                    }
                } else if (feature === 'content') {
                    // Limit: 10 Content Generations (Monthly)
                    const usage = await getUserUsage(tenantId);
                    if (usage.contentGenCount >= 10) {
                        return res.status(403).json({
                            message: 'Free limit reached: 10 Content Generations/mo. Upgrade to Pro.',
                            code: 'LIMIT_REACHED_CONTENT'
                        });
                    }
                }
            }

            // Pro and Enterprise have unlimited (or high) limits
            next();
        } catch (error) {
            console.error('Error in checkLimit middleware:', error);
            res.status(500).json({ message: 'Server Error checking limits' });
        }
    };
};

module.exports = { checkLimit };
