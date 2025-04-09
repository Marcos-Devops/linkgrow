const express = require('express');
const router = express.Router();

// Importa as rotas específicas
const authRoutes = require('./auth.routes');
const linkedinRoutes = require('./linkedin.routes');
const metricsRoutes = require('./metrics.routes');
const carouselRoutes = require('./carousel.routes');
const postRoutes = require('./post.routes');
const aiRoutes = require('./ai.routes');

// Define as rotas
router.use('/auth', authRoutes);
router.use('/linkedin', linkedinRoutes);
router.use('/metrics', metricsRoutes);
router.use('/carousels', carouselRoutes);
router.use('/posts', postRoutes);
router.use('/ai', aiRoutes);

module.exports = router;
