const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const authMiddleware = require('../middleware/auth');

router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);

module.exports = router; 