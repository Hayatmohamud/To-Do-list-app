// 1. adding tasks
// Step 1: Wait for the DOM to load completely
document.addEventListener("DOMContentLoaded", function () {
    
    // Step 1: Select Elements
    const todoForm = document.querySelector("#todo-form");
    const todoInput = document.querySelector("#todo-input");
    const todoList = document.querySelector("#todo-list");

    // Step 2: Add Event Listener to the Form
    // Event Listener for adding a new task
    todoForm.addEventListener("submit", addTask);

    // Step 3: Define the addTask Function
    function addTask(e) {
        e.preventDefault();   // Stops the form from refreshing the page.
        const taskText = todoInput.value.trim();
        // Create Task Object: Each task has a unique id, text, and completed status.
        if (taskText !== '') {
            const task = {
                id: Date.now(),
                text: taskText,
                completed: false
            }
            addTaskToDOM(task); // Calls a function to display the task.
            saveTaskToLocalStorage(task); //Persists the task data.

            // clear the input field
            todoInput.value = "";
        }
    }

    // Step 4: Define the addTaskToDOM Function Using Plain HTML
    function addTaskToDOM(task) {
        // Create List Item (li): Represents a single task.
        const li = document.createElement("li");
        li.className = `todo-item${task.completed ? ' completed' : ''}`;
        li.dataset.id = task.id;

        // Set HTML Structure: Uses innerHTML to define the task's HTML structure directly, making it easier to understand.
        li.innerHTML = `
            <input type="checkbox" class="complete-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task">${task.text}</span>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;

        // Append to Task List: Adds the new task to the DOM.
        todoList.appendChild(li);

        // Attach Event Listeners: Calls a function to add interactivity.
        attachEventListeners(li, task);
    }

    // Step 5: Define the attachEventListeners Function
    function attachEventListeners(li, task) {
        // Select Elements: Finds the checkbox, edit button, and delete button within the li.
        const checkbox = li.querySelector('.complete-checkbox');
        const editButton = li.querySelector('.edit-btn');
        const deleteButton = li.querySelector('.delete-btn');

        // Attach Event Listeners: Adds individual event listeners to each element.
        checkbox.addEventListener('change', function () {
            toggleTaskCompletion(task.id, li, checkbox.checked);
        });

        editButton.addEventListener('click', function () {
            handleEdit(task.id, li);
        });

        deleteButton.addEventListener('click', function () {
            handleDelete(task.id, li);
        });
    }

    // 2. Displaying Tasks from Local Storage

    // Step 1: Load Tasks on Page Load
    loadTasks(); // This will run once DOM is loaded

    function loadTasks() {
        const tasks = getTasksFromLocalStorage();
        tasks.forEach(task => {
            addTaskToDOM(task);
        });
    }

    // Step 2: Define Helper Functions for Local Storage

    // Retrieves tasks from Local Storage.
    function getTasksFromLocalStorage() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    // Saves a new task to Local Storage.
    function saveTaskToLocalStorage(task) {
        const tasks = getTasksFromLocalStorage();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // 3. Deleting Tasks

    // Step 1: Define the handleDelete Function
    // handleDelete: Removes the task from the DOM and calls deleteTask.
    function handleDelete(taskId, li) {
        deleteTask(taskId);
        li.remove();
    }

    // Step 2: Define the deleteTask Function
    // deleteTask: Removes the task from Local Storage.
    function deleteTask(id) {
        let tasks = getTasksFromLocalStorage();
        tasks = tasks.filter(task => task.id != id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // 4. Editing Tasks

    // Step 1: Define the handleEdit Function
    // handleEdit: Prompts the user for a new task text and updates the DOM.
    function handleEdit(taskId, li) {
        const taskSpan = li.querySelector('.task');
        const newTaskText = prompt('Edit your task:', taskSpan.textContent);

        if (newTaskText !== null && newTaskText.trim() !== '') {
            updateTask(taskId, newTaskText);
            taskSpan.textContent = newTaskText;
        }
    }

    // Step 2: Define the updateTask Function
    // updateTask: Updates the task in Local Storage.
    function updateTask(id, newText) {
        const tasks = getTasksFromLocalStorage();
        const task = tasks.find(task => task.id == id);
        if (task) {
            task.text = newText;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    // 5. Marking Tasks as Completed

    // Step 1: Define the toggleTaskCompletion Function
    // Updates Task Status: Changes the completed property.
    // Updates Local Storage: Saves the new status.
    // Updates the DOM: Applies or removes the completed class.
    function toggleTaskCompletion(taskId, li, isCompleted) {
        const tasks = getTasksFromLocalStorage();
        const task = tasks.find(task => task.id == taskId);
        if (task) {
            task.completed = isCompleted;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            li.classList.toggle('completed', isCompleted);
        }
    }

});
