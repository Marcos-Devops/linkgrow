const express = require('express');
const router = express.Router();
const carouselController = require('../controllers/carousel.controller');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Carousels
 *   description: API para gerenciamento de carrosséis
 */

/**
 * @swagger
 * /api/carousels:
 *   post:
 *     summary: Criar um novo carrossel
 *     tags: [Carousels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slides
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               slides:
 *                 type: array
 *                 items:
 *                   type: object
 *               settings:
 *                 type: object
 *               platform:
 *                 type: string
 *     responses:
 *       201:
 *         description: Carrossel criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro no servidor
 */
router.post('/', authenticate, carouselController.createCarousel);

/**
 * @swagger
 * /api/carousels:
 *   get:
 *     summary: Obter todos os carrosséis do usuário
 *     tags: [Carousels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de carrosséis
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro no servidor
 */
router.get('/', authenticate, carouselController.getCarousels);

/**
 * @swagger
 * /api/carousels/{id}:
 *   get:
 *     summary: Obter um carrossel específico
 *     tags: [Carousels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do carrossel
 *     responses:
 *       200:
 *         description: Carrossel encontrado
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Carrossel não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.get('/:id', authenticate, carouselController.getCarouselById);

/**
 * @swagger
 * /api/carousels/{id}:
 *   put:
 *     summary: Atualizar um carrossel
 *     tags: [Carousels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do carrossel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               slides:
 *                 type: array
 *                 items:
 *                   type: object
 *               settings:
 *                 type: object
 *               platform:
 *                 type: string
 *     responses:
 *       200:
 *         description: Carrossel atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Carrossel não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.put('/:id', authenticate, carouselController.updateCarousel);

/**
 * @swagger
 * /api/carousels/{id}:
 *   delete:
 *     summary: Excluir um carrossel
 *     tags: [Carousels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do carrossel
 *     responses:
 *       200:
 *         description: Carrossel excluído com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Carrossel não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.delete('/:id', authenticate, carouselController.deleteCarousel);

/**
 * @swagger
 * /api/carousels/{id}/duplicate:
 *   post:
 *     summary: Duplicar um carrossel existente
 *     tags: [Carousels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do carrossel
 *     responses:
 *       201:
 *         description: Carrossel duplicado com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Carrossel não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.post('/:id/duplicate', authenticate, carouselController.duplicateCarousel);

module.exports = router;
