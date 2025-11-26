import express from 'express';
import { createCheckoutSession, createPortalSession, handleWebhook } from '../controllers/billingController.js';

const router = express.Router();

// Webhook must be raw body, so we might need to adjust index.js for this route specifically if we use express.json() globally.
// For now, let's assume we handle it.
router.post('/create-checkout-session', createCheckoutSession);
router.post('/portal', createPortalSession);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
