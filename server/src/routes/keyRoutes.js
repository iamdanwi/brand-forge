const express = require('express');
const router = express.Router();
const { getKeys, createKey, deleteKey } = require('../controllers/keyController');

router.get('/:userId', getKeys);
router.post('/', createKey);
router.delete('/:id', deleteKey);

module.exports = router;
