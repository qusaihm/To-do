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
    <span class="task-text" style="${
      isDone ? "text-decoration: line-through; color: red;" : ""
    }">${text}</span>
    <div class="task-actions">
      <input type="checkbox" ${isDone ? "checked" : ""} class="task-checkbox">
      <button class="edit-btn" title="Edit Task">✏️</button>
      <button class="delete-btn" title="Delete Task">🗑️</button>
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

const originalCreateTaskElement = createTaskElement;
createTaskElement = function (...args) {
  originalCreateTaskElement.apply(this, args);
  updateDeleteButtons();
};
