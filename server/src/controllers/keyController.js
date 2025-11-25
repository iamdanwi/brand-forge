const APIKey = require('../models/APIKey');
const crypto = require('crypto');

const getKeys = async (req, res) => {
    try {
        const keys = await APIKey.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(keys);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createKey = async (req, res) => {
    const { userId, name } = req.body;
    try {
        // Generate a random key
        const key = 'bf_' + crypto.randomBytes(16).toString('hex');

        const newKey = await APIKey.create({
            userId,
            name,
            key,
        });
        res.status(201).json(newKey);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteKey = async (req, res) => {
    try {
        await APIKey.findByIdAndDelete(req.params.id);
        res.json({ message: 'Key deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getKeys, createKey, deleteKey };
