const APIKey = require('../models/APIKey');
const { incrementUsage } = require('../services/userService');

const validateApiKey = async (req, res, next) => {
    const apiKey = req.header('X-API-Key');

    if (!apiKey) {
        return res.status(401).json({ message: 'No API key, authorization denied' });
    }

    try {
        // In a real app, we would hash the key and compare.
        // For this MVP, we are storing plain keys (NOT SECURE for production).
        const keyRecord = await APIKey.findOne({ key: apiKey });

        if (!keyRecord) {
            return res.status(401).json({ message: 'Invalid API Key' });
        }

        // Update last used
        keyRecord.lastUsed = Date.now();
        await keyRecord.save();

        // Attach user/tenant info to request
        req.userId = keyRecord.userId;
        req.isApiRequest = true;

        // Increment API usage
        await incrementUsage(keyRecord.userId, 'api_call');

        next();
    } catch (err) {
        console.error('API Key validation error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { validateApiKey };
