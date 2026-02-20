const DEFAULT_KEY = "qn_tasks";

function hasChromeStorage() {
  return typeof chrome !== "undefined" && chrome.storage && chrome.storage.local;
}

export async function load(key = DEFAULT_KEY) {
  if (hasChromeStorage()) {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        resolve(Array.isArray(result[key]) ? result[key] : []);
      });
    });
  }

  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function save(key = DEFAULT_KEY, data = []) {
  if (hasChromeStorage()) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: data }, () => resolve());
    });
  }

  localStorage.setItem(key, JSON.stringify(data));
}

export { DEFAULT_KEY };