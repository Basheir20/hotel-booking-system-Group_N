const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware); // Protect all booking routes

router.post('/', bookingController.createBooking);
router.get('/user', bookingController.getUserBookings);

module.exports = router; 