const express = require('express');
const router = express.Router();
const passport = require('passport');
const { 
  getDashboardMetrics,
  getFollowerGrowth,
  getConnectionGrowth,
  getEngagementRate,
  getPostPerformance
} = require('../controllers/metrics.controller');

// Middleware de autenticação para todas as rotas
const auth = passport.authenticate('jwt', { session: false });

// Rota para obter todas as métricas do dashboard
router.get('/dashboard', auth, getDashboardMetrics);

// Rota para obter crescimento de seguidores
router.get('/followers/growth', auth, getFollowerGrowth);

// Rota para obter crescimento de conexões
router.get('/connections/growth', auth, getConnectionGrowth);

// Rota para obter taxa de engajamento
router.get('/engagement/rate', auth, getEngagementRate);

// Rota para obter desempenho de posts
router.get('/posts/performance', auth, getPostPerformance);

module.exports = router;
