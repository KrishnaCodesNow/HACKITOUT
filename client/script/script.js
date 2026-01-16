let availableTasks = [];
let currentEarnings = parseInt(localStorage.getItem('earnings'), 10) || 0;

// 1. Online/Offline Toggle logic
const toggleBtn = document.getElementById('toggleBtn');
let isOnline = true;

if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        isOnline = !isOnline;
        toggleBtn.textContent = isOnline ? 'Online' : 'Offline';
        toggleBtn.classList.remove('online', 'offline');
        toggleBtn.classList.add(isOnline ? 'online' : 'offline');
    });
}

// safe helper to create text nodes
function makeTextEl(tag, text) {
    const el = document.createElement(tag);
    el.textContent = text;
    return el;
}

// 2. Function to load tasks from the server
async function loadTasks() {
    try {
        const response = await fetch('http://localhost:3000/api/tasks');
        if (!response.ok) {
            console.error('Failed to fetch tasks, status:', response.status);
            return;
        }

        const data = await response.json();
        availableTasks = Array.isArray(data) ? data : [];

        const taskGrid = document.getElementById('task-grid');
        if (!taskGrid) return;

        taskGrid.innerHTML = '';

        availableTasks.forEach(task => {
            const taskCard = document.createElement('div');
            taskCard.className = task.isEmergency ? 'task-card emergency-zone' : 'task-card';

            const title = makeTextEl('h3', task.title || 'Untitled');
            const location = makeTextEl('p', `Location: ${task.location || 'Unknown'}`);
            const pay = makeTextEl('p', `Pay: ${task.pay ?? '0'}`);

            const btn = document.createElement('button');
            btn.textContent = 'Accept Task';
            btn.addEventListener('click', () => acceptTask(task.id));

            taskCard.appendChild(title);
            taskCard.appendChild(location);
            taskCard.appendChild(pay);
            taskCard.appendChild(btn);

            taskGrid.appendChild(taskCard);
        });
    } catch (error) {
        console.error("Failed to load tasks:", error);
    }
}

// 3. Function to accept a task
async function acceptTask(id) {
    const taskIndex = availableTasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
        alert('Task not found or already taken.');
        return;
    }
    const task = availableTasks[taskIndex];

    if (!confirm(`Do you want to accept this ${task.isEmergency ? 'Emergency' : 'Regular'} task?`)) {
        return;
    }

    try {
        const delResp = await fetch(`http://localhost:3000/api/tasks/${encodeURIComponent(id)}`, {
            method: 'DELETE'
        });
        if (!delResp.ok) {
            console.error('Delete failed:', delResp.status);
            alert('Server rejected the deletion. Try again.');
            return;
        }

        // Robust pay parsing
        const raw = String(task.pay ?? '');
        const num = parseInt(raw.replace(/[^0-9\-]/g, ''), 10);
        const credit = Number.isFinite(num) ? num : 0;

        currentEarnings += credit;
        localStorage.setItem('earnings', String(currentEarnings));

        const totalEl = document.getElementById('totalEarnings');
        if (totalEl) totalEl.textContent = `₹${currentEarnings}`;

        await loadTasks();

        alert(`Task Accepted! ${task.isEmergency ? "Bonus credited to your wallet." : ""}`);
    } catch (error) {
        console.error("Error accepting task:", error);
        alert("Could not connect to the server. Please try again.");
    }
}

// Start the app
const totalEl = document.getElementById('totalEarnings');
if (totalEl) totalEl.textContent = `₹${currentEarnings}`;
loadTasks();