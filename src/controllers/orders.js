const { readDB, writeDB } = require('../middleware/db');
const { v4: uuidv4 } = require('uuid');

const STATUSES = ['pending', 'in-progress', 'completed', 'cancelled'];

function getOrders(req, res) {
  const db = readDB();
  res.json(db.orders);
}

function createOrder(req, res) {
  const { serviceId, clientName, clientEmail, requirements } = req.body;

  if (!serviceId || !clientName || !clientEmail) {
    return res
      .status(400)
      .json({ error: 'serviceId, clientName, and clientEmail are required' });
  }

  const db = readDB();
  const service = db.services.find((s) => s.id === serviceId);
  if (!service) return res.status(404).json({ error: 'Service not found' });

  const order = {
    id: uuidv4(),
    serviceId,
    designerId: service.designerId,
    clientName,
    clientEmail,
    requirements: requirements || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  db.orders.push(order);
  writeDB(db);
  res.status(201).json(order);
}

function getOrderById(req, res) {
  const db = readDB();
  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
}

function deleteOrder(req, res) {
  const db = readDB();
  const index = db.orders.findIndex((o) => o.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Order not found' });
  db.orders.splice(index, 1);
  writeDB(db);
  res.json({ message: 'Order deleted' });
}

function updateOrderStatus(req, res) {
  const { status } = req.body;
  if (!status || !STATUSES.includes(status)) {
    return res
      .status(400)
      .json({ error: `status must be one of: ${STATUSES.join(', ')}` });
  }

  const db = readDB();
  const index = db.orders.findIndex((o) => o.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Order not found' });

  db.orders[index].status = status;
  writeDB(db);
  res.json(db.orders[index]);
}

module.exports = { getOrders, getOrderById, createOrder, updateOrderStatus, deleteOrder };
