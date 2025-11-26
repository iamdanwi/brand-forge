import mongoose from 'mongoose';

const apiKeySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true,
    },
    key: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastUsed: {
        type: Date,
    },
});

export default mongoose.model('APIKey', apiKeySchema);
