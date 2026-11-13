const API_BASE = import.meta?.env?.VITE_API_BASE || 'http://localhost:5000/api';
const AUTH_KEY = 'designer-marketplace-user';

function getSavedToken() {
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user?.token || null;
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = { ...(options.headers || {}) };
  const token = getSavedToken();
  if (token && !headers['Authorization']) headers['Authorization'] = `Bearer ${token}`;
  if (!headers['Content-Type'] && !(options && options.body instanceof FormData)) headers['Content-Type'] = 'application/json';

  const fetchOptions = { ...options, headers };
  const res = await fetch(url, fetchOptions);
  const text = await res.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!res.ok) {
    const err = (body && body.error) || body || res.statusText || 'Request failed';
    const e = new Error(err);
    e.status = res.status;
    e.body = body;
    throw e;
  }
  return body;
}

export const client = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, data) => request(path, { method: 'POST', body: JSON.stringify(data) }),
  patch: (path, data) => request(path, { method: 'PATCH', body: JSON.stringify(data) }),
  del: (path) => request(path, { method: 'DELETE' }),
};

export default client;
