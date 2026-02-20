function isTypingTarget(target) {
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target.isContentEditable;
}

export function registerShortcuts({
  getEditingTaskId,
  getFocusedTaskId,
  focusInput,
  addOrConfirm,
  cancelEdit,
  deleteFocused,
  toggleFocused
}) {
  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const editingTaskId = getEditingTaskId();

    if (event.key.toLowerCase() === "n" && !isTypingTarget(target)) {
      event.preventDefault();
      focusInput();
      return;
    }

    if (event.key === "Enter") {
      if (!editingTaskId) {
        const active = document.activeElement;
        const inInput = active && active.id === "task-input";
        if (inInput) {
          event.preventDefault();
          addOrConfirm();
        }
      }
      return;
    }

    if (event.key === "Escape" && editingTaskId) {
      event.preventDefault();
      cancelEdit();
      return;
    }

    const focusedTaskId = getFocusedTaskId();
    if (!focusedTaskId || isTypingTarget(target)) {
      return;
    }

    if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      deleteFocused();
      return;
    }

    if (event.key === " ") {
      event.preventDefault();
      toggleFocused();
    }
  });
}