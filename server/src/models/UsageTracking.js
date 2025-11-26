import mongoose from 'mongoose';

const usageTrackingSchema = new mongoose.Schema({
    userId: { // Keep for reference
        type: String,
        required: true,
        index: true,
    },
    tenantId: { // Primary tracking field
        type: String,
        required: true,
        index: true,
    },
    month: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    analysisCount: {
        type: Number,
        default: 0,
    },
    contentGenCount: {
        type: Number,
        default: 0,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
});

// Compound index to ensure unique tracking per tenant per month
usageTrackingSchema.index({ tenantId: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model('UsageTracking', usageTrackingSchema);
