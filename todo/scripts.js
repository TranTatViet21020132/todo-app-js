let todoList = JSON.parse(localStorage.getItem("todoList")) || [];
let doneList = JSON.parse(localStorage.getItem("doneList")) || [];

const navItems = document.querySelectorAll('.nav-item');
const currentPage = window.location.pathname.split('/').pop();

navItems.forEach(navItem => {
  const link = navItem.querySelector('a');
  if (link.getAttribute('href').includes(currentPage)) {
    navItem.classList.add('active');
  }
});

function saveToLocalStorage() {
  localStorage.setItem("todoList", JSON.stringify(todoList));
  localStorage.setItem("doneList", JSON.stringify(doneList));
}

function addTask() {
  const taskInput = document.getElementById('taskInput');
  const newTask = taskInput.value.trim();
  const maxId = todoList.reduce((max, task) => Math.max(max, task.id), 0);

  if (newTask) {
    const task = {
      id: maxId + 1,
      taskName: newTask,
      time: new Date().toLocaleString(),
      completed: false,
    };
    
    todoList = [...todoList, task];
    todoList.sort((a, b) => Date.parse(b.time) - Date.parse(a.time));
    
    saveToLocalStorage();
    renderTasks();
    taskInput.value = '';
  } else {
    alert("Please enter a task.");
  }
}

function deleteTask(id) {
  todoList = todoList.filter(task => task.id !== id);
  doneList = doneList.filter(task => task.id !== id);
  saveToLocalStorage();
  renderTasks();
}

function saveTask(id) {
  const taskNameInput = document.getElementById(`task-${id}`).querySelector('input');
  const taskName = taskNameInput.value.trim();

  if (taskName) {
    const taskIndex = todoList.findIndex(task => task.id === id);
    const task = todoList[taskIndex];
    task.taskName = taskName;

    saveToLocalStorage();
    renderTasks();
  } else {
    alert("Task name cannot be empty.");
  }
}

function cancelEdit() {
  renderTasks();
}

function editTask(id) {
  const task = todoList.find(task => task.id === id);
  
  if (task) {
    const taskName = document.getElementById(`task-${task.id}`);
    taskName.innerHTML = 
    `<div class="task__info">
      <h3><input type="text" value="${task.taskName}"></h3>
      <h5>${task.time}</h5>
    </div>
    <div class="editable__container">
      <button class="save-edit__btn btn"
        onclick="saveTask(${task.id})" 
        type="submit"
        style="background: green; 
        color: white"
      >
        <ion-icon name="bookmark-outline"></ion-icon>
      </button>

      <button class="cancel-edit__btn btn" onclick="cancelEdit()"
        style="background: red; 
        color: white"
      >
        <ion-icon name="close-outline"></ion-icon>
      </button>
    </div>`;
  }
}

function toggleTaskCompletion(id) {
  const taskIndex = todoList.findIndex(task => task.id === id);

  if (taskIndex !== -1) {
    const task = todoList[taskIndex];
    task.completed = !task.completed;

    if (task.completed) {
      doneList = [...doneList, task];
    } else {
      doneList = doneList.filter(doneTask => doneTask.id !== id);
    }

    todoList = todoList.filter(todoTask => todoTask.id !== id || !todoTask.completed);
  }

  saveToLocalStorage();
  renderTasks();
}


function renderTasks() {
  const taskListContainer = document.getElementById('taskList');
  taskListContainer.innerHTML = '';
  
  todoList.forEach((task) => {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.id = `task-${task.id}`;
    
    taskElement.innerHTML = 
      `<div class="task__info">
        <h3>${task.taskName}</h3>
        <h5>${task.time}</h5>
      </div>
      <div class="editable__container">
        <button class="completed__btn btn" onclick="toggleTaskCompletion(${task.id})" 
          style="background: ${task.completed ? 'green' : '#eee'}; 
          color: ${task.completed ? 'white' : 'black'}"
        >
          <ion-icon name="checkmark-outline"></ion-icon>
        </button>

        <button class="edit__btn btn" onclick="editTask(${task.id})">
          <ion-icon name="create-outline"></ion-icon>
        </button>

        <button class="delete__btn btn" onclick="deleteTask(${task.id})">
          <ion-icon name="trash-outline"></ion-icon>
        </button>
      </div>`;

    taskListContainer.appendChild(taskElement);
  });
}

document.getElementById('addTaskButton').addEventListener('click', (event) => {
  event.preventDefault();
  addTask();
});

renderTasks();