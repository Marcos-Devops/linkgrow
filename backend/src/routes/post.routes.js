const express = require('express');
const router = express.Router();
const passport = require('passport');
const { 
  createPost, 
  updatePost, 
  getPost, 
  listPosts, 
  deletePost, 
  searchByTags,
  getPostMetrics
} = require('../controllers/post.controller');

// Middleware de autenticação para todas as rotas
const auth = passport.authenticate('jwt', { session: false });

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Cria um novo post
 *     description: Cria um novo post com o conteúdo fornecido
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               platform:
 *                 type: string
 *                 enum: [linkedin, twitter, facebook, instagram]
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [draft, scheduled, published]
 *               media:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [image, video, pdf, audio]
 *                     url:
 *                       type: string
 *     responses:
 *       201:
 *         description: Post criado com sucesso
 */
router.post('/', auth, createPost);

/**
 * @swagger
 * /api/posts/{postId}:
 *   put:
 *     summary: Atualiza um post existente
 *     description: Atualiza um post existente com o conteúdo fornecido
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               platform:
 *                 type: string
 *                 enum: [linkedin, twitter, facebook, instagram]
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [draft, scheduled, published]
 *               media:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [image, video, pdf, audio]
 *                     url:
 *                       type: string
 *     responses:
 *       200:
 *         description: Post atualizado com sucesso
 */
router.put('/:postId', auth, updatePost);

/**
 * @swagger
 * /api/posts/{postId}:
 *   get:
 *     summary: Obtém um post específico
 *     description: Retorna os detalhes de um post específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do post
 */
router.get('/:postId', auth, getPost);

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Lista todos os posts do usuário
 *     description: Retorna uma lista de posts do usuário, com opções de filtragem
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, scheduled, published, failed]
 *       - in: query
 *         name: platform
 *         schema:
 *           type: string
 *           enum: [linkedin, twitter, facebook, instagram]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista de posts
 */
router.get('/', auth, listPosts);

/**
 * @swagger
 * /api/posts/{postId}:
 *   delete:
 *     summary: Exclui um post
 *     description: Exclui um post específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post excluído com sucesso
 */
router.delete('/:postId', auth, deletePost);

/**
 * @swagger
 * /api/posts/search/tags:
 *   get:
 *     summary: Busca posts por tags
 *     description: Retorna posts que contêm as tags especificadas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tags
 *         required: true
 *         schema:
 *           type: string
 *         description: Tags separadas por vírgula
 *     responses:
 *       200:
 *         description: Lista de posts com as tags especificadas
 */
router.get('/search/tags', auth, searchByTags);

/**
 * @swagger
 * /api/posts/metrics:
 *   get:
 *     summary: Obtém métricas agregadas dos posts
 *     description: Retorna métricas agregadas dos posts do usuário
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: platform
 *         schema:
 *           type: string
 *           enum: [linkedin, twitter, facebook, instagram]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Métricas agregadas dos posts
 */
router.get('/metrics', auth, getPostMetrics);

module.exports = router;
