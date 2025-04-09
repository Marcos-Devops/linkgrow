const express = require('express');
const router = express.Router();

// Importa as rotas específicas
const authRoutes = require('./auth.routes');
const linkedinRoutes = require('./linkedin.routes');
const metricsRoutes = require('./metrics.routes');

// Define as rotas
router.use('/auth', authRoutes);
router.use('/linkedin', linkedinRoutes);
router.use('/metrics', metricsRoutes);

module.exports = router;
