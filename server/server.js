const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(express.json());

// Resolve the client directory path
const clientPath = path.resolve(__dirname, '..', 'client');
console.log('Serving static files from:', clientPath);

// Serve static client folder
app.use(express.static(clientPath));

// Explicit route for root to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
});

// Load services data
const servicesData = require('../client/data/services.json');

// API endpoint
app.get('/api/services', (req, res) => {
    res.json(servicesData);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
