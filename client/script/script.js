// 1. Online/Offline Toggle
const toggleBtn = document.getElementById('toggleBtn');
let isOnline = true;

toggleBtn.addEventListener('click', () => {
    isOnline = !isOnline;
    toggleBtn.textContent = isOnline ? 'Online' : 'Offline';
    toggleBtn.className = isOnline ? 'online' : 'offline';
});

// 2. Mock Data for Tasks
const availableTasks = [
    { id: 1, title: "Burst Pipe - Urgent", category: "Plumbing", isEmergency: true, pay: "₹1500" },
    { id: 2, title: "Light Fix", category: "Electrical", isEmergency: false, pay: "₹400" },
    { id: 3, title: "Short Circuit", category: "Electrical", isEmergency: true, pay: "₹2000" }
];

function loadTasks() {
    const eList = document.getElementById('emergencyList');
    const tList = document.getElementById('taskList');

    availableTasks.forEach(task => {
        const card = `
            <div class="task-card">
                <h4>${task.title}</h4>
                <p>Pay: <strong>${task.pay}</strong></p>
                <button onclick="acceptTask(${task.id})">Accept Task</button>
            </div>`;
        
        if (task.isEmergency) {
            eList.innerHTML += card;
        } else {
            tList.innerHTML += card;
        }
    });
}

function acceptTask(id) {
    alert("Task " + id + " accepted! Extra money will be added to your wallet.");
}

loadTasks();