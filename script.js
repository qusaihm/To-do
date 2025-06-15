 const taskInput = document.getElementById('todo-input');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const inputError = document.getElementById('input-error');
const noTaskMsg = document.getElementById('masseg-notask');
let currentFilter = 'All'; 
const filterButtons = document.querySelectorAll('.filter-button');
 
const isValidTask = (text) => {
  if (text.trim() === '') {
    inputError.textContent = 'Task cannot be empty';
    inputError.style.display = 'block';
    return false;
  }

  if (/^\d/.test(text)) {
    inputError.textContent = 'Task cannot start with a number';
    inputError.style.display = 'block';
    return false;
  }

  if (text.trim().length < 5) {
    inputError.textContent = 'Task must be at least 5 characters long';
    inputError.style.display = 'block';
    return false;
  }

  inputError.style.display = 'none';
  return true;
};

  const createTaskElement = (text, isDone = false) => {
  const li = document.createElement('li');
  li.className = 'task-item';

  const span = document.createElement('span');
  span.textContent = text;
  span.className = 'task-text';
  span.style.flex = '1';

  if (isDone) {
    span.style.textDecoration = 'line-through';
    span.style.color = 'red';
  }

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = isDone;
  checkbox.className = 'task-checkbox';
  if (isDone) checkbox.style.accentColor = 'red';

 
  checkbox.addEventListener('change', () => {
    const checked = checkbox.checked;
    span.style.textDecoration = checked ? 'line-through' : 'none';
    span.style.color = checked ? 'red' : '#000000';
    checkbox.style.accentColor = checked ? 'red' : '';
    updateTasksInLocalStorage();
  });

   
  const editBtn = document.createElement('button');
  editBtn.textContent = '✏️';
  editBtn.className = 'edit-btn';

  editBtn.addEventListener('click', () => {
    const newText = prompt('Rename Task', span.textContent);
    if (newText !== null && isValidTask(newText)) {
      span.textContent = newText;
      updateTasksInLocalStorage();
    }
  });

 
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '🗑️';
  deleteBtn.className = 'delete-btn';

  deleteBtn.addEventListener('click', () => {
    li.remove();
    updateNoTaskMessage();        
    updateTasksInLocalStorage();  
  });

   
  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'task-actions';
  actionsDiv.appendChild(checkbox);
  actionsDiv.appendChild(editBtn);
  actionsDiv.appendChild(deleteBtn);

  li.appendChild(span);
  li.appendChild(actionsDiv);
  taskList.appendChild(li);
};



 
 const addTask = () => {
  const value = taskInput.value.trim();

  if (!isValidTask(value)) return;

  createTaskElement(value);          
  saveTaskToLocalStorage(value);     
  taskInput.value = '';  
  updateNoTaskMessage();            
};


 
addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('input', () => {
  inputError.style.display = 'none';
});

const updateTasksInLocalStorage = () => {
  const tasks = [];
  document.querySelectorAll('.task-item').forEach(li => {
    const text = li.querySelector('.task-text').textContent;
    const isDone = li.querySelector('.task-checkbox').checked;
    tasks.push({ text, isDone });
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
};


const getTasksFromLocalStorage = () => {
   
  return JSON.parse(localStorage.getItem('tasks')) || [];
};

const saveTaskToLocalStorage = (task) => {
  const tasks = getTasksFromLocalStorage();  
  tasks.push({ text: task, isDone: false });  
  localStorage.setItem('tasks', JSON.stringify(tasks));  
};

window.addEventListener('DOMContentLoaded', () => {
  const tasks = getTasksFromLocalStorage();
  tasks.forEach(task => createTaskElement(task.text, task.isDone));
  updateNoTaskMessage();
});


 const renderTasks = () => {
  const allTasks = getTasksFromLocalStorage();
  let filteredTasks = [];

  if (currentFilter === 'All') {
    filteredTasks = allTasks;
  } else if (currentFilter === 'Done') {
    filteredTasks = allTasks.filter(task => task.isDone);
  } else if (currentFilter === 'Todo') {
    filteredTasks = allTasks.filter(task => !task.isDone);
  }

taskList.innerHTML = '';
  filteredTasks.forEach(task => createTaskElement(task.text, task.isDone));
  updateNoTaskMessage();

};



 const updateNoTaskMessage = () => {
  noTaskMsg.style.display = taskList.children.length === 0 ? 'block' : 'none';
};

