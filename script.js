// Sample task data
const sampleTasks = [
    {
        id: 1,
        title: "Complete Project Proposal",
        description: "Finish the draft and send it to the team for review",
        dueDate: "2025-04-02",
        category: "Work"
    },
    {
        id: 2,
        title: "Grocery Shopping",
        description: "Buy fruits, vegetables, and household items",
        dueDate: "2025-03-26",
        category: "Personal"
    },
    {
        id: 3,
        title: "Dentist Appointment",
        description: "Regular checkup at Dr. Smith's clinic",
        dueDate: "2025-03-30",
        category: "Health"
    },
    {
        id: 4,
        title: "Learn JavaScript",
        description: "Complete chapter 5 of the online course",
        dueDate: "2025-04-10",
        category: "Learning"
    },
    {
        id: 5,
        title: "Team Meeting",
        description: "Discuss Q2 goals with the department",
        dueDate: "2025-03-27",
        category: "Work"
    }
];

// Sorting state
let sortConfig = {
    field: 'title',
    direction: 'asc'
};

// Filter state
let filterCategory = 'All';

// Initialize tasks array
let currentTasks = [...sampleTasks];

// Format date function
function formatDate(dateString) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Generate unique ID
function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

// Function to create a new task card
function createTaskCard(task, isEditing = false) {
    const card = document.createElement('div');
    card.className = 'sticky-note';
    card.dataset.taskId = task.id;
    
    if (isEditing) {
        // Create editable task card
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.value = task.title;
        titleInput.placeholder = 'Task title';
        
        const descTextarea = document.createElement('textarea');
        descTextarea.value = task.description;
        descTextarea.placeholder = 'Task description';
        descTextarea.style.height = '60px';
        
        const dueDateInput = document.createElement('input');
        dueDateInput.type = 'date';
        dueDateInput.value = task.dueDate;
        
        const categorySelect = document.createElement('select');
        ['Work', 'Personal', 'Urgent', 'Learning', 'Health'].forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            option.selected = cat === task.category;
            categorySelect.appendChild(option);
        });
        
        const actionBtns = document.createElement('div');
        actionBtns.className = 'action-buttons';
        
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn save-btn';
        saveBtn.textContent = 'Save';
        saveBtn.addEventListener('click', function() {
            // Update task data
            task.title = titleInput.value;
            task.description = descTextarea.value;
            task.dueDate = dueDateInput.value;
            task.category = categorySelect.value;
            
            // Update the task in the current tasks array
            const taskIndex = currentTasks.findIndex(t => t.id === task.id);
            if (taskIndex !== -1) {
                currentTasks[taskIndex] = task;
            }
            
            // Apply sorting and filtering again
            applyFiltersAndSort();
        });
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn cancel-btn';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.addEventListener('click', function() {
            // Replace with view card without saving
            const newCard = createTaskCard(task);
            card.parentNode.replaceChild(newCard, card);
        });
        
        actionBtns.appendChild(saveBtn);
        actionBtns.appendChild(cancelBtn);
        
        card.appendChild(titleInput);
        card.appendChild(descTextarea);
        card.appendChild(dueDateInput);
        card.appendChild(categorySelect);
        card.appendChild(actionBtns);
        
    } else {
        // Create view-only task card
        const taskTools = document.createElement('div');
        taskTools.className = 'task-tools';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'tool-btn';
        editBtn.innerHTML = '✏️';
        editBtn.title = 'Edit';
        editBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const newCard = createTaskCard(task, true);
            card.parentNode.replaceChild(newCard, card);
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'tool-btn';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Delete';
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this task?')) {
                // Remove from data
                currentTasks = currentTasks.filter(t => t.id !== task.id);
                // Remove from DOM
                card.remove();
            }
        });
        
        taskTools.appendChild(editBtn);
        taskTools.appendChild(deleteBtn);
        
        const taskTitle = document.createElement('div');
        taskTitle.className = 'task-title';
        taskTitle.textContent = task.title;
        
        const taskDesc = document.createElement('div');
        taskDesc.className = 'task-desc';
        taskDesc.textContent = task.description;
        
        const taskDue = document.createElement('div');
        taskDue.className = 'task-due';
        taskDue.textContent = formatDate(task.dueDate);
        
        const taskCategory = document.createElement('div');
        taskCategory.className = 'task-category';
        taskCategory.textContent = task.category;
        
        card.appendChild(taskTools);
        card.appendChild(taskTitle);
        card.appendChild(taskDesc);
        card.appendChild(taskDue);
        card.appendChild(taskCategory);
    }
    
    return card;
}

