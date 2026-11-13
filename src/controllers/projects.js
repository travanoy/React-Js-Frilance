const { readDB, writeDB } = require('../middleware/db');
const { v4: uuidv4 } = require('uuid');
const { CATEGORIES } = require('./designers');

// --- Nested under /api/designers/:id/projects ---

function findDesigner(db, id) {
  return db.designers.find((d) => d.id === id);
}

function getDesignerProjects(req, res) {
  const db = readDB();
  if (!findDesigner(db, req.params.id)) {
    return res.status(404).json({ error: 'Designer not found' });
  }
  const projects = db.projects.filter((p) => p.designerId === req.params.id);
  res.json(projects);
}

function addProject(req, res) {
  const { title, description, category, images, tags, tools } = req.body;

  if (!title || !category) {
    return res.status(400).json({ error: 'title and category are required' });
  }
  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ error: `category must be one of: ${CATEGORIES.join(', ')}` });
  }

  const db = readDB();
  if (!findDesigner(db, req.params.id)) {
    return res.status(404).json({ error: 'Designer not found' });
  }

  const project = {
    id: uuidv4(),
    designerId: req.params.id,
    title,
    description: description || '',
    category,
    images: Array.isArray(images) && images.length > 0
      ? images
      : [`https://picsum.photos/seed/${Date.now()}/800/600`],
    tags: Array.isArray(tags) ? tags : [],
    tools: Array.isArray(tools) ? tools : [],
    likes: 0,
    views: 0,
    createdAt: new Date().toISOString(),
  };

  db.projects.push(project);
  writeDB(db);
  res.status(201).json(project);
}

function updateProject(req, res) {
  const db = readDB();
  if (!findDesigner(db, req.params.id)) {
    return res.status(404).json({ error: 'Designer not found' });
  }

  const index = db.projects.findIndex(
    (p) => p.id === req.params.projectId && p.designerId === req.params.id
  );
  if (index === -1) return res.status(404).json({ error: 'Project not found' });

  if (req.body.category !== undefined && !CATEGORIES.includes(req.body.category)) {
    return res.status(400).json({ error: `category must be one of: ${CATEGORIES.join(', ')}` });
  }

  const allowed = ['title', 'description', 'category', 'images', 'tags', 'tools'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  db.projects[index] = { ...db.projects[index], ...updates };
  writeDB(db);
  res.json(db.projects[index]);
}

function deleteProject(req, res) {
  const db = readDB();
  if (!findDesigner(db, req.params.id)) {
    return res.status(404).json({ error: 'Designer not found' });
  }

  const index = db.projects.findIndex(
    (p) => p.id === req.params.projectId && p.designerId === req.params.id
  );
  if (index === -1) return res.status(404).json({ error: 'Project not found' });

  db.projects.splice(index, 1);
  writeDB(db);
  res.json({ message: 'Project deleted' });
}

function likeProject(req, res) {
  const db = readDB();
  const project = db.projects.find(
    (p) => p.id === req.params.projectId && p.designerId === req.params.id
  );
  if (!project) return res.status(404).json({ error: 'Project not found' });

  project.likes++;
  writeDB(db);
  res.json(project);
}

// --- Global explore feed: /api/projects ---

function exploreProjects(req, res) {
  const { category, tags, sort } = req.query;

  if (sort && !['newest', 'popular'].includes(sort)) {
    return res.status(400).json({ error: 'sort must be one of: newest, popular' });
  }

  const db = readDB();
  let projects = db.projects;

  if (category) {
    projects = projects.filter((p) => p.category === category.toLowerCase());
  }
  if (tags) {
    // comma-separated list; project must contain ALL requested tags
    const wanted = tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
    projects = projects.filter((p) => {
      const projectTags = p.tags.map((t) => t.toLowerCase());
      return wanted.every((t) => projectTags.includes(t));
    });
  }

  projects = [...projects];
  if (sort === 'popular') {
    projects.sort((a, b) => b.likes - a.likes);
  } else {
    projects.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  // Attach minimal designer info for feed cards.
  const result = projects.map((p) => {
    const d = db.designers.find((x) => x.id === p.designerId);
    return {
      ...p,
      designer: d
        ? { id: d.id, name: d.name, title: d.title, avatar: d.avatar, isVerified: d.isVerified }
        : null,
    };
  });

  res.json(result);
}

module.exports = {
  getDesignerProjects,
  addProject,
  updateProject,
  deleteProject,
  likeProject,
  exploreProjects,
};
