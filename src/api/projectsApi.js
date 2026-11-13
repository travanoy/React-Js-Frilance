const API_BASE = 'http://localhost:5000/api';

export async function fetchProjects(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/projects${query ? `?${query}` : ''}`);
  if (!res.ok) throw new Error('Не удалось загрузить проекты');
  return res.json();
}
