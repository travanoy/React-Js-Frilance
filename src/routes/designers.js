const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/auth');

const {
  getDesigners,
  getDesignerById,
  createDesigner,
  updateDesigner,
  deleteDesigner,
  verifyDesigner,
} = require('../controllers/designers');
const {
  getDesignerProjects,
  addProject,
  updateProject,
  deleteProject,
  likeProject,
} = require('../controllers/projects');
const {
  getDesignerServices,
  addService,
  updateService,
  deleteService,
} = require('../controllers/services');
const { getDesignerReviews, addReview } = require('../controllers/reviews');

router.get('/', getDesigners);
router.post('/', createDesigner);
router.get('/:id', getDesignerById);
router.put('/:id', updateDesigner);
router.delete('/:id', adminAuth, deleteDesigner);
router.patch('/:id/verify', adminAuth, verifyDesigner);

router.get('/:id/projects', getDesignerProjects);
router.post('/:id/projects', addProject);
router.put('/:id/projects/:projectId', updateProject);
router.delete('/:id/projects/:projectId', deleteProject);
router.patch('/:id/projects/:projectId/like', likeProject);

router.get('/:id/services', getDesignerServices);
router.post('/:id/services', addService);
router.put('/:id/services/:serviceId', updateService);
router.delete('/:id/services/:serviceId', deleteService);

router.get('/:id/reviews', getDesignerReviews);
router.post('/:id/reviews', addReview);

module.exports = router;
