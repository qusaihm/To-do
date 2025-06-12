 const todoInput = document.getElementById("todo-input");
const addTaskButtton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const noTaskMsg = document.getElementById("masseg-notask");
 
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
