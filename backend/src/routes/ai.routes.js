const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const { 
  uploadFiles, 
  processContent, 
  getSuggestions, 
  getProcessingStatus 
} = require('../controllers/ai.controller');

// Middleware de autenticação para todas as rotas
const auth = passport.authenticate('jwt', { session: false });

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // limite de 50MB
  },
  fileFilter: (req, file, cb) => {
    // Aceita PDFs, imagens, vídeos e áudios
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/') ||
      file.mimetype.startsWith('audio/') ||
      file.mimetype === 'application/pdf'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Formato de arquivo não suportado'), false);
    }
  }
});

/**
 * @swagger
 * /api/ai/upload:
 *   post:
 *     summary: Faz upload de arquivos para processamento de IA
 *     description: Permite o upload de PDFs, imagens, vídeos e áudios para processamento
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Upload bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 urls:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.post('/upload', auth, upload.array('files', 10), uploadFiles);

/**
 * @swagger
 * /api/ai/process:
 *   post:
 *     summary: Processa arquivos com IA para gerar sugestões de conteúdo
 *     description: Inicia o processamento assíncrono de arquivos para gerar sugestões de conteúdo
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *               context:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   platform:
 *                     type: string
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                   existingContent:
 *                     type: string
 *     responses:
 *       202:
 *         description: Processamento iniciado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 jobId:
 *                   type: string
 */
router.post('/process', auth, processContent);

/**
 * @swagger
 * /api/ai/suggestions:
 *   post:
 *     summary: Solicita sugestões de IA para melhorar conteúdo existente
 *     description: Gera sugestões para melhorar conteúdo existente sem necessidade de arquivos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [content_improvement, grammar_check, seo_optimization]
 *     responses:
 *       200:
 *         description: Sugestões geradas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 suggestion:
 *                   type: string
 */
router.post('/suggestions', auth, getSuggestions);

/**
 * @swagger
 * /api/ai/status/{jobId}:
 *   get:
 *     summary: Verifica o status de um processamento de IA
 *     description: Retorna o status atual e resultados de um job de processamento de IA
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status do processamento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [pending, processing, completed, failed]
 *                 progress:
 *                   type: number
 *                 suggestions:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.get('/status/:jobId', auth, getProcessingStatus);

module.exports = router;
