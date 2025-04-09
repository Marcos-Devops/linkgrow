const LinkedInMetrics = require('../models/linkedinMetrics.model');
const User = require('../models/user.model');

/**
 * Obtém todas as métricas do dashboard
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.getDashboardMetrics = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuário não encontrado'
      });
    }

    // Busca as métricas do LinkedIn do usuário
    const metrics = await LinkedInMetrics.findOne({ userId: user._id });
    
    if (!metrics) {
      return res.status(404).json({
        status: 'error',
        message: 'Métricas não encontradas. Conecte sua conta do LinkedIn primeiro.'
      });
    }

    // Formata os dados para o dashboard
    const dashboardData = {
      followers: {
        total: metrics.followers.total || 0,
        growthRate: metrics.followers.growthRate || 0,
        recentFollowers: metrics.followers.recentFollowers || 0
      },
      connections: {
        total: metrics.connections.total || 0,
        growthRate: metrics.connections.growthRate || 0,
        recentConnections: metrics.connections.recentConnections || 0
      },
      posts: {
        total: metrics.posts.total || 0,
        engagement: metrics.posts.engagement || {
          totalLikes: 0,
          totalComments: 0,
          totalShares: 0,
          averageLikesPerPost: 0,
          averageCommentsPerPost: 0,
          averageSharesPerPost: 0
        }
      },
      engagement: {
        overallRate: metrics.engagement.overallRate || 0,
        byType: metrics.engagement.byType || {
          likes: { count: 0, percentage: 0 },
          comments: { count: 0, percentage: 0 },
          shares: { count: 0, percentage: 0 }
        },
        topContent: metrics.engagement.topContent || []
      },
      lastUpdated: metrics.updatedAt
    };

    res.status(200).json({
      status: 'success',
      data: dashboardData
    });
  } catch (error) {
    console.error('Erro ao obter métricas do dashboard:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao obter métricas do dashboard'
    });
  }
};

/**
 * Obtém o crescimento de seguidores
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.getFollowerGrowth = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuário não encontrado'
      });
    }

    // Busca as métricas do LinkedIn do usuário
    const metrics = await LinkedInMetrics.findOne({ userId: user._id });
    
    if (!metrics) {
      return res.status(404).json({
        status: 'error',
        message: 'Métricas não encontradas. Conecte sua conta do LinkedIn primeiro.'
      });
    }

    // Simula dados históricos de crescimento de seguidores
    const followerGrowthData = {
      current: metrics.followers.total || 0,
      growthRate: metrics.followers.growthRate || 0,
      recentFollowers: metrics.followers.recentFollowers || 0,
      historicalData: [
        { date: '2023-01', followers: 980 },
        { date: '2023-02', followers: 1020 },
        { date: '2023-03', followers: 1080 },
        { date: '2023-04', followers: 1150 },
        { date: '2023-05', followers: 1250 }
      ],
      demographics: metrics.followers.demographics || {
        industries: [],
        locations: []
      }
    };

    res.status(200).json({
      status: 'success',
      data: followerGrowthData
    });
  } catch (error) {
    console.error('Erro ao obter crescimento de seguidores:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao obter crescimento de seguidores'
    });
  }
};

/**
 * Obtém o crescimento de conexões
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.getConnectionGrowth = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuário não encontrado'
      });
    }

    // Busca as métricas do LinkedIn do usuário
    const metrics = await LinkedInMetrics.findOne({ userId: user._id });
    
    if (!metrics) {
      return res.status(404).json({
        status: 'error',
        message: 'Métricas não encontradas. Conecte sua conta do LinkedIn primeiro.'
      });
    }

    // Simula dados históricos de crescimento de conexões
    const connectionGrowthData = {
      current: metrics.connections.total || 0,
      growthRate: metrics.connections.growthRate || 0,
      recentConnections: metrics.connections.recentConnections || 0,
      historicalData: [
        { date: '2023-01', connections: 420 },
        { date: '2023-02', connections: 435 },
        { date: '2023-03', connections: 450 },
        { date: '2023-04', connections: 468 },
        { date: '2023-05', connections: 487 }
      ]
    };

    res.status(200).json({
      status: 'success',
      data: connectionGrowthData
    });
  } catch (error) {
    console.error('Erro ao obter crescimento de conexões:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao obter crescimento de conexões'
    });
  }
};

/**
 * Obtém a taxa de engajamento
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.getEngagementRate = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuário não encontrado'
      });
    }

    // Busca as métricas do LinkedIn do usuário
    const metrics = await LinkedInMetrics.findOne({ userId: user._id });
    
    if (!metrics) {
      return res.status(404).json({
        status: 'error',
        message: 'Métricas não encontradas. Conecte sua conta do LinkedIn primeiro.'
      });
    }

    // Formata os dados de taxa de engajamento
    const engagementRateData = {
      overallRate: metrics.engagement.overallRate || 0,
      byType: metrics.engagement.byType || {
        likes: { count: 0, percentage: 0 },
        comments: { count: 0, percentage: 0 },
        shares: { count: 0, percentage: 0 }
      },
      trend: metrics.engagement.trend || [],
      comparisonToIndustry: {
        industryAverage: 3.1,
        difference: ((metrics.engagement.overallRate || 0) - 3.1).toFixed(1)
      }
    };

    res.status(200).json({
      status: 'success',
      data: engagementRateData
    });
  } catch (error) {
    console.error('Erro ao obter taxa de engajamento:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao obter taxa de engajamento'
    });
  }
};

/**
 * Obtém o desempenho de posts
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.getPostPerformance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuário não encontrado'
      });
    }

    // Busca as métricas do LinkedIn do usuário
    const metrics = await LinkedInMetrics.findOne({ userId: user._id });
    
    if (!metrics) {
      return res.status(404).json({
        status: 'error',
        message: 'Métricas não encontradas. Conecte sua conta do LinkedIn primeiro.'
      });
    }

    // Simula dados de desempenho de posts
    const postPerformanceData = {
      totalPosts: metrics.posts.total || 0,
      engagement: metrics.posts.engagement || {
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        averageLikesPerPost: 0,
        averageCommentsPerPost: 0,
        averageSharesPerPost: 0
      },
      topPerformingPosts: metrics.engagement.topContent || [],
      postsByType: [
        { type: 'Texto', count: 25, engagementRate: 4.5 },
        { type: 'Imagem', count: 12, engagementRate: 5.2 },
        { type: 'Vídeo', count: 3, engagementRate: 6.8 },
        { type: 'Documento', count: 2, engagementRate: 3.9 }
      ],
      bestTimeToPost: {
        day: 'Terça-feira',
        time: '09:00 - 11:00'
      }
    };

    res.status(200).json({
      status: 'success',
      data: postPerformanceData
    });
  } catch (error) {
    console.error('Erro ao obter desempenho de posts:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao obter desempenho de posts'
    });
  }
};
