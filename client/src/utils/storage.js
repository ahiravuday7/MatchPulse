export const getStorageItem = (key, fallback = null) => {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

export const setStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeStorageItem = (key) => {
  localStorage.removeItem(key);
};

// This gives reusable localStorage helpers:
