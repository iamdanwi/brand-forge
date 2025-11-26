import express from 'express';
import { createCampaign } from '../controllers/campaignController.js';
import { checkLimit } from '../middleware/subscription.js';
import { ClerkExpressWithAuth, setTenant } from '../middleware/clerk.js';

const router = express.Router();

// Apply Clerk middleware
router.use(ClerkExpressWithAuth());
router.use(setTenant);

// Routes
router.post('/create', checkLimit('analysis'), createCampaign);

export default router;
