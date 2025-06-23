const taskInput = document.getElementById("todo-input");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const inputError = document.getElementById("input-error");
const noTaskMsg = document.getElementById("masseg-notask");
let currentFilter = "All";
const filterButtons = document.querySelectorAll(".filter-button");
const deleteDoneBtn = document.getElementById("delete-donetask-button");
const deleteAllBtn = document.getElementById("delete-alltask-buttton");

const isValidTask = (text) => {
  if (text.trim() === "") {
    inputError.textContent = "Task cannot be empty";
    inputError.style.display = "block";
    return false;
  }

  if (/^\d/.test(text)) {
    inputError.textContent = "Task cannot start with a number";
    inputError.style.display = "block";
    return false;
  }

  if (text.trim().length < 5) {
    inputError.textContent = "Task must be at least 5 characters long";
    inputError.style.display = "block";
    return false;
  }

  inputError.style.display = "none";
  return true;
};

function showDialog({
  title = "",
  message = "",
  inputValue = "",
  confirmText = "Save",
  cancelText = "Cancel",
  showInput = false,
  onConfirm,
  onCancel,
}) {
  const oldDialog = document.getElementById("custom-dialog");
  if (oldDialog) oldDialog.remove();

  const overlay = document.createElement("div");
  overlay.id = "custom-dialog";
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0,0,0,0.18)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = 9999;

  const dialog = document.createElement("div");
  dialog.className = "dialog-box";

  const h2 = document.createElement("div");
  h2.className = "dialog-title";
  h2.textContent = title;
  dialog.appendChild(h2);

  if (message) {
    const msg = document.createElement("div");
    msg.textContent = message;
    msg.style.marginBottom = "14px";
    msg.style.textAlign = "center";
    dialog.appendChild(msg);
  }

  let input;
  if (showInput) {
    input = document.createElement("input");
    input.type = "text";
    input.value = inputValue;
    input.className = "dialog-input";
    dialog.appendChild(input);
  }

  const btns = document.createElement("div");
  btns.className = "dialog-actions";

  const okBtn = document.createElement("button");
  okBtn.className = "dialog-save";
  okBtn.textContent = confirmText;

  if (title === "Rename Task") {
    okBtn.style.backgroundColor = "#0d6efd";
    okBtn.style.color = "#fff";
  } else {
    okBtn.style.backgroundColor = "#e0e0e0";
    okBtn.style.color = "#000";
  }

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "dialog-cancel";
  cancelBtn.textContent = cancelText;

  okBtn.onclick = () => {
    overlay.remove();
    if (onConfirm) {
      if (showInput) {
        onConfirm(input.value);
      } else {
        onConfirm(undefined);
      }
    }
  };

  cancelBtn.onclick = () => {
    overlay.remove();
    if (onCancel) onCancel();
  };

  btns.appendChild(okBtn);
  btns.appendChild(cancelBtn);
  dialog.appendChild(btns);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);


}

const createTaskElement = (text, isDone = false) => {
  const li = document.createElement("li");
  li.className = "task-item";

  li.innerHTML = `
    <span class="task-text" style="${isDone ? "text-decoration: line-through; color: red;" : ""
    }">${text}</span>
    <div class="task-actions">
      <input type="checkbox" ${isDone ? "checked" : ""} class="task-checkbox">
      <button class="edit-btn" title="Edit Task"><svg   xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg></button>
      <button class="delete-btn" title="Delete Task"><svg   xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></button>
    </div>
  `;

  const checkbox = li.querySelector(".task-checkbox");
  const editBtn = li.querySelector(".edit-btn");
  const deleteBtn = li.querySelector(".delete-btn");
  const span = li.querySelector(".task-text");

  checkbox.addEventListener("change", () => {
    const checked = checkbox.checked;
    if (checked) {
      span.style.textDecoration = "line-through";
      span.style.color = "red";
      checkbox.style.accentColor = "red";
    } else {
      span.style.textDecoration = "none";
      span.style.color = "#000000";
      checkbox.style.accentColor = "";
    }
    updateTasksInLocalStorage();
  });

  editBtn.addEventListener("click", () => {
    showDialog({
      title: "Rename Task",
      inputValue: span.textContent,
      confirmText: "SAVE",
      cancelText: "CANCEL",
      showInput: true,
      onConfirm: (newValue) => {
        if (newValue !== null && isValidTask(newValue)) {
          span.textContent = newValue;
          updateTasksInLocalStorage();
        }
      },
    });
  });

  deleteBtn.addEventListener("click", () => {
    showDialog({
      title: "Delete Task",
      message: "Are you sure you want to delete this task?",
      confirmText: "Delete",
      cancelText: "Cancel",
      showInput: false,
      onConfirm: () => {
        li.remove();
        updateNoTaskMessage();
        updateTasksInLocalStorage();
      },
    });
  });

  taskList.appendChild(li);
  updateDeleteButtons();
};

