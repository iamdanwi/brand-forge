import express from 'express';
import { generateNewImage, chatAboutImage, handleUnifiedChat } from '../controllers/imageController.js';
import { checkLimit } from '../middleware/subscription.js';
import { ClerkExpressWithAuth, setTenant } from '../middleware/clerk.js';

const router = express.Router();

// Apply Clerk middleware
router.use(ClerkExpressWithAuth());
router.use(setTenant);

// Routes
router.post('/generate', checkLimit('content'), generateNewImage);
router.post('/chat', checkLimit('analysis'), chatAboutImage);
router.post('/unified', checkLimit('analysis'), handleUnifiedChat); // Use 'analysis' as base limit, controller handles specific increment

export default router;
