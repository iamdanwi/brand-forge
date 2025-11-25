const User = require('../models/User');
const UsageTracking = require('../models/UsageTracking');

const getOrCreateUser = async (clerkId, email) => {
    try {
        let user = await User.findOne({ clerkId });
        if (!user) {
            user = await User.create({
                clerkId,
                email,
                plan: 'free', // Default to free
            });
        }
        return user;
    } catch (error) {
        console.error('Error in getOrCreateUser:', error);
        throw error;
    }
};

const getUserUsage = async (tenantId) => {
    const date = new Date();
    const month = date.getMonth() + 1; // 1-12
    const year = date.getFullYear();

    try {
        let usage = await UsageTracking.findOne({ tenantId, month, year });
        if (!usage) {
            usage = await UsageTracking.create({
                tenantId,
                userId: tenantId, // Fallback/Legacy
                month,
                year,
                analysisCount: 0,
                contentGenCount: 0,
            });
        }
        return usage;
    } catch (error) {
        console.error('Error in getUserUsage:', error);
        throw error;
    }
};

const incrementUsage = async (tenantId, type) => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const update = {};
    if (type === 'analysis') update.analysisCount = 1;
    if (type === 'content') update.contentGenCount = 1;
    if (type === 'api_call') update.apiCallCount = 1; // Add this if schema supports it

    try {
        await UsageTracking.findOneAndUpdate(
            { tenantId, month, year },
            { $inc: update, $setOnInsert: { userId: tenantId } },
            { upsert: true, new: true }
        );
    } catch (error) {
        console.error('Error incrementing usage:', error);
    }
};

module.exports = { getOrCreateUser, getUserUsage, incrementUsage };
