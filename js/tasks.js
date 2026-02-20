import { DEFAULT_KEY, load, save } from "./storage.js";

const pad = (num) => String(num).padStart(2, "0");

export function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export async function getTasks() {
  return load(DEFAULT_KEY);
}

export async function setTasks(tasks) {
  await save(DEFAULT_KEY, tasks);
}

export function addTask(tasks, text) {
  const cleanText = text.trim();
  if (!cleanText) {
    return tasks;
  }

  const next = [
    {
      id: crypto.randomUUID(),
      text: cleanText,
      done: false,
      createdAt: Date.now(),
      dateKey: getTodayKey(),
      overdue: false
    },
    ...tasks
  ];

  return next;
}

export function toggleTask(tasks, id) {
  return tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task));
}

export function editTask(tasks, id, newText) {
  const cleanText = newText.trim();
  if (!cleanText) {
    return tasks;
  }

  return tasks.map((task) => (task.id === id ? { ...task, text: cleanText } : task));
}

export function deleteTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

export function getRolledOverTasks(tasks) {
  const today = getTodayKey();
  let changed = false;

  const nextTasks = tasks.map((task) => {
    const isOverdue = !task.done && task.dateKey < today;
    if (!isOverdue) {
      return { ...task, overdue: false };
    }

    changed = true;
    return {
      ...task,
      overdue: true,
      dateKey: today
    };
  });

  return {
    changed,
    tasks: nextTasks
  };
}

export function reorderTasks(tasks, newOrder, listId) {
  if (listId === "overdue-list") {
    const overdue = tasks.filter((task) => !task.done && task.overdue);
    const rest = tasks.filter((task) => task.done || !task.overdue);
    const reordered = newOrder.map((id) => overdue.find((t) => t.id === id)).filter(Boolean);
    return [...reordered, ...rest];
  }

  if (listId === "today-list") {
    const today = tasks.filter((task) => !task.overdue);
    const overdue = tasks.filter((task) => task.overdue && !task.done);
    const reordered = newOrder.map((id) => today.find((t) => t.id === id)).filter(Boolean);
    return [...overdue, ...reordered];
  }

  return tasks;
}

export function splitForRender(tasks) {
  const overdue = tasks
    .filter((task) => !task.done && task.overdue);

  const todayActive = tasks
    .filter((task) => !task.done && !task.overdue);

  const completed = tasks
    .filter((task) => task.done);

  return { overdue, today: [...todayActive, ...completed] };
}