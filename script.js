 
const taskInput = document.getElementById('todo-input');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const inputError = document.getElementById('input-error');

 
const isValidTask = (text) => {
  if (text.trim() === '') {
    inputError.textContent = 'Task cannot be empty';
    inputError.style.display = 'block';
    return false;
  }

  if (/^\d/.test(text)) {
    inputError.textContent = 'Task cannot wtart with a number';
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

  const span = document.createElement('span');
  span.textContent = text;
  span.className = 'task-text';
  span.style.flex = '1';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';

  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'task-actions';
  actionsDiv.appendChild(checkbox);

  li.appendChild(span);
  li.appendChild(actionsDiv);
  taskList.appendChild(li);
};

