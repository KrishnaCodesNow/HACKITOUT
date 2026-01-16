const express = require('express');
const router = express.Router();
const controller = require('./controller'); // Import the controller

// --- HTML ROUTES ---
router.get('/', controller.getLandingPage);
router.get('/dashboard', controller.getDashboard);

// --- API ROUTES ---
router.get('/api/services', controller.getServices);
router.post('/api/status', controller.updateStatus);

module.exports = router;