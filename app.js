// 1. DELETE A TASK (Moved to top for global access)
window.deleteTask = async (id) => {
    console.log("Attempting to delete task with ID:", id);
    try {
        const response = await fetch(`/api/v1/tasks/${id}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        console.log("Delete response:", data);
        getTasks(); // Refresh the list
    } catch (error) {
        console.error('Error deleting task:', error);
    }
};

// 2. TOGGLE TASK COMPLETION (PATCH)
window.toggleTask = async (id, currentStatus) => {
    console.log("Toggling task ID:", id);
    try {
        await fetch(`/api/v1/tasks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !currentStatus })
        });
        getTasks(); // Refresh the list
    } catch (error) {
        console.error('Error updating task:', error);
    }
};

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// 3. FETCH AND DISPLAY ALL TASKS
const getTasks = async () => {
    try {
        const response = await fetch('/api/v1/tasks');
        const { tasks } = await response.json();
        
        taskList.innerHTML = tasks.map(t => `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">
                <span style="flex-grow: 1; text-decoration: ${t.completed ? 'line-through' : 'none'}; color: ${t.completed ? 'gray' : 'black'}">
                    ${t.name}
                </span>
                <button onclick="toggleTask('${t._id}', ${t.completed})" style="cursor: pointer;">
                    ${t.completed ? 'Done' : 'Undo'}
                </button>
                <button onclick="deleteTask('${t._id}')" style="color: red; cursor: pointer;">
                    Delete
                </button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
};

// 4. CREATE A NEW TASK
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = taskInput.value;
    try {
        await fetch('/api/v1/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        taskInput.value = ''; 
        getTasks(); 
    } catch (error) {
        console.error('Error creating task:', error);
    }
});

// Load tasks initially
getTasks();