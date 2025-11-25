const express = require('express');
const router = express.Router();
const { createCheckoutSession, createPortalSession, handleWebhook } = require('../controllers/billingController');

// Webhook must be raw body, so we might need to adjust index.js for this route specifically if we use express.json() globally.
// For now, let's assume we handle it.
router.post('/create-checkout-session', createCheckoutSession);
router.post('/portal', createPortalSession);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
