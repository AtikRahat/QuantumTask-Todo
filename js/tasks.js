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

export function splitForRender(tasks) {
  const overdue = tasks
    .filter((task) => !task.done && task.overdue)
    .sort((a, b) => b.createdAt - a.createdAt);

  const todayActive = tasks
    .filter((task) => !task.done && !task.overdue)
    .sort((a, b) => b.createdAt - a.createdAt);

  const completed = tasks
    .filter((task) => task.done)
    .sort((a, b) => b.createdAt - a.createdAt);

  return { overdue, today: [...todayActive, ...completed] };
}