const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedule.controller');
const { authenticate } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Schedules
 *   description: API para gerenciamento de agendamento de posts
 */

/**
 * @swagger
 * /api/schedules:
 *   post:
 *     summary: Criar um novo agendamento
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - scheduledDate
 *               - platforms
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título do post
 *               content:
 *                 type: string
 *                 description: Conteúdo do post
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *                 description: Data e hora agendada para publicação
 *               platforms:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [linkedin, twitter, facebook, instagram]
 *                 description: Plataformas onde o post será publicado
 *               media:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [image, video, document]
 *                     url:
 *                       type: string
 *                     alt:
 *                       type: string
 *                 description: Mídias associadas ao post
 *               postId:
 *                 type: string
 *                 description: ID do post associado (opcional)
 *               carouselId:
 *                 type: string
 *                 description: ID do carrossel associado (opcional)
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags associadas ao post
 *               recurrence:
 *                 type: object
 *                 properties:
 *                   isRecurring:
 *                     type: boolean
 *                     default: false
 *                   frequency:
 *                     type: string
 *                     enum: [daily, weekly, monthly, custom]
 *                   interval:
 *                     type: number
 *                   endDate:
 *                     type: string
 *                     format: date-time
 *                   daysOfWeek:
 *                     type: array
 *                     items:
 *                       type: number
 *                   daysOfMonth:
 *                     type: array
 *                     items:
 *                       type: number
 *                 description: Configuração de recorrência (opcional)
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro no servidor
 */
router.post('/', authenticate, scheduleController.createSchedule);

/**
 * @swagger
 * /api/schedules:
 *   get:
 *     summary: Obter todos os agendamentos do usuário
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data inicial para filtrar
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data final para filtrar
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, published, failed, draft]
 *         description: Status para filtrar
 *       - in: query
 *         name: platform
 *         schema:
 *           type: string
 *           enum: [linkedin, twitter, facebook, instagram]
 *         description: Plataforma para filtrar
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Página para paginação
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Limite de itens por página
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: -scheduledDate
 *         description: Campo para ordenação
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro no servidor
 */
router.get('/', authenticate, scheduleController.getSchedules);

/**
 * @swagger
 * /api/schedules/{id}:
 *   get:
 *     summary: Obter um agendamento específico
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Detalhes do agendamento
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Agendamento não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.get('/:id', authenticate, scheduleController.getScheduleById);

/**
 * @swagger
 * /api/schedules/{id}:
 *   put:
 *     summary: Atualizar um agendamento
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agendamento
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
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *               platforms:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [linkedin, twitter, facebook, instagram]
 *               media:
 *                 type: array
 *                 items:
 *                   type: object
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               recurrence:
 *                 type: object
 *               status:
 *                 type: string
 *                 enum: [scheduled, draft]
 *     responses:
 *       200:
 *         description: Agendamento atualizado com sucesso
 *       400:
 *         description: Dados inválidos ou agendamento já publicado
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Agendamento não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.put('/:id', authenticate, scheduleController.updateSchedule);

/**
 * @swagger
 * /api/schedules/{id}:
 *   delete:
 *     summary: Excluir um agendamento
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Agendamento excluído com sucesso
 *       400:
 *         description: Agendamento já publicado
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Agendamento não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.delete('/:id', authenticate, scheduleController.deleteSchedule);

/**
 * @swagger
 * /api/schedules/{id}/publish-now:
 *   post:
 *     summary: Publicar um agendamento imediatamente
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Agendamento enviado para publicação
 *       400:
 *         description: Agendamento já publicado
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Agendamento não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.post('/:id/publish-now', authenticate, scheduleController.publishNow);

/**
 * @swagger
 * /api/schedules/{id}/reschedule:
 *   put:
 *     summary: Reagendar um post
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agendamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scheduledDate
 *             properties:
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *                 description: Nova data e hora para publicação
 *     responses:
 *       200:
 *         description: Post reagendado com sucesso
 *       400:
 *         description: Dados inválidos ou post já publicado
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Agendamento não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.put('/:id/reschedule', authenticate, scheduleController.reschedulePost);

/**
 * @swagger
 * /api/schedules/stats:
 *   get:
 *     summary: Obter estatísticas de agendamento
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data inicial para filtrar
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data final para filtrar
 *     responses:
 *       200:
 *         description: Estatísticas de agendamento
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro no servidor
 */
router.get('/stats', authenticate, scheduleController.getScheduleStats);

module.exports = router;