const addTask = () => {
  const value = taskInput.value.trim();
  if (!isValidTask(value)) return;
  saveTaskToLocalStorage(value);
  taskInput.value = "";
  renderTasks();
};

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("input", () => {
  inputError.style.display = "none";
});

const updateTasksInLocalStorage = () => {
  const tasks = [];
  document.querySelectorAll(".task-item").forEach((li) => {
    const text = li.querySelector(".task-text").textContent;
    const isDone = li.querySelector(".task-checkbox").checked;
    tasks.push({ text, isDone });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
};

const getTasksFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("tasks")) || [];
};

const saveTaskToLocalStorage = (task) => {
  const tasks = getTasksFromLocalStorage();
  tasks.push({ text: task, isDone: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

window.addEventListener("DOMContentLoaded", () => {
  renderTasks();
  updateDeleteButtons();
});

const renderTasks = () => {
  const allTasks = getTasksFromLocalStorage();
  let filteredTasks = [];

  if (currentFilter === "All") {
    filteredTasks = allTasks;
  } else if (currentFilter === "Done") {
    filteredTasks = allTasks.filter((task) => task.isDone);
  } else if (currentFilter === "Todo") {
    filteredTasks = allTasks.filter((task) => !task.isDone);
  }

  taskList.innerHTML = "";
  filteredTasks.forEach((task) => createTaskElement(task.text, task.isDone));
  updateNoTaskMessage();
};

const updateNoTaskMessage = () => {
  noTaskMsg.style.display = taskList.children.length === 0 ? "block" : "none";
};

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.textContent;
    renderTasks();
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

const updateDeleteButtons = () => {
  const allTasks = document.querySelectorAll(".task-item");
  deleteDoneBtn.disabled = allTasks.length === 0;
  deleteAllBtn.disabled = allTasks.length === 0;
};

const showNoTasksAlert = () => {
  alert("No tasks to delete");
};

deleteAllBtn.addEventListener("click", () => {
  const tasks = document.querySelectorAll(".task-item");
  if (tasks.length === 0) {
    showNoTasksAlert();
    return;
  }

  showDialog({
    title: "Delete All Tasks",
    message: "Are you sure you want to delete all tasks?",
    confirmText: "Delete All",
    cancelText: "Cancel",
    showInput: false,
    onConfirm: () => {
      tasks.forEach((task) => task.remove());
      updateTasksInLocalStorage();
      updateNoTaskMessage();
      updateDeleteButtons();
    },
  });
});

deleteDoneBtn.addEventListener("click", () => {
  const tasks = document.querySelectorAll(".task-item");
  const doneTasks = Array.from(tasks).filter(
    (task) => task.querySelector(".task-checkbox").checked
  );

  if (doneTasks.length === 0) {
    showNoTasksAlert();
    return;
  }

  showDialog({
    title: "Delete Completed Tasks",
    message: "Are you sure you want to delete all completed tasks?",
    confirmText: "Delete Done",
    cancelText: "Cancel",
    showInput: false,
    onConfirm: () => {
      doneTasks.forEach((task) => task.remove());
      updateTasksInLocalStorage();
      updateNoTaskMessage();
      updateDeleteButtons();
    },
  });
});

 