// Function to sort tasks
function sortTasks(tasks, field, direction) {
    return [...tasks].sort((a, b) => {
        let compareA, compareB;
        
        // Handle different field types
        if (field === 'dueDate') {
            compareA = new Date(a[field]);
            compareB = new Date(b[field]);
        } else {
            compareA = a[field].toLowerCase();
            compareB = b[field].toLowerCase();
        }
        
        // Sort based on direction
        if (direction === 'asc') {
            return compareA > compareB ? 1 : -1;
        } else {
            return compareA < compareB ? 1 : -1;
        }
    });
}

// Function to filter tasks
function filterTasks(tasks, category) {
    if (category === 'All') {
        return tasks;
    } else {
        return tasks.filter(task => task.category === category);
    }
}

// Apply filters and sorting
function applyFiltersAndSort() {
    console.log("Applying filters and sorting..."); // Debugging

    // Ensure category filter is correctly read
    let categoryFilterElement = document.getElementById('filterCategory');
    if (categoryFilterElement) {
        filterCategory = categoryFilterElement.value;
    }

    console.log("Current Filter Category:", filterCategory); // Debugging

    // Step 1: Filter tasks
    let filteredTasks = filterCategory === 'All' 
        ? [...currentTasks] 
        : currentTasks.filter(task => task.category === filterCategory);

    console.log("Filtered Tasks:", filteredTasks); // Debugging

    // Step 2: Sort tasks
    filteredTasks = sortTasks(filteredTasks, sortConfig.field, sortConfig.direction);

    console.log("Sorted Tasks:", filteredTasks); // Debugging

    // Step 3: Render the updated tasks
    renderTasks(filteredTasks);
}


// Function to render task cards
function renderTasks(tasks) {
    const taskGrid = document.getElementById('taskGrid');
    
    // Clear existing tasks (except the add button)
    while (taskGrid.childNodes.length > 1) {
        taskGrid.removeChild(taskGrid.lastChild);
    }
    
    // Generate task cards
    tasks.forEach(task => {
        const card = createTaskCard(task);
        taskGrid.appendChild(card);
    });
}

// Setup event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize with sample tasks
    applyFiltersAndSort();
    
    // Add task button functionality
    document.getElementById('addTaskBtn').addEventListener('click', function() {
        // Create a new blank task
        const newTask = {
            id: generateId(),
            title: "New Task",
            description: "Click edit to add details",
            dueDate: new Date().toISOString().split('T')[0],
            category: "Personal"
        };
        
        // Add to task list
        currentTasks.unshift(newTask);
        
        // Add directly to DOM (for efficiency)
        const newCard = createTaskCard(newTask, true);  // Create in edit mode
        const taskGrid = document.getElementById('taskGrid');
        taskGrid.insertBefore(newCard, taskGrid.childNodes[1]);  // Insert after add button
    });
    
    // Clear all tasks
    document.getElementById('clearAllBtn').addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all tasks?')) {
            currentTasks = [];
            applyFiltersAndSort();
        }
    });
    
    // Filter by category
    document.getElementById('filterCategory').addEventListener('change', function() {
        filterCategory = this.value;
        console.log("Filter Category:", filterCategory); // Debugging
        applyFiltersAndSort();
    });
    
    // Sort by field
    document.getElementById('sortBy').addEventListener('change', function() {
        sortConfig.field = this.value;
        applyFiltersAndSort();
    });
    
    // Toggle sort direction
    document.getElementById('sortDirectionBtn').addEventListener('click', function() {
        // Toggle direction
        sortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
        
        // Update direction indicator
        document.getElementById('sortDirection').textContent = 
            sortConfig.direction === 'asc' ? '↓' : '↑';
        
        // Re-apply sorting
        applyFiltersAndSort();
    });
});