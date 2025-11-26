import express from 'express';
import brandRoutes from './brandRoutes.js';
import keyRoutes from './keyRoutes.js';
import billingRoutes from './billingRoutes.js';
import imageRoutes from './imageRoutes.js';
import campaignRoutes from './campaignRoutes.js';

const router = express.Router();

router.use('/brand', brandRoutes);
router.use('/keys', keyRoutes);
router.use('/billing', billingRoutes);
router.use('/image', imageRoutes);
router.use('/campaign', campaignRoutes);

export default router;
