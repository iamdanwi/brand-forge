import mongoose from 'mongoose';

const billingEventSchema = new mongoose.Schema({
    stripeEventId: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        required: true,
    },
    data: {
        type: Object,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('BillingEvent', billingEventSchema);
