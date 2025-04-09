const axios = require('axios');
const User = require('../models/user.model');
const LinkedInMetrics = require('../models/linkedinMetrics.model');

/**
 * Obtém o perfil do LinkedIn do usuário
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.getLinkedInProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || !user.linkedinToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Usuário não conectado ao LinkedIn'
      });
    }

    // Chamada para a API do LinkedIn
    const response = await axios.get('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${user.linkedinToken}`,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        profile: response.data
      }
    });
  } catch (error) {
    console.error('Erro ao obter perfil do LinkedIn:', error.response?.data || error.message);
    
    // Verifica se o erro é de token expirado
    if (error.response?.status === 401) {
      return res.status(401).json({
        status: 'error',
        message: 'Token do LinkedIn expirado. Por favor, reconecte sua conta.'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Erro ao obter perfil do LinkedIn'
    });
  }
};

/**
 * Obtém as conexões do LinkedIn do usuário
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.getConnections = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || !user.linkedinToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Usuário não conectado ao LinkedIn'
      });
    }

    // Na API real do LinkedIn, usaríamos o endpoint de conexões
    // Como exemplo, vamos simular dados de conexões
    const mockConnectionsData = {
      total: 487,
      connections: [
        { id: 'abc123', firstName: 'João', lastName: 'Silva', position: 'CEO at Company X' },
        { id: 'def456', firstName: 'Maria', lastName: 'Santos', position: 'CTO at Tech Corp' },
        // Mais conexões seriam retornadas pela API real
      ],
      growthRate: 2.3, // Taxa de crescimento em porcentagem
      recentConnections: 12 // Novas conexões nos últimos 30 dias
    };

    // Salva os dados de métricas no banco de dados
    await LinkedInMetrics.findOneAndUpdate(
      { userId: user._id },
      { 
        $set: { 
          'connections.total': mockConnectionsData.total,
          'connections.growthRate': mockConnectionsData.growthRate,
          'connections.recentConnections': mockConnectionsData.recentConnections,
          updatedAt: new Date()
        }
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      status: 'success',
      data: mockConnectionsData
    });
  } catch (error) {
    console.error('Erro ao obter conexões do LinkedIn:', error.response?.data || error.message);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao obter conexões do LinkedIn'
    });
  }
};

/**
 * Obtém os seguidores do LinkedIn do usuário
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || !user.linkedinToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Usuário não conectado ao LinkedIn'
      });
    }

    // Na API real do LinkedIn, usaríamos o endpoint de seguidores
    // Como exemplo, vamos simular dados de seguidores
    const mockFollowersData = {
      total: 1250,
      demographics: {
        industries: [
          { name: 'Tecnologia', percentage: 45 },
          { name: 'Marketing', percentage: 22 },
          { name: 'Finanças', percentage: 15 },
          { name: 'Outros', percentage: 18 }
        ],
        locations: [
          { name: 'Brasil', percentage: 75 },
          { name: 'Estados Unidos', percentage: 12 },
          { name: 'Portugal', percentage: 8 },
          { name: 'Outros', percentage: 5 }
        ]
      },
      growthRate: 3.7, // Taxa de crescimento em porcentagem
      recentFollowers: 28 // Novos seguidores nos últimos 30 dias
    };

    // Salva os dados de métricas no banco de dados
    await LinkedInMetrics.findOneAndUpdate(
      { userId: user._id },
      { 
        $set: { 
          'followers.total': mockFollowersData.total,
          'followers.growthRate': mockFollowersData.growthRate,
          'followers.recentFollowers': mockFollowersData.recentFollowers,
          'followers.demographics': mockFollowersData.demographics,
          updatedAt: new Date()
        }
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      status: 'success',
      data: mockFollowersData
    });
  } catch (error) {
    console.error('Erro ao obter seguidores do LinkedIn:', error.response?.data || error.message);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao obter seguidores do LinkedIn'
    });
  }
};

/**
 * Obtém os posts do LinkedIn do usuário
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.getPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || !user.linkedinToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Usuário não conectado ao LinkedIn'
      });
    }

    // Na API real do LinkedIn, usaríamos o endpoint de posts
    // Como exemplo, vamos simular dados de posts
    const mockPostsData = {
      total: 42,
      posts: [
        { 
          id: 'post1', 
          content: 'Conteúdo do post 1', 
          publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 
          likes: 120, 
          comments: 15, 
          shares: 8 
        },
        { 
          id: 'post2', 
          content: 'Conteúdo do post 2', 
          publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), 
          likes: 85, 
          comments: 7, 
          shares: 3 
        },
        // Mais posts seriam retornados pela API real
      ],
      engagement: {
        totalLikes: 3250,
        totalComments: 420,
        totalShares: 180,
        averageLikesPerPost: 77.4,
        averageCommentsPerPost: 10,
        averageSharesPerPost: 4.3
      }
    };

    // Salva os dados de métricas no banco de dados
    await LinkedInMetrics.findOneAndUpdate(
      { userId: user._id },
      { 
        $set: { 
          'posts.total': mockPostsData.total,
          'posts.engagement': mockPostsData.engagement,
          updatedAt: new Date()
        }
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      status: 'success',
      data: mockPostsData
    });
  } catch (error) {
    console.error('Erro ao obter posts do LinkedIn:', error.response?.data || error.message);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao obter posts do LinkedIn'
    });
  }
};

/**
 * Obtém as métricas de engajamento do LinkedIn do usuário
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.getEngagement = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || !user.linkedinToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Usuário não conectado ao LinkedIn'
      });
    }

    // Na API real do LinkedIn, usaríamos o endpoint de engajamento
    // Como exemplo, vamos simular dados de engajamento
    const mockEngagementData = {
      overallEngagementRate: 4.2, // Porcentagem
      engagementByType: {
        likes: { count: 3250, percentage: 84.5 },
        comments: { count: 420, percentage: 10.9 },
        shares: { count: 180, percentage: 4.6 }
      },
      engagementTrend: [
        { date: '2023-01', rate: 3.8 },
        { date: '2023-02', rate: 3.9 },
        { date: '2023-03', rate: 4.0 },
        { date: '2023-04', rate: 4.1 },
        { date: '2023-05', rate: 4.2 }
      ],
      topPerformingContent: [
        { id: 'post1', engagement: 143, engagementRate: 5.7 },
        { id: 'post3', engagement: 112, engagementRate: 4.8 },
        { id: 'post7', engagement: 98, engagementRate: 4.3 }
      ]
    };

    // Salva os dados de métricas no banco de dados
    await LinkedInMetrics.findOneAndUpdate(
      { userId: user._id },
      { 
        $set: { 
          'engagement.overallRate': mockEngagementData.overallEngagementRate,
          'engagement.byType': mockEngagementData.engagementByType,
          'engagement.trend': mockEngagementData.engagementTrend,
          'engagement.topContent': mockEngagementData.topPerformingContent,
          updatedAt: new Date()
        }
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      status: 'success',
      data: mockEngagementData
    });
  } catch (error) {
    console.error('Erro ao obter métricas de engajamento do LinkedIn:', error.response?.data || error.message);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao obter métricas de engajamento do LinkedIn'
    });
  }
};
