const Post = require('../models/post.model');
const mongoose = require('mongoose');
const Queue = require('bull');

// Configurar a fila de publicação de posts
const postPublishQueue = new Queue('post-publishing', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  }
});

/**
 * Cria um novo post
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.createPost = async (req, res) => {
  try {
    const { title, content, platform, scheduledDate, tags, status, media } = req.body;
    
    // Validar campos obrigatórios
    if (!title || !content) {
      return res.status(400).json({
        status: 'error',
        message: 'Título e conteúdo são obrigatórios'
      });
    }

    // Criar o post
    const post = new Post({
      userId: req.user._id,
      title,
      content,
      platform: platform || 'linkedin',
      tags: tags || [],
      status: status || 'draft',
      media: media || []
    });

    // Se o post for agendado, definir a data de agendamento
    if (status === 'scheduled' && scheduledDate) {
      post.scheduledDate = new Date(scheduledDate);
    }

    // Se o post for publicado imediatamente, definir a data de publicação
    if (status === 'published') {
      post.publishedDate = new Date();
      
      // Adicionar à fila de publicação
      await postPublishQueue.add(
        'publish-post',
        {
          postId: post._id,
          userId: req.user._id,
          platform: post.platform
        },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000
          }
        }
      );
    }

    await post.save();

    res.status(201).json({
      status: 'success',
      data: post
    });
  } catch (error) {
    console.error('Erro ao criar post:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao criar post'
    });
  }
};

/**
 * Atualiza um post existente
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content, platform, scheduledDate, tags, status, media } = req.body;
    
    // Verificar se o post existe
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post não encontrado'
      });
    }

    // Verificar se o usuário é o dono do post
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Acesso negado'
      });
    }

    // Não permitir a edição de posts já publicados
    if (post.status === 'published') {
      return res.status(400).json({
        status: 'error',
        message: 'Não é possível editar posts já publicados'
      });
    }

    // Atualizar os campos
    if (title) post.title = title;
    if (content) post.content = content;
    if (platform) post.platform = platform;
    if (tags) post.tags = tags;
    if (media) post.media = media;

    // Atualizar o status e datas relacionadas
    if (status) {
      const oldStatus = post.status;
      post.status = status;

      // Se o post for agendado, definir a data de agendamento
      if (status === 'scheduled' && scheduledDate) {
        post.scheduledDate = new Date(scheduledDate);
      }

      // Se o post for publicado imediatamente, definir a data de publicação
      if (status === 'published') {
        post.publishedDate = new Date();
        
        // Adicionar à fila de publicação
        await postPublishQueue.add(
          'publish-post',
          {
            postId: post._id,
            userId: req.user._id,
            platform: post.platform
          },
          {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 1000
            }
          }
        );
      }
    } else if (scheduledDate && post.status === 'scheduled') {
      // Atualizar apenas a data de agendamento se o status já for 'scheduled'
      post.scheduledDate = new Date(scheduledDate);
    }

    await post.save();

    res.status(200).json({
      status: 'success',
      data: post
    });
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao atualizar post'
    });
  }
};

/**
 * Obtém um post específico
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.getPost = async (req, res) => {
  try {
    const { postId } = req.params;
    
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post não encontrado'
      });
    }

    // Verificar se o usuário é o dono do post
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Acesso negado'
      });
    }

    res.status(200).json({
      status: 'success',
      data: post
    });
  } catch (error) {
    console.error('Erro ao obter post:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao obter post'
    });
  }
};

/**
 * Lista todos os posts do usuário
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.listPosts = async (req, res) => {
  try {
    const { status, platform, page = 1, limit = 10 } = req.query;
    
    const query = { userId: req.user._id };
    
    if (status) {
      query.status = status;
    }
    
    if (platform) {
      query.platform = platform;
    }
    
    const options = {
      sort: { createdAt: -1 },
      skip: (page - 1) * limit,
      limit: parseInt(limit)
    };
    
    const posts = await Post.find(query, null, options);
    const total = await Post.countDocuments(query);
    
    res.status(200).json({
      status: 'success',
      data: posts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao listar posts:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao listar posts'
    });
  }
};

/**
 * Exclui um post
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post não encontrado'
      });
    }

    // Verificar se o usuário é o dono do post
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Acesso negado'
      });
    }

    // Não permitir a exclusão de posts já publicados
    if (post.status === 'published') {
      return res.status(400).json({
        status: 'error',
        message: 'Não é possível excluir posts já publicados'
      });
    }

    await post.remove();

    res.status(200).json({
      status: 'success',
      message: 'Post excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir post:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao excluir post'
    });
  }
};

/**
 * Busca posts por tags
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.searchByTags = async (req, res) => {
  try {
    const { tags } = req.query;
    
    if (!tags) {
      return res.status(400).json({
        status: 'error',
        message: 'É necessário fornecer pelo menos uma tag'
      });
    }
    
    const tagsArray = Array.isArray(tags) ? tags : tags.split(',');
    
    const posts = await Post.find({
      userId: req.user._id,
      tags: { $in: tagsArray }
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      data: posts
    });
  } catch (error) {
    console.error('Erro ao buscar posts por tags:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar posts por tags'
    });
  }
};

/**
 * Obtém métricas agregadas dos posts
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.getPostMetrics = async (req, res) => {
  try {
    const { platform, startDate, endDate } = req.query;
    
    const query = { userId: req.user._id, status: 'published' };
    
    if (platform) {
      query.platform = platform;
    }
    
    if (startDate && endDate) {
      query.publishedDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const metrics = await Post.aggregate([
      { $match: query },
      { $group: {
        _id: '$platform',
        totalPosts: { $sum: 1 },
        totalViews: { $sum: '$metrics.views' },
        totalLikes: { $sum: '$metrics.likes' },
        totalComments: { $sum: '$metrics.comments' },
        totalShares: { $sum: '$metrics.shares' },
        totalClicks: { $sum: '$metrics.clicks' }
      }},
      { $project: {
        platform: '$_id',
        totalPosts: 1,
        totalViews: 1,
        totalLikes: 1,
        totalComments: 1,
        totalShares: 1,
        totalClicks: 1,
        engagementRate: {
          $divide: [
            { $add: ['$totalLikes', '$totalComments', '$totalShares'] },
            { $cond: [{ $eq: ['$totalViews', 0] }, 1, '$totalViews'] }
          ]
        },
        _id: 0
      }}
    ]);
    
    res.status(200).json({
      status: 'success',
      data: metrics
    });
  } catch (error) {
    console.error('Erro ao obter métricas de posts:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao obter métricas de posts'
    });
  }
};

// Configurar o processador da fila de publicação
postPublishQueue.process('publish-post', async (job) => {
  const { postId, userId, platform } = job.data;
  
  try {
    const post = await Post.findById(postId);
    
    if (!post) {
      throw new Error(`Post não encontrado: ${postId}`);
    }
    
    // Aqui seria implementada a lógica de publicação nas redes sociais
    // Por exemplo, usando as APIs do LinkedIn, Twitter, etc.
    
    // Simulação de publicação bem-sucedida
    const socialMediaPostId = `social_media_${platform}_${Date.now()}`;
    
    // Atualizar o post com o ID da publicação na rede social
    if (platform === 'linkedin') {
      post.linkedinPostId = socialMediaPostId;
    } else if (platform === 'twitter') {
      post.twitterPostId = socialMediaPostId;
    } else if (platform === 'facebook') {
      post.facebookPostId = socialMediaPostId;
    } else if (platform === 'instagram') {
      post.instagramPostId = socialMediaPostId;
    }
    
    post.status = 'published';
    post.publishedDate = new Date();
    
    await post.save();
    
    return { success: true, postId, socialMediaPostId };
  } catch (error) {
    console.error(`Erro ao publicar post ${postId}:`, error);
    
    // Atualizar o post com o erro
    await Post.findByIdAndUpdate(postId, {
      status: 'failed',
      error: error.message
    });
    
    throw error;
  }
});

// Lidar com erros na fila
postPublishQueue.on('error', (error) => {
  console.error('Erro na fila de publicação:', error);
});

postPublishQueue.on('failed', (job, error) => {
  console.error(`Job ${job.id} falhou:`, error);
});
