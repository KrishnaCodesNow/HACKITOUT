const express = require('express');
const router = express.Router();
const controller = require('./controller');

// --- HTML PAGE ROUTES ---
router.get('/', controller.getLandingPage);          // Home
router.get('/services', controller.getServicesPage); // Services List
router.get('/book', controller.getBookPage);         // Booking/Emergency

// --- API DATA ROUTES ---
router.get('/api/services', controller.getServicesAPI);
router.post('/api/status', controller.updateStatus);

module.exports = router;