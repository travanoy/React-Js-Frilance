const AUTH_KEY = 'designer-marketplace-user';

export function loadSavedUser() {
  const raw = window.localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveUser(user) {
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearUser() {
  window.localStorage.removeItem(AUTH_KEY);
}
