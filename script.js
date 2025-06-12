 const taskInput = document.getElementById('todo-input');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const inputError = document.getElementById('input-error');
const noTaskMsg = document.getElementById('masseg-notask');

 
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

 
const createTaskElement = (text) => {
  const li = document.createElement('li');
  li.className = 'task-item';
  li.textContent = text;
  taskList.appendChild(li);
  checkIfNoTasks();
};

 
const addTask = () => {
  const value = taskInput.value.trim();

  if (!isValidTask(value)) return;

  createTaskElement(value);
  taskInput.value = '';
};

 
addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('input', () => {
  inputError.style.display = 'none';
});

const getTasksFromLocalStorage = () => {
   
  return JSON.parse(localStorage.getItem('tasks')) || [];
};

const saveTaskToLocalStorage = (task) => {
  const tasks = getTasksFromLocalStorage();  
  tasks.push({ text: task, isDone: false });  
  localStorage.setItem('tasks', JSON.stringify(tasks));  
};



 
