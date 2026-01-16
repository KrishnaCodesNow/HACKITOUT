const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, '../client')));

// This is the variable I mentioned - it stays at the top
let tasks = [
    { id: '1', title: "Burst Pipe - Urgent", location: "Virar", isEmergency: true, pay: "₹1500" },
    { id: '2', title: "Light Fix", location: "Vasai", isEmergency: false, pay: "₹400" },
    { id: '3', title: "Short Circuit", location: "Nala Sopara", isEmergency: true, pay: "₹2000" }
];

app.get('/api/tasks', (req, res) => {
    res.json(tasks); // Now it sends the variable
});

app.delete('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    tasks = tasks.filter(t => t.id !== taskId); // Actually removes it
    console.log(`✅ Task ${taskId} removed.`);
    res.status(200).send({ message: "Task removed" });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dashboard.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});