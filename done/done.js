let doneList = JSON.parse(localStorage.getItem("doneList")) || [];
let todoList = JSON.parse(localStorage.getItem("todoList")) || [];

let debounceTimeout;
let loading = false;

const taskSearch = document.getElementById('taskSearch');

taskSearch.addEventListener('input', () => {
  loading = true;
  renderTasks();
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(searchTask, 500);
});

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

function searchTask() {
  const query = taskSearch.value.trim();
  const filteredTasks = doneList.filter(task => task.taskName.toLowerCase().includes(query.toLowerCase()));
  loading = false;
  renderTasks(filteredTasks);
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
  const task = doneList.find(task => task.id === id);
  
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
  const taskIndex = doneList.findIndex(task => task.id === id);

  if (taskIndex !== -1) {
    const task = doneList[taskIndex];
    task.completed = !task.completed;

    if (!task.completed) {
      todoList = [...todoList, task];
    } else {
      todoList = todoList.filter(todoTask => todoTask.id !== id);
    }

    doneList = doneList.filter(doneTask => doneTask.id !== id || doneTask.completed);
  }

  saveToLocalStorage();
  renderTasks();
}

function renderTasks(filteredList = doneList) {
  const taskListContainer = document.getElementById('taskList');
  taskListContainer.innerHTML = '';

  if (loading) {
    taskListContainer.innerHTML = 'Loading...';
    return;
  }
  
  filteredList.forEach((task) => {
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

renderTasks();
