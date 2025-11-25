const mongoose = require('mongoose');

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

module.exports = mongoose.model('BillingEvent', billingEventSchema);
