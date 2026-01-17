const express = require('express');
const path = require('path');
const routes = require('./routes'); // Import the routes file

const app = express();
const PORT = 5000;

// Middleware to parse JSON bodies (Crucial for the POST request)
app.use(express.json());

// Resolve path to your client folder
const clientPath = path.resolve(__dirname, '..', 'client');
console.log('Serving static files from:', clientPath);

// 1. SERVE STATIC FILES (CSS, JS, Images)
app.use(express.static(clientPath));

// 2. USE ROUTES
app.use('/', routes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
