const { readDB, writeDB } = require('../middleware/db');
const { v4: uuidv4 } = require('uuid');

const CURRENCIES = ['AZN', 'USD'];
const CATEGORIES = ['ui-ux', 'branding', 'illustration', 'motion', 'print', 'other'];
const SORTS = ['rating', 'price', 'newest'];

function getDesigners(req, res) {
  const { skill, minRate, maxRate, isAvailable, category, search, sort } = req.query;

  if (sort && !SORTS.includes(sort)) {
    return res.status(400).json({ error: `sort must be one of: ${SORTS.join(', ')}` });
  }

  const db = readDB();
  let designers = db.designers;

  if (skill) {
    const s = skill.toLowerCase();
    designers = designers.filter((d) =>
      d.skills.some((k) => k.toLowerCase() === s)
    );
  }
  if (minRate !== undefined) {
    designers = designers.filter((d) => d.hourlyRate >= Number(minRate));
  }
  if (maxRate !== undefined) {
    designers = designers.filter((d) => d.hourlyRate <= Number(maxRate));
  }
  if (isAvailable !== undefined) {
    designers = designers.filter((d) => d.isAvailable === (isAvailable === 'true'));
  }
  if (category) {
    // Designers who have at least one portfolio project in this category.
    const ids = new Set(
      db.projects
        .filter((p) => p.category === category.toLowerCase())
        .map((p) => p.designerId)
    );
    designers = designers.filter((d) => ids.has(d.id));
  }
  if (search) {
    const q = search.toLowerCase();
    designers = designers.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.title.toLowerCase().includes(q) ||
        d.bio.toLowerCase().includes(q) ||
        d.skills.some((k) => k.toLowerCase().includes(q))
    );
  }

  switch (sort) {
    case 'rating':
      designers = [...designers].sort((a, b) => b.rating - a.rating);
      break;
    case 'price':
      designers = [...designers].sort((a, b) => a.hourlyRate - b.hourlyRate);
      break;
    case 'newest':
      designers = [...designers].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
  }

  res.json(designers);
}

function getDesignerById(req, res) {
  const db = readDB();
  const designer = db.designers.find((d) => d.id === req.params.id);
  if (!designer) return res.status(404).json({ error: 'Designer not found' });
  res.json(designer);
}

function createDesigner(req, res) {
  const {
    name, title, bio, avatar, skills, hourlyRate, currency, experience,
    location, email, phone, behanceUrl, dribbbleUrl, instagramUrl, isAvailable,
  } = req.body;

  if (!name || !title || hourlyRate === undefined || !email) {
    return res
      .status(400)
      .json({ error: 'name, title, hourlyRate, and email are required' });
  }
  if (currency !== undefined && !CURRENCIES.includes(currency)) {
    return res.status(400).json({ error: `currency must be one of: ${CURRENCIES.join(', ')}` });
  }

  const db = readDB();
  const designer = {
    id: uuidv4(),
    name,
    title,
    bio: bio || '',
    avatar: avatar || 'https://i.pravatar.cc/200?img=' + Math.floor(Math.random() * 70),
    skills: Array.isArray(skills) ? skills : [],
    hourlyRate: Number(hourlyRate),
    currency: currency || 'AZN',
    experience: Number(experience) || 0,
    location: location || '',
    email,
    phone: phone || '',
    behanceUrl: behanceUrl || '',
    dribbbleUrl: dribbbleUrl || '',
    instagramUrl: instagramUrl || '',
    isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
    isVerified: false,
    rating: 0,
    reviewsCount: 0,
    createdAt: new Date().toISOString(),
  };

  db.designers.push(designer);
  writeDB(db);
  res.status(201).json(designer);
}

function updateDesigner(req, res) {
  const db = readDB();
  const index = db.designers.findIndex((d) => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Designer not found' });

  if (req.body.currency !== undefined && !CURRENCIES.includes(req.body.currency)) {
    return res.status(400).json({ error: `currency must be one of: ${CURRENCIES.join(', ')}` });
  }

  const allowed = [
    'name', 'title', 'bio', 'avatar', 'skills', 'hourlyRate', 'currency',
    'experience', 'location', 'email', 'phone', 'behanceUrl', 'dribbbleUrl',
    'instagramUrl', 'isAvailable', 'isVerified',
  ];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  db.designers[index] = { ...db.designers[index], ...updates };
  writeDB(db);
  res.json(db.designers[index]);
}

function deleteDesigner(req, res) {
  const db = readDB();
  const index = db.designers.findIndex((d) => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Designer not found' });

  const id = req.params.id;
  db.designers.splice(index, 1);
  // cascade: remove everything belonging to the designer
  db.projects = db.projects.filter((p) => p.designerId !== id);
  db.services = db.services.filter((s) => s.designerId !== id);
  db.reviews = db.reviews.filter((r) => r.designerId !== id);
  db.orders = db.orders.filter((o) => o.designerId !== id);
  writeDB(db);
  res.json({ message: 'Designer deleted' });
}

function verifyDesigner(req, res) {
  const db = readDB();
  const idx = db.designers.findIndex((d) => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Designer not found' });
  db.designers[idx].isVerified = !db.designers[idx].isVerified;
  writeDB(db);
  res.json(db.designers[idx]);
}

module.exports = {
  getDesigners,
  getDesignerById,
  createDesigner,
  updateDesigner,
  deleteDesigner,
  verifyDesigner,
  CATEGORIES,
  CURRENCIES,
};
