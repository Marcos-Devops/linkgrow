const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const AiJob = require('../models/aiJob.model');
const aiRoutes = require('../routes/ai.routes');
const aiController = require('../controllers/ai.controller');

// Mock do Bull para evitar conexões reais com Redis
jest.mock('bull', () => {
  return jest.fn().mockImplementation(() => {
    return {
      add: jest.fn().mockResolvedValue({}),
      process: jest.fn(),
      on: jest.fn()
    };
  });
});

// Mock do OpenAI para evitar chamadas reais à API
jest.mock('openai', () => {
  return {
    OpenAI: jest.fn().mockImplementation(() => {
      return {
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue({
              choices: [
                {
                  message: {
                    content: 'Sugestão 1:\nEste é um conteúdo sugerido pela IA.\n\nSugestão 2:\nOutra sugestão de conteúdo.\n\nSugestão 3:\nMais uma sugestão de conteúdo.'
                  }
                }
              ]
            })
          }
        }
      };
    })
  };
});

// Mock do passport para autenticação
jest.mock('passport', () => ({
  authenticate: jest.fn(() => (req, res, next) => {
    req.user = { _id: '60d21b4667d0d8992e610c85' };
    next();
  })
}));

// Mock do multer para testes de upload de arquivos
jest.mock('multer', () => {
  const multerMock = () => ({
    array: () => (req, res, next) => {
      req.files = [
        {
          originalname: 'test.pdf',
          filename: 'test-123456.pdf',
          path: '/uploads/test-123456.pdf',
          mimetype: 'application/pdf'
        }
      ];
      next();
    }
  });
  multerMock.diskStorage = () => ({});
  return multerMock;
});

// Mock do fs para evitar operações reais no sistema de arquivos
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn().mockReturnValue(true),
  mkdirSync: jest.fn(),
  readFileSync: jest.fn().mockReturnValue(Buffer.from('test content'))
}));

// Mock do pdf-parse para evitar processamento real de PDFs
jest.mock('pdf-parse', () => jest.fn().mockResolvedValue({
  text: 'Conteúdo extraído do PDF',
  numpages: 5,
  info: {
    Author: 'Test Author',
    Title: 'Test PDF'
  }
}));

// Mock do fluent-ffmpeg para evitar processamento real de vídeos
jest.mock('fluent-ffmpeg', () => ({
  setFfmpegPath: jest.fn(),
  ffprobe: jest.fn((path, callback) => {
    callback(null, {
      streams: [
        { codec_type: 'video', width: 1920, height: 1080 },
        { codec_type: 'audio' }
      ],
      format: {
        duration: 120,
        size: 1024000,
        bit_rate: 1000000
      }
    });
  })
}));

