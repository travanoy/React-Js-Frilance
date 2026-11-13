const { readDB } = require('../middleware/db');

function getStats(req, res) {
  const db = readDB();

  const categoryCounts = {};
  for (const p of db.projects) {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  }
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, count]) => ({ category, count }));

  res.json({
    totalDesigners: db.designers.length,
    totalProjects: db.projects.length,
    totalOrders: db.orders.length,
    topCategories,
  });
}

module.exports = { getStats };
