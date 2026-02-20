import { splitForRender } from "./tasks.js";

function makeTaskItem(task) {
  const item = document.createElement("li");
  item.className = `task-item${task.done ? " done" : ""}${task.overdue ? " overdue" : ""}`;
  item.dataset.id = task.id;
  item.tabIndex = 0;
  item.draggable = true;

  const check = document.createElement("button");
  check.className = "task-check";
  check.type = "button";
  check.dataset.action = "toggle";
  check.setAttribute("aria-label", `Toggle ${task.text}`);

  const main = document.createElement("div");
  main.className = "task-main";

  const text = document.createElement("span");
  text.className = "task-text";
  text.textContent = task.text;
  text.dataset.action = "edit";
  text.title = "Double-click to edit";

  main.appendChild(text);

  if (task.overdue && !task.done) {
    const tag = document.createElement("span");
    tag.className = "overdue-tag";
    tag.textContent = "⚠ Overdue";
    main.appendChild(tag);
  }

  const del = document.createElement("button");
  del.className = "delete-btn";
  del.type = "button";
  del.dataset.action = "delete";
  del.setAttribute("aria-label", `Delete ${task.text}`);
  del.textContent = "✕";

  item.append(check, main, del);
  return item;
}

function renderList(target, tasks) {
  target.innerHTML = "";
  tasks.forEach((task) => target.appendChild(makeTaskItem(task)));
}

export function renderTasks(tasks) {
  const overdueSection = document.getElementById("overdue-section");
  const overdueList = document.getElementById("overdue-list");
  const todayList = document.getElementById("today-list");
  const todayCount = document.getElementById("today-count");
  const doneCount = document.getElementById("done-count");
  const emptyState = document.getElementById("empty-state");
  const groups = splitForRender(tasks);
  const activeCount = tasks.filter((task) => !task.done).length;
  const completedCount = tasks.filter((task) => task.done).length;

  renderList(overdueList, groups.overdue);
  renderList(todayList, groups.today);

  overdueSection.classList.toggle("hidden", groups.overdue.length === 0);
  emptyState.classList.toggle("hidden", tasks.length > 0);
  todayCount.textContent = String(activeCount);
  doneCount.textContent = String(completedCount);
}

export function setupDragAndDrop(onReorder) {
  let draggedElement = null;
  let sourceList = null;
  let lastIndicatorElement = null;
  let lastIndicatorClass = null;

  document.body.addEventListener("dragstart", (event) => {
    const taskItem = event.target.closest(".task-item");
    if (!taskItem) return;

    draggedElement = taskItem;
    sourceList = taskItem.parentElement;
    taskItem.classList.add("dragging");
    event.dataTransfer.effectAllowed = "move";
  });

  document.body.addEventListener("dragend", (event) => {
    const taskItem = event.target.closest(".task-item");
    if (taskItem) {
      taskItem.classList.remove("dragging");
    }
    
    // Clean up any drag-over indicators
    document.querySelectorAll(".drag-over-top, .drag-over-bottom").forEach((el) => {
      el.classList.remove("drag-over-top", "drag-over-bottom");
    });
    
    draggedElement = null;
    sourceList = null;
    lastIndicatorElement = null;
    lastIndicatorClass = null;
  });

  document.body.addEventListener("dragover", (event) => {
    event.preventDefault();
    const taskItem = event.target.closest(".task-item");
    
    if (!taskItem || !draggedElement || taskItem === draggedElement) {
      // Clean up indicators if not over a valid target
      if (lastIndicatorElement) {
        lastIndicatorElement.classList.remove("drag-over-top", "drag-over-bottom");
        lastIndicatorElement = null;
        lastIndicatorClass = null;
      }
      return;
    }

    const list = taskItem.parentElement;
    if (list !== sourceList) return;

    const rect = taskItem.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const isTop = event.clientY < midpoint;
    const indicatorClass = isTop ? "drag-over-top" : "drag-over-bottom";
    
    // Check if we need to update indicator or position
    const indicatorChanged = lastIndicatorElement !== taskItem || lastIndicatorClass !== indicatorClass;
    
    if (!indicatorChanged) {
      return; // Nothing changed, skip update
    }
    
    // Update indicator
    if (lastIndicatorElement) {
      lastIndicatorElement.classList.remove("drag-over-top", "drag-over-bottom");
    }
    taskItem.classList.add(indicatorClass);
    lastIndicatorElement = taskItem;
    lastIndicatorClass = indicatorClass;
    
    // Move element only if needed
    const targetSibling = isTop ? taskItem : taskItem.nextSibling;
    if (draggedElement.nextSibling !== targetSibling) {
      list.insertBefore(draggedElement, targetSibling);
    }
  });

  document.body.addEventListener("drop", (event) => {
    event.preventDefault();
    if (!sourceList) return;

    const newOrder = Array.from(sourceList.querySelectorAll(".task-item")).map(
      (item) => item.dataset.id
    );
    onReorder(newOrder, sourceList.id);
    
    // Clean up indicators
    document.querySelectorAll(".drag-over-top, .drag-over-bottom").forEach((el) => {
      el.classList.remove("drag-over-top", "drag-over-bottom");
    });
  });
}

export function activateTaskItem(id) {
  document.querySelectorAll(".task-item.active").forEach((node) => node.classList.remove("active"));
  if (!id) {
    return;
  }

  const item = document.querySelector(`.task-item[data-id='${id}']`);
  if (item) {
    item.classList.add("active");
    item.focus();
  }
}

export function startInlineEdit(taskId, currentText, onConfirm, onCancel) {
  const item = document.querySelector(`.task-item[data-id='${taskId}']`);
  if (!item) {
    return;
  }

  const textNode = item.querySelector(".task-text");
  if (!textNode) {
    return;
  }

  const input = document.createElement("input");
  input.type = "text";
  input.value = currentText;
  input.className = "task-edit";

  const confirm = () => {
    const nextText = input.value.trim();
    if (nextText) {
      onConfirm(nextText);
    } else {
      onCancel();
    }
  };

  const cancel = () => onCancel();

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      confirm();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      cancel();
    }
  });

  input.addEventListener("blur", confirm);
  textNode.replaceWith(input);
  input.focus();
  input.select();
}