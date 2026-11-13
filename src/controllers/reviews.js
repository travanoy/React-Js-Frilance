const { readDB, writeDB } = require('../middleware/db');
const { v4: uuidv4 } = require('uuid');
const { CATEGORIES } = require('./designers');

function getDesignerReviews(req, res) {
  const db = readDB();
  if (!db.designers.some((d) => d.id === req.params.id)) {
    return res.status(404).json({ error: 'Designer not found' });
  }
  const reviews = db.reviews.filter((r) => r.designerId === req.params.id);
  res.json(reviews);
}

function addReview(req, res) {
  const { clientName, rating, comment, projectCategory } = req.body;

  if (!clientName || rating === undefined) {
    return res.status(400).json({ error: 'clientName and rating are required' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'rating must be between 1 and 5' });
  }
  if (projectCategory !== undefined && !CATEGORIES.includes(projectCategory)) {
    return res
      .status(400)
      .json({ error: `projectCategory must be one of: ${CATEGORIES.join(', ')}` });
  }

  const db = readDB();
  const designerIndex = db.designers.findIndex((d) => d.id === req.params.id);
  if (designerIndex === -1) {
    return res.status(404).json({ error: 'Designer not found' });
  }

  const review = {
    id: uuidv4(),
    designerId: req.params.id,
    clientName,
    rating: Number(rating),
    comment: comment || '',
    projectCategory: projectCategory || 'other',
    createdAt: new Date().toISOString(),
  };

  db.reviews.push(review);

  const designerReviews = db.reviews.filter((r) => r.designerId === req.params.id);
  const avg =
    designerReviews.reduce((sum, r) => sum + r.rating, 0) / designerReviews.length;
  db.designers[designerIndex].rating = Math.round(avg * 10) / 10;
  db.designers[designerIndex].reviewsCount = designerReviews.length;

  writeDB(db);
  res.status(201).json(review);
}

module.exports = { getDesignerReviews, addReview };
