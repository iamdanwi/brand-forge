import APIKey from '../models/APIKey.js';
import crypto from 'crypto';

export const getKeys = async (req, res) => {
    try {
        const keys = await APIKey.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(keys);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const createKey = async (req, res) => {
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

export const deleteKey = async (req, res) => {
    try {
        await APIKey.findByIdAndDelete(req.params.id);
        res.json({ message: 'Key deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
