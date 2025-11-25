const BrandProfile = require('../models/BrandProfile');
const { generateCampaignStrategy } = require('../services/ai');
const { incrementUsage } = require('../services/userService');

const createCampaign = async (req, res) => {
    const { brandId, targetAudience, goal } = req.body;
    const { tenantId } = req;

    if (!brandId || !targetAudience || !goal) {
        return res.status(400).json({ message: 'Brand ID, Target Audience, and Goal are required' });
    }

    try {
        const brand = await BrandProfile.findById(brandId);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }

        // Verify ownership/tenant access (simple check for now)
        if (brand.tenantId !== tenantId) {
            return res.status(403).json({ message: 'Unauthorized access to this brand' });
        }

        const strategy = await generateCampaignStrategy(brand, targetAudience, goal);

        // In a real app, we would save this to a Campaign model.
        // For now, we return it directly.

        if (tenantId) {
            await incrementUsage(tenantId, 'analysis'); // Strategy counts as analysis
        }

        res.json(strategy);
    } catch (error) {
        console.error('Error creating campaign:', error);
        res.status(500).json({ message: 'Failed to create campaign' });
    }
};

module.exports = { createCampaign };
