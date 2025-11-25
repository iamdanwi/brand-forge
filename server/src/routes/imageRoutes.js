const express = require('express');
const router = express.Router();
const { generateNewImage, chatAboutImage, handleUnifiedChat } = require('../controllers/imageController');
const { checkLimit } = require('../middleware/subscription');
const { ClerkExpressWithAuth, setTenant } = require('../middleware/clerk');

// Apply Clerk middleware
router.use(ClerkExpressWithAuth());
router.use(setTenant);

// Routes
router.post('/generate', checkLimit('content'), generateNewImage);
router.post('/chat', checkLimit('analysis'), chatAboutImage);
router.post('/unified', checkLimit('analysis'), handleUnifiedChat); // Use 'analysis' as base limit, controller handles specific increment

module.exports = router;
