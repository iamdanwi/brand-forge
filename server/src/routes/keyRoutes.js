import express from 'express';
import { getKeys, createKey, deleteKey } from '../controllers/keyController.js';

const router = express.Router();

router.get('/:userId', getKeys);
router.post('/', createKey);
router.delete('/:id', deleteKey);

export default router;
