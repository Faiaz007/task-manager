// Utility function to create task buttons
function createTaskButtons() {
    const taskButtons = document.createElement('div');
    taskButtons.className = 'task-buttons';
  
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';
  
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
  
    taskButtons.appendChild(editBtn);
    taskButtons.appendChild(deleteBtn);
  
    return taskButtons;
}

// Utility function to create task elements
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (task.completed) li.classList.add('completed');

    const taskInfo = document.createElement('div');
    taskInfo.className = 'task-info';

    const taskTitle = document.createElement('div');
    taskTitle.className = 'task-title';
    taskTitle.textContent = task.text;

    const taskDetails = document.createElement('div');
    taskDetails.className = 'task-details';
    taskDetails.textContent = task.details;

    taskInfo.appendChild(taskTitle);
    taskInfo.appendChild(taskDetails);

    li.appendChild(taskInfo);
    
    const taskButtons = createTaskButtons();
    li.appendChild(taskButtons);

    taskButtons.querySelector('.edit-btn').addEventListener('click', () => editTask(li));
    taskButtons.querySelector('.delete-btn').addEventListener('click', () => deleteTask(li));

    return li;
}

function addTask() {
    const taskInput = document.getElementById('task-input');
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const task = {
            text: taskText,
            completed: false,
            details: `Priority: ${document.getElementById('priority-select').value}, 
                      Due: ${document.getElementById('due-date').value}, 
                      Category: ${document.getElementById('category-input').value}`
        };
      
        const taskList = document.getElementById('task-list');
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);

        taskInput.value = '';
        document.getElementById('priority-select').value = 'low';
        document.getElementById('due-date').value = '';
        document.getElementById('category-input').value = '';
      
        saveTasks();
    }
}

function editTask(taskItem) {
    const taskInfo = taskItem.querySelector('.task-info');
    const taskTitle = taskInfo.querySelector('.task-title');
    const taskDetails = taskInfo.querySelector('.task-details');

    const newTaskText = prompt('Edit the task:', taskTitle.textContent);
    if (newTaskText && newTaskText.trim() !== '') {
        taskTitle.textContent = newTaskText;

        const newPriority = prompt('Edit priority (low/medium/high):', taskDetails.textContent.split(',')[0].split(':')[1].trim());
        const newDueDate = prompt('Edit due date (YYYY-MM-DD):', taskDetails.textContent.split(',')[1].split(':')[1].trim());
        const newCategory = prompt('Edit category:', taskDetails.textContent.split(',')[2].split(':')[1].trim());

        taskDetails.textContent = `Priority: ${newPriority}, Due: ${newDueDate}, Category: ${newCategory}`;

        saveTasks();
    }
}

function deleteTask(taskItem) {
    if (confirm('Are you sure you want to delete this task?')) {
        taskItem.remove();
        saveTasks();
    }
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(task => {
        const taskInfo = task.querySelector('.task-info');
        const taskTitle = taskInfo.querySelector('.task-title');
        const taskDetails = taskInfo.querySelector('.task-details');
        tasks.push({
            text: taskTitle.textContent,
            completed: task.classList.contains('completed'),
            details: taskDetails.textContent
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            document.getElementById('task-list').appendChild(taskElement);
        });
    }
}

// Event Listeners
document.getElementById('add-task').addEventListener('click', addTask);

document.getElementById('task-list').addEventListener('click', function(e) {
    if (e.target.tagName === 'LI') {
        e.target.classList.toggle('completed');
        saveTasks();
    }
});

// Filter tasks
document.getElementById('filter-priority').addEventListener('change', filterTasks);
document.getElementById('filter-category').addEventListener('input', filterTasks);

function filterTasks() {
    const priorityFilter = document.getElementById('filter-priority').value;
    const categoryFilter = document.getElementById('filter-category').value.toLowerCase();

    document.querySelectorAll('.task-item').forEach(task => {
        const taskDetails = task.querySelector('.task-details').textContent.toLowerCase();
        const matchesPriority = priorityFilter === 'all' || taskDetails.includes(priorityFilter);
        const matchesCategory = categoryFilter === '' || taskDetails.includes(categoryFilter);

        if (matchesPriority && matchesCategory) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    });
}

window.addEventListener('load', loadTasks);