describe('AI Controller', () => {
  let mongoServer;
  let app;
  let mockAiJob;

  beforeAll(async () => {
    // Configurar o servidor MongoDB em memória
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Configurar o aplicativo Express para testes
    app = express();
    app.use(bodyParser.json());
    app.use('/api/ai', aiRoutes);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Limpar a coleção de jobs antes de cada teste
    await AiJob.deleteMany({});

    // Criar um job de exemplo para testes
    mockAiJob = new AiJob({
      userId: mongoose.Types.ObjectId('60d21b4667d0d8992e610c85'),
      files: ['/uploads/test-123456.pdf'],
      context: {
        title: 'Test Job',
        platform: 'linkedin',
        tags: ['test', 'ai']
      },
      status: 'pending',
      progress: 0
    });

    await mockAiJob.save();
  });

  describe('uploadFiles', () => {
    test('should upload files successfully', async () => {
      const response = await request(app)
        .post('/api/ai/upload')
        .attach('files', Buffer.from('test pdf content'), 'test.pdf');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.urls).toBeDefined();
      expect(response.body.urls.length).toBe(1);
    });

    test('should return error if no files are uploaded', async () => {
      // Sobrescrever o mock do multer para este teste específico
      jest.mock('multer', () => {
        const multerMock = () => ({
          array: () => (req, res, next) => {
            req.files = [];
            next();
          }
        });
        multerMock.diskStorage = () => ({});
        return multerMock;
      });

      const response = await request(app)
        .post('/api/ai/upload');

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });

  describe('processContent', () => {
    test('should start content processing', async () => {
      const requestData = {
        files: ['/uploads/test-123456.pdf'],
        context: {
          title: 'Test Content',
          platform: 'linkedin',
          tags: ['ai', 'test'],
          existingContent: '<p>Existing content</p>'
        }
      };

      const response = await request(app)
        .post('/api/ai/process')
        .send(requestData);

      expect(response.status).toBe(202);
      expect(response.body.status).toBe('success');
      expect(response.body.jobId).toBeDefined();

      // Verificar se o job foi criado no banco de dados
      const job = await AiJob.findById(response.body.jobId);
      expect(job).toBeDefined();
      expect(job.status).toBe('pending');
      expect(job.files).toEqual(requestData.files);
      expect(job.context.title).toBe(requestData.context.title);
    });

    test('should return error if no files are provided', async () => {
      const requestData = {
        files: [],
        context: {
          title: 'Test Content'
        }
      };

      const response = await request(app)
        .post('/api/ai/process')
        .send(requestData);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });

  describe('getSuggestions', () => {
    test('should generate content suggestions', async () => {
      const requestData = {
        content: '<p>Este é um texto de exemplo para melhorar.</p>',
        type: 'content_improvement'
      };

      const response = await request(app)
        .post('/api/ai/suggestions')
        .send(requestData);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.suggestion).toBeDefined();
    });

    test('should return error if no content is provided', async () => {
      const requestData = {
        type: 'content_improvement'
      };

      const response = await request(app)
        .post('/api/ai/suggestions')
        .send(requestData);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    test('should handle different suggestion types', async () => {
      const types = ['content_improvement', 'grammar_check', 'seo_optimization'];
      
      for (const type of types) {
        const requestData = {
          content: '<p>Este é um texto de exemplo para processar.</p>',
          type
        };

        const response = await request(app)
          .post('/api/ai/suggestions')
          .send(requestData);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.suggestion).toBeDefined();
      }
    });
  });

  describe('getProcessingStatus', () => {
    test('should get the status of a processing job', async () => {
      const response = await request(app)
        .get(`/api/ai/status/${mockAiJob._id}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.status).toBe('pending');
      expect(response.body.data.progress).toBe(0);
    });

    test('should return 404 if job does not exist', async () => {
      const nonExistentId = mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/ai/status/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
    });

    test('should return completed job status with suggestions', async () => {
      // Atualizar o job para status completed com sugestões
      await AiJob.findByIdAndUpdate(mockAiJob._id, {
        status: 'completed',
        progress: 100,
        suggestions: [
          'Sugestão 1: Conteúdo sugerido para LinkedIn.',
          'Sugestão 2: Outro conteúdo sugerido.'
        ]
      });

      const response = await request(app)
        .get(`/api/ai/status/${mockAiJob._id}`);

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('completed');
      expect(response.body.data.progress).toBe(100);
      expect(response.body.data.suggestions.length).toBe(2);
    });
  });

  // Testes adicionais para funções auxiliares internas
  describe('Internal Helper Functions', () => {
    // Estes testes são mais complexos e geralmente exigiriam
    // expor as funções internas ou usar mocks mais avançados.
    // Aqui estamos apenas demonstrando a abordagem.

    test('should handle PDF extraction', async () => {
      // Este teste é mais para demonstração, pois as funções internas
      // não são facilmente acessíveis nos testes sem modificar o código
      
      // Simular a extração de texto de um PDF
      const extractTextFromPdf = aiController.__get__('extractTextFromPdf');
      const result = await extractTextFromPdf('/path/to/test.pdf');
      
      expect(result.type).toBe('pdf');
      expect(result.text).toBe('Conteúdo extraído do PDF');
      expect(result.info.pageCount).toBe(5);
    });

    test('should handle video info extraction', async () => {
      // Simular a extração de informações de um vídeo
      const extractInfoFromVideo = aiController.__get__('extractInfoFromVideo');
      const result = await extractInfoFromVideo('/path/to/test.mp4');
      
      expect(result.type).toBe('video');
      expect(result.info.duration).toBe(120);
      expect(result.info.resolution).toBe('1920x1080');
      expect(result.info.hasAudio).toBe(true);
    });

    test('should generate suggestions based on content', async () => {
      // Simular a geração de sugestões
      const generateSuggestions = aiController.__get__('generateSuggestions');
      const contents = [
        {
          type: 'pdf',
          text: 'Conteúdo extraído do PDF para teste'
        }
      ];
      const context = {
        title: 'Teste de Sugestões',
        platform: 'linkedin',
        tags: ['teste', 'ai']
      };
      
      const suggestions = await generateSuggestions(contents, context);
      
      expect(Array.isArray(suggestions)).toBe(true);
      expect(suggestions.length).toBeGreaterThan(0);
    });
  });
});
