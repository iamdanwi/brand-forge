import express from 'express';
import { analyzeUrl, getBrandProfile, getUserBrands, generateBrandContent, getUsage } from '../controllers/brandController.js';
import { checkLimit } from '../middleware/subscription.js';
import { ClerkExpressWithAuth, setTenant } from '../middleware/clerk.js';

const router = express.Router();

// Apply Clerk middleware to all routes
router.use(ClerkExpressWithAuth());
router.use(setTenant);

router.post('/analyze', checkLimit('analysis'), analyzeUrl);
router.get('/usage', getUsage);
router.get('/user/:userId', getUserBrands); // We might want to change this to just /brands and use tenantId
router.get('/:id', getBrandProfile);
router.post('/:id/generate', checkLimit('content'), generateBrandContent);

export default router;
