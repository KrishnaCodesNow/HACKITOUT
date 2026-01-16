const path = require('path');

// Resolve path to client folder (Needed for res.sendFile)
const clientPath = path.resolve(__dirname, '..', 'client');

// Load Data (Use 'let' so we can update it in memory)
let servicesData = require('../client/data/services.json');

// Logic 1: Serve Landing Page
exports.getLandingPage = (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
};

// Logic 2: Serve Dashboard
exports.getDashboard = (req, res) => {
    res.sendFile(path.join(clientPath, 'dashboard.html'));
};

// Logic 3: Get All Services (API)
exports.getServices = (req, res) => {
    res.json(servicesData);
};

// Logic 4: Update Status (API)
exports.updateStatus = (req, res) => {
    const { name, status } = req.body;
    
    // Find the service in our list
    const service = servicesData.find(s => s.name === name);
    
    if (service) {
        service.availability = status; // Update the data in memory
        console.log(`✅ Updated ${name} to ${status}`);
        res.json({ success: true, newStatus: status });
    } else {
        console.log(`❌ Service not found: ${name}`);
        res.status(404).json({ success: false, message: "Service not found" });
    }
};