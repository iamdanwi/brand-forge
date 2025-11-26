import mongoose from 'mongoose';

const BrandProfileSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    userId: { // Keep for backward compatibility or direct user link
        type: String,
        required: true,
        index: true,
    },
    tenantId: { // New field for multi-tenancy (Org or User)
        type: String,
        required: true,
        index: true,
    },
    brandName: {
        type: String,
        required: true,
    },
    colors: [String],
    fonts: [String],
    toneOfVoice: [String],
    keywords: [String],
    visualStyle: {
        type: String,
    },
    // Pro Fields
    typography: {
        type: Object, // { primary, secondary, pairing }
    },
    tagline: {
        type: String,
    },
    personality: {
        type: Object, // { traits: [], voice: '' }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('BrandProfile', BrandProfileSchema);
