const express = require('express');
const router = express.Router();
const { analyzeUrl, getBrandProfile, getUserBrands, generateBrandContent, getUsage } = require('../controllers/brandController');
const { checkLimit } = require('../middleware/subscription');
const { ClerkExpressWithAuth, setTenant } = require('../middleware/clerk');

// Apply Clerk middleware to all routes
router.use(ClerkExpressWithAuth());
router.use(setTenant);

router.post('/analyze', checkLimit('analysis'), analyzeUrl);
router.get('/usage', getUsage);
router.get('/user/:userId', getUserBrands); // We might want to change this to just /brands and use tenantId
router.get('/:id', getBrandProfile);
router.post('/:id/generate', checkLimit('content'), generateBrandContent);

module.exports = router;
