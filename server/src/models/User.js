const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    stripeCustomerId: {
        type: String,
        unique: true,
        sparse: true, // Allows null/undefined to be unique (only one null, but actually sparse allows multiple nulls usually, but for unique index it ignores nulls)
    },
    subscriptionId: {
        type: String,
    },
    subscriptionStatus: {
        type: String,
        enum: ['active', 'past_due', 'canceled', 'incomplete', 'trialing'],
        default: 'active', // Default to active for free plan, or null? Let's say 'active' for free.
    },
    plan: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);
