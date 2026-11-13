const express = require('express');
const router = express.Router();
const { exploreProjects } = require('../controllers/projects');

router.get('/', exploreProjects);

module.exports = router;
