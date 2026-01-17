const path = require('path');

// Resolve path to client folder
const clientPath = path.resolve(__dirname, '..', 'client');

// Load Data
let servicesData = require('../client/data/services.json');

// --- PAGE CONTROLLERS (Serve HTML) ---

exports.getLandingPage = (req, res) => {
    console.log("Serving Landing Page");
    res.sendFile(path.join(clientPath, 'index.html'));
};

exports.getServicesPage = (req, res) => {
    console.log("Serving Services Page");
    res.sendFile(path.join(clientPath, 'services.html'));
};

exports.getBookPage = (req, res) => {
    console.log("Serving Book Page");
    res.sendFile(path.join(clientPath, 'book.html'));
};

exports.getDashboard = (req, res) => {
    res.sendFile(path.join(clientPath, 'dashboard.html'));
};

// --- API CONTROLLERS ---

exports.getServicesAPI = (req, res) => {
    res.json(servicesData);
};

exports.updateStatus = (req, res) => {
    const { name, status } = req.body;
    const service = servicesData.find(s => s.name === name);
    if (service) {
        service.availability = status;
        res.json({ success: true, newStatus: status });
    } else {
        res.status(404).json({ success: false, message: "Service not found" });
    }
};