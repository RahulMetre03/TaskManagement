 // Load tasks from local storage on page load
 document.addEventListener("DOMContentLoaded", loadTasks);

 function addTask() {
     const taskInput = document.getElementById("taskInput");
     const taskText = taskInput.value.trim();
     if (taskText === "") return;

     const task = { text: taskText, completed: false };
     let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
     tasks.push(task);
     localStorage.setItem("tasks", JSON.stringify(tasks));

     taskInput.value = "";
     renderTasks();
 }

 function renderTasks(filter = "all") {
     const taskList = document.getElementById("taskList");
     taskList.innerHTML = "";
     let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

     tasks.forEach((task, index) => {
         if (filter === "completed" && !task.completed) return;
         if (filter === "pending" && task.completed) return;

         let li = document.createElement("li");
         li.className = `task ${task.completed ? "completed" : ""}`;
         li.innerHTML = `
             <span onclick="toggleTask(${index})">${task.text}</span>
             <button class="btn edit-btn" onclick="editTask(${index})">Edit</button>
             <button class="btn delete-btn" onclick="deleteTask(${index})">Delete</button>
         `;

         taskList.appendChild(li);
     });
 }

 function toggleTask(index) {
     let tasks = JSON.parse(localStorage.getItem("tasks"));
     tasks[index].completed = !tasks[index].completed;
     localStorage.setItem("tasks", JSON.stringify(tasks));
     renderTasks();
 }

 function editTask(index) {
     let tasks = JSON.parse(localStorage.getItem("tasks"));
     let newTaskText = prompt("Edit Task:", tasks[index].text);
     if (newTaskText !== null && newTaskText.trim() !== "") {
         tasks[index].text = newTaskText.trim();
         localStorage.setItem("tasks", JSON.stringify(tasks));
         renderTasks();
     }
 }

 function deleteTask(index) {
     let tasks = JSON.parse(localStorage.getItem("tasks"));
     tasks.splice(index, 1);
     localStorage.setItem("tasks", JSON.stringify(tasks));
     renderTasks();
 }

 function filterTasks(status) {
     renderTasks(status);
 }

 function loadTasks() {
     renderTasks();
 }