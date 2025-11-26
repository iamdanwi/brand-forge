import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        required: true,
        unique: true, // Org ID or User ID
    },
    email: {
        type: String, // Contact email for billing
    },
    stripeCustomerId: {
        type: String,
        unique: true,
        sparse: true,
    },
    subscriptionId: {
        type: String,
    },
    subscriptionStatus: {
        type: String,
        enum: ['active', 'past_due', 'canceled', 'incomplete', 'trialing'],
        default: 'active', // Default to active for free plan
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

export default mongoose.model('Tenant', tenantSchema);
