const express = require('express');
const router = express.Router();
const { createCampaign } = require('../controllers/campaignController');
const { checkLimit } = require('../middleware/subscription');
const { ClerkExpressWithAuth, setTenant } = require('../middleware/clerk');

// Apply Clerk middleware
router.use(ClerkExpressWithAuth());
router.use(setTenant);

// Routes
router.post('/create', checkLimit('analysis'), createCampaign);

module.exports = router;
