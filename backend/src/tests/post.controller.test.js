const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const Post = require('../models/post.model');
const postRoutes = require('../routes/post.routes');
const postController = require('../controllers/post.controller');

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

// Mock do passport para autenticação
jest.mock('passport', () => ({
  authenticate: jest.fn(() => (req, res, next) => {
    req.user = { _id: '60d21b4667d0d8992e610c85' };
    next();
  })
}));

describe('Post Controller', () => {
  let mongoServer;
  let app;
  let mockPost;

  beforeAll(async () => {
    // Configurar o servidor MongoDB em memória
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Configurar o aplicativo Express para testes
    app = express();
    app.use(bodyParser.json());
    app.use('/api/posts', postRoutes);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Limpar a coleção de posts antes de cada teste
    await Post.deleteMany({});

    // Criar um post de exemplo para testes
    mockPost = new Post({
      userId: mongoose.Types.ObjectId('60d21b4667d0d8992e610c85'),
      title: 'Test Post',
      content: '<p>This is a test post</p>',
      platform: 'linkedin',
      tags: ['test', 'jest'],
      status: 'draft'
    });

    await mockPost.save();
  });

  describe('createPost', () => {
    test('should create a new post', async () => {
      const newPost = {
        title: 'New Test Post',
        content: '<p>This is a new test post</p>',
        platform: 'twitter',
        tags: ['new', 'test'],
        status: 'draft'
      };

      const response = await request(app)
        .post('/api/posts')
        .send(newPost);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.title).toBe(newPost.title);
      expect(response.body.data.content).toBe(newPost.content);
      expect(response.body.data.platform).toBe(newPost.platform);
      expect(response.body.data.tags).toEqual(expect.arrayContaining(newPost.tags));
      expect(response.body.data.status).toBe(newPost.status);
    });

    test('should return error if required fields are missing', async () => {
      const invalidPost = {
        platform: 'linkedin',
        tags: ['test']
      };

      const response = await request(app)
        .post('/api/posts')
        .send(invalidPost);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    test('should set scheduledDate if status is scheduled', async () => {
      const scheduledPost = {
        title: 'Scheduled Post',
        content: '<p>This is a scheduled post</p>',
        platform: 'linkedin',
        status: 'scheduled',
        scheduledDate: new Date('2023-12-31T12:00:00.000Z')
      };

      const response = await request(app)
        .post('/api/posts')
        .send(scheduledPost);

      expect(response.status).toBe(201);
      expect(response.body.data.status).toBe('scheduled');
      expect(new Date(response.body.data.scheduledDate)).toEqual(
        new Date(scheduledPost.scheduledDate)
      );
    });
  });

  describe('updatePost', () => {
    test('should update an existing post', async () => {
      const updates = {
        title: 'Updated Test Post',
        content: '<p>This is an updated test post</p>'
      };

      const response = await request(app)
        .put(`/api/posts/${mockPost._id}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.title).toBe(updates.title);
      expect(response.body.data.content).toBe(updates.content);
    });

    test('should return 404 if post does not exist', async () => {
      const nonExistentId = mongoose.Types.ObjectId();
      const updates = {
        title: 'Updated Test Post'
      };

      const response = await request(app)
        .put(`/api/posts/${nonExistentId}`)
        .send(updates);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
    });

    test('should update status and set scheduledDate', async () => {
      const updates = {
        status: 'scheduled',
        scheduledDate: new Date('2023-12-31T12:00:00.000Z')
      };

      const response = await request(app)
        .put(`/api/posts/${mockPost._id}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('scheduled');
      expect(new Date(response.body.data.scheduledDate)).toEqual(
        new Date(updates.scheduledDate)
      );
    });
  });

  describe('getPost', () => {
    test('should get a post by id', async () => {
      const response = await request(app)
        .get(`/api/posts/${mockPost._id}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data._id.toString()).toBe(mockPost._id.toString());
      expect(response.body.data.title).toBe(mockPost.title);
    });

    test('should return 404 if post does not exist', async () => {
      const nonExistentId = mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/posts/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
    });
  });

  describe('listPosts', () => {
    test('should list all posts for a user', async () => {
      // Criar mais alguns posts para testar a listagem
      await Post.create([
        {
          userId: mongoose.Types.ObjectId('60d21b4667d0d8992e610c85'),
          title: 'Test Post 2',
          content: '<p>This is test post 2</p>',
          platform: 'twitter',
          status: 'draft'
        },
        {
          userId: mongoose.Types.ObjectId('60d21b4667d0d8992e610c85'),
          title: 'Test Post 3',
          content: '<p>This is test post 3</p>',
          platform: 'linkedin',
          status: 'scheduled',
          scheduledDate: new Date('2023-12-31')
        }
      ]);

      const response = await request(app)
        .get('/api/posts');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.length).toBe(3);
      expect(response.body.pagination.total).toBe(3);
    });

    test('should filter posts by status', async () => {
      // Criar mais alguns posts com status diferentes
      await Post.create([
        {
          userId: mongoose.Types.ObjectId('60d21b4667d0d8992e610c85'),
          title: 'Scheduled Post',
          content: '<p>This is a scheduled post</p>',
          platform: 'linkedin',
          status: 'scheduled',
          scheduledDate: new Date('2023-12-31')
        },
        {
          userId: mongoose.Types.ObjectId('60d21b4667d0d8992e610c85'),
          title: 'Published Post',
          content: '<p>This is a published post</p>',
          platform: 'linkedin',
          status: 'published',
          publishedDate: new Date()
        }
      ]);

      const response = await request(app)
        .get('/api/posts?status=scheduled');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].title).toBe('Scheduled Post');
    });

    test('should filter posts by platform', async () => {
      // Criar mais alguns posts com plataformas diferentes
      await Post.create([
        {
          userId: mongoose.Types.ObjectId('60d21b4667d0d8992e610c85'),
          title: 'Twitter Post',
          content: '<p>This is a Twitter post</p>',
          platform: 'twitter',
          status: 'draft'
        },
        {
          userId: mongoose.Types.ObjectId('60d21b4667d0d8992e610c85'),
          title: 'Facebook Post',
          content: '<p>This is a Facebook post</p>',
          platform: 'facebook',
          status: 'draft'
        }
      ]);

      const response = await request(app)
        .get('/api/posts?platform=twitter');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].title).toBe('Twitter Post');
    });
  });

  describe('deletePost', () => {
    test('should delete a post', async () => {
      const response = await request(app)
        .delete(`/api/posts/${mockPost._id}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      
      // Verificar se o post foi realmente excluído
      const deletedPost = await Post.findById(mockPost._id);
      expect(deletedPost).toBeNull();
    });

    test('should return 404 if post does not exist', async () => {
      const nonExistentId = mongoose.Types.ObjectId();
      
      const response = await request(app)
        .delete(`/api/posts/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
    });
  });

  describe('searchByTags', () => {
    test('should find posts by tags', async () => {
      // Criar mais alguns posts com tags diferentes
      await Post.create([
        {
          userId: mongoose.Types.ObjectId('60d21b4667d0d8992e610c85'),
          title: 'Marketing Post',
          content: '<p>This is a marketing post</p>',
          platform: 'linkedin',
          status: 'draft',
          tags: ['marketing', 'social media']
        },
        {
          userId: mongoose.Types.ObjectId('60d21b4667d0d8992e610c85'),
          title: 'Tech Post',
          content: '<p>This is a tech post</p>',
          platform: 'linkedin',
          status: 'draft',
          tags: ['tech', 'programming']
        }
      ]);

      const response = await request(app)
        .get('/api/posts/search/tags?tags=marketing,social media');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].title).toBe('Marketing Post');
    });

    test('should return error if no tags are provided', async () => {
      const response = await request(app)
        .get('/api/posts/search/tags');

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });

  describe('getPostMetrics', () => {
    test('should get aggregated metrics for posts', async () => {
      // Criar posts com métricas
      await Post.create([
        {
          userId: mongoose.Types.ObjectId('60d21b4667d0d8992e610c85'),
          title: 'LinkedIn Post 1',
          content: '<p>LinkedIn content</p>',
          platform: 'linkedin',
          status: 'published',
          publishedDate: new Date(),
          metrics: {
            views: 100,
            likes: 20,
            comments: 5,
            shares: 10,
            clicks: 15
          }
        },
        {
          userId: mongoose.Types.ObjectId('60d21b4667d0d8992e610c85'),
          title: 'LinkedIn Post 2',
          content: '<p>More LinkedIn content</p>',
          platform: 'linkedin',
          status: 'published',
          publishedDate: new Date(),
          metrics: {
            views: 200,
            likes: 30,
            comments: 10,
            shares: 15,
            clicks: 25
          }
        }
      ]);

      const response = await request(app)
        .get('/api/posts/metrics');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.length).toBe(1); // Apenas LinkedIn
      
      const linkedinMetrics = response.body.data[0];
      expect(linkedinMetrics.platform).toBe('linkedin');
      expect(linkedinMetrics.totalPosts).toBe(2);
      expect(linkedinMetrics.totalViews).toBe(300);
      expect(linkedinMetrics.totalLikes).toBe(50);
      expect(linkedinMetrics.totalComments).toBe(15);
      expect(linkedinMetrics.totalShares).toBe(25);
      expect(linkedinMetrics.totalClicks).toBe(40);
    });

    test('should filter metrics by platform', async () => {
      // Criar posts para diferentes plataformas
      await Post.create([
        {
          userId: mongoose.Types.ObjectId('60d21b4667d0d8992e610c85'),
          title: 'LinkedIn Post',
          content: '<p>LinkedIn content</p>',
          platform: 'linkedin',
          status: 'published',
          publishedDate: new Date(),
          metrics: {
            views: 100,
            likes: 20,
            comments: 5,
            shares: 10,
            clicks: 15
          }
        },
        {
          userId: mongoose.Types.ObjectId('60d21b4667d0d8992e610c85'),
          title: 'Twitter Post',
          content: '<p>Twitter content</p>',
          platform: 'twitter',
          status: 'published',
          publishedDate: new Date(),
          metrics: {
            views: 200,
            likes: 30,
            comments: 10,
            shares: 15,
            clicks: 25
          }
        }
      ]);

      const response = await request(app)
        .get('/api/posts/metrics?platform=twitter');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].platform).toBe('twitter');
      expect(response.body.data[0].totalViews).toBe(200);
    });
  });
});
