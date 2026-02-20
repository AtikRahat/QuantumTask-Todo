import {
  addTask,
  deleteTask,
  editTask,
  getRolledOverTasks,
  getTasks,
  setTasks,
  toggleTask
} from "./tasks.js";
import { activateTaskItem, renderTasks, startInlineEdit } from "./ui.js";
import { registerShortcuts } from "./shortcuts.js";

let tasks = [];
let focusedTaskId = null;
let editingTaskId = null;

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const clockEl = document.getElementById("clock");
const dateEl = document.getElementById("date");
const greetingEl = document.getElementById("greeting");

function updateClockAndDate() {
  const now = new Date();
  clockEl.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  dateEl.textContent = now.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric"
  });

  const hour = now.getHours();
  if (hour < 12) {
    greetingEl.textContent = "Good morning";
  } else if (hour < 18) {
    greetingEl.textContent = "Good afternoon";
  } else {
    greetingEl.textContent = "Good evening";
  }
}

async function commitAndRender(nextTasks) {
  tasks = nextTasks;
  await setTasks(tasks);
  renderTasks(tasks);
  activateTaskItem(focusedTaskId);
}

async function handleAddTask() {
  const nextTasks = addTask(tasks, taskInput.value);
  if (nextTasks === tasks) {
    return;
  }

  taskInput.value = "";
  await commitAndRender(nextTasks);
}

function getTaskById(id) {
  return tasks.find((task) => task.id === id) || null;
}

async function handleDelete(taskId) {
  const item = document.querySelector(`.task-item[data-id='${taskId}']`);
  if (item) {
    item.classList.add("removing");
    await new Promise((resolve) => setTimeout(resolve, 160));
  }
  const nextTasks = deleteTask(tasks, taskId);
  if (focusedTaskId === taskId) {
    focusedTaskId = null;
  }
  await commitAndRender(nextTasks);
}

async function handleToggle(taskId) {
  const nextTasks = toggleTask(tasks, taskId);
  await commitAndRender(nextTasks);
}

async function handleEdit(taskId, text) {
  const nextTasks = editTask(tasks, taskId, text);
  editingTaskId = null;
  await commitAndRender(nextTasks);
}

function cancelEdit() {
  editingTaskId = null;
  renderTasks(tasks);
  activateTaskItem(focusedTaskId);
}

function bindEvents() {
  taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await handleAddTask();
  });

  document.body.addEventListener("click", async (event) => {
    const taskItem = event.target.closest(".task-item");
    if (taskItem) {
      focusedTaskId = taskItem.dataset.id;
      activateTaskItem(focusedTaskId);
    }

    const actionNode = event.target.closest("[data-action]");
    if (!actionNode || !taskItem) {
      return;
    }

    const action = actionNode.dataset.action;
    if (action === "toggle") {
      await handleToggle(taskItem.dataset.id);
      return;
    }
    if (action === "delete") {
      await handleDelete(taskItem.dataset.id);
    }
  });

  document.body.addEventListener("dblclick", (event) => {
    const textNode = event.target.closest(".task-text");
    if (!textNode) {
      return;
    }

    const taskItem = textNode.closest(".task-item");
    if (!taskItem) {
      return;
    }

    const taskId = taskItem.dataset.id;
    const task = getTaskById(taskId);
    if (!task) {
      return;
    }

    editingTaskId = taskId;
    startInlineEdit(
      taskId,
      task.text,
      async (nextText) => {
        await handleEdit(taskId, nextText);
      },
      cancelEdit
    );
  });

  registerShortcuts({
    getEditingTaskId: () => editingTaskId,
    getFocusedTaskId: () => focusedTaskId,
    focusInput: () => taskInput.focus(),
    addOrConfirm: handleAddTask,
    cancelEdit,
    deleteFocused: async () => {
      if (focusedTaskId) {
        await handleDelete(focusedTaskId);
      }
    },
    toggleFocused: async () => {
      if (focusedTaskId) {
        await handleToggle(focusedTaskId);
      }
    }
  });
}

async function bootstrap() {
  updateClockAndDate();
  setInterval(updateClockAndDate, 1000 * 15);

  tasks = await getTasks();
  const rolled = getRolledOverTasks(tasks);
  tasks = rolled.tasks;
  if (rolled.changed) {
    await setTasks(tasks);
  }

  renderTasks(tasks);
  bindEvents();
}

bootstrap();