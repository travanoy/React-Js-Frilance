const API_BASE = 'http://localhost:5000/api';

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Не удалось загрузить статистику');
  return res.json();
}
