const express = require('express');
const router = express.Router();
const passport = require('passport');
const { 
  getLinkedInProfile, 
  getConnections, 
  getFollowers, 
  getPosts, 
  getEngagement 
} = require('../controllers/linkedin.controller');

// Middleware de autenticação para todas as rotas
const auth = passport.authenticate('jwt', { session: false });

// Rota para obter perfil do LinkedIn
router.get('/profile', auth, getLinkedInProfile);

// Rota para obter conexões
router.get('/connections', auth, getConnections);

// Rota para obter seguidores
router.get('/followers', auth, getFollowers);

// Rota para obter posts
router.get('/posts', auth, getPosts);

// Rota para obter métricas de engajamento
router.get('/engagement', auth, getEngagement);

module.exports = router;
