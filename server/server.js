const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies (for when you build the "Booking" feature)
app.use(express.json());

// 1. SERVE STATIC FILES (The Frontend)
// This tells Node to serve index.html, style.css, etc. from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// 2. THE API (The Data)
// Load your data from the JSON file
const servicesData = require('./data/services.json'); 

// Endpoint: Get All Services
app.get('/api/services', (req, res) => {
    res.json(servicesData);
});

// Endpoint: Toggle Availability (For the Dashboard)
// In a real app, this updates the DB. Here, we update the variable in memory.
app.post('/api/status', (req, res) => {
    const { name, status } = req.body;
    const service = servicesData.find(s => s.name === name);
    if (service) {
        service.availability = status;
        res.json({ success: true, newStatus: status });
    } else {
        res.status(404).json({ success: false });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});