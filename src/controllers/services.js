const { readDB, writeDB } = require('../middleware/db');
const { v4: uuidv4 } = require('uuid');
const { CURRENCIES } = require('./designers');

const TIERS = ['basic', 'standard', 'premium'];

function findDesigner(db, id) {
  return db.designers.find((d) => d.id === id);
}

function getDesignerServices(req, res) {
  const db = readDB();
  if (!findDesigner(db, req.params.id)) {
    return res.status(404).json({ error: 'Designer not found' });
  }
  const services = db.services.filter((s) => s.designerId === req.params.id);
  res.json(services);
}

function addService(req, res) {
  const { title, description, deliveryDays, price, currency, includes, tier } = req.body;

  if (!title || price === undefined || deliveryDays === undefined) {
    return res
      .status(400)
      .json({ error: 'title, price, and deliveryDays are required' });
  }
  if (tier !== undefined && !TIERS.includes(tier)) {
    return res.status(400).json({ error: `tier must be one of: ${TIERS.join(', ')}` });
  }
  if (currency !== undefined && !CURRENCIES.includes(currency)) {
    return res.status(400).json({ error: `currency must be one of: ${CURRENCIES.join(', ')}` });
  }

  const db = readDB();
  if (!findDesigner(db, req.params.id)) {
    return res.status(404).json({ error: 'Designer not found' });
  }

  const service = {
    id: uuidv4(),
    designerId: req.params.id,
    title,
    description: description || '',
    deliveryDays: Number(deliveryDays),
    price: Number(price),
    currency: currency || 'AZN',
    includes: Array.isArray(includes) ? includes : [],
    tier: tier || 'basic',
  };

  db.services.push(service);
  writeDB(db);
  res.status(201).json(service);
}

function updateService(req, res) {
  const db = readDB();
  if (!findDesigner(db, req.params.id)) {
    return res.status(404).json({ error: 'Designer not found' });
  }

  const index = db.services.findIndex(
    (s) => s.id === req.params.serviceId && s.designerId === req.params.id
  );
  if (index === -1) return res.status(404).json({ error: 'Service not found' });

  if (req.body.tier !== undefined && !TIERS.includes(req.body.tier)) {
    return res.status(400).json({ error: `tier must be one of: ${TIERS.join(', ')}` });
  }
  if (req.body.currency !== undefined && !CURRENCIES.includes(req.body.currency)) {
    return res.status(400).json({ error: `currency must be one of: ${CURRENCIES.join(', ')}` });
  }

  const allowed = ['title', 'description', 'deliveryDays', 'price', 'currency', 'includes', 'tier'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  db.services[index] = { ...db.services[index], ...updates };
  writeDB(db);
  res.json(db.services[index]);
}

function deleteService(req, res) {
  const db = readDB();
  if (!findDesigner(db, req.params.id)) {
    return res.status(404).json({ error: 'Designer not found' });
  }

  const index = db.services.findIndex(
    (s) => s.id === req.params.serviceId && s.designerId === req.params.id
  );
  if (index === -1) return res.status(404).json({ error: 'Service not found' });

  db.services.splice(index, 1);
  writeDB(db);
  res.json({ message: 'Service deleted' });
}

module.exports = { getDesignerServices, addService, updateService, deleteService };
