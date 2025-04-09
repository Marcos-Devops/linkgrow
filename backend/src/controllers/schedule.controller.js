const Schedule = require('../models/schedule.model');
const Post = require('../models/post.model');
const { Queue } = require('bull');
const mongoose = require('mongoose');

// Configuração da fila de publicação
const publishQueue = new Queue('post-publishing', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  }
});

/**
 * Criar um novo agendamento
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 */
exports.createSchedule = async (req, res) => {
  try {
    const {
      title,
      content,
      scheduledDate,
      platforms,
      media,
      postId,
      carouselId,
      tags,
      recurrence
    } = req.body;

    // Validação básica
    if (!title || !content || !scheduledDate || !platforms || platforms.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Dados incompletos para criar agendamento'
      });
    }

    // Verificar se o postId é válido, se fornecido
    if (postId) {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post não encontrado'
        });
      }
    }

    // Criar o agendamento
    const schedule = new Schedule({
      title,
      content,
      scheduledDate: new Date(scheduledDate),
      platforms,
      media: media || [],
      userId: req.user._id,
      postId: postId || null,
      carouselId: carouselId || null,
      tags: tags || [],
      recurrence: recurrence || { isRecurring: false }
    });

    await schedule.save();

    // Adicionar à fila de publicação
    await publishQueue.add(
      'schedule-post',
      { scheduleId: schedule._id },
      { 
        delay: new Date(scheduledDate) - new Date(),
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 60000 // 1 minuto
        }
      }
    );

    return res.status(201).json({
      success: true,
      message: 'Agendamento criado com sucesso',
      data: schedule
    });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao criar agendamento',
      error: error.message
    });
  }
};

/**
 * Obter todos os agendamentos do usuário
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 */
exports.getSchedules = async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      status, 
      platform,
      page = 1,
      limit = 10,
      sort = '-scheduledDate'
    } = req.query;

    // Construir o filtro
    const filter = { userId: req.user._id };

    // Filtrar por intervalo de datas
    if (startDate || endDate) {
      filter.scheduledDate = {};
      if (startDate) filter.scheduledDate.$gte = new Date(startDate);
      if (endDate) filter.scheduledDate.$lte = new Date(endDate);
    }

    // Filtrar por status
    if (status) {
      filter.status = status;
    }

    // Filtrar por plataforma
    if (platform) {
      filter.platforms = platform;
    }

    // Calcular paginação
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Buscar agendamentos
    const schedules = await Schedule.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Contar total de registros para paginação
    const total = await Schedule.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: schedules,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar agendamentos',
      error: error.message
    });
  }
};

/**
 * Obter um agendamento específico
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 */
exports.getScheduleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de agendamento inválido'
      });
    }

    const schedule = await Schedule.findOne({
      _id: id,
      userId: req.user._id
    }).lean();

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      data: schedule
    });
  } catch (error) {
    console.error(`Erro ao buscar agendamento ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar agendamento',
      error: error.message
    });
  }
};

/**
 * Atualizar um agendamento
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 */
exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de agendamento inválido'
      });
    }

    // Buscar o agendamento atual
    const schedule = await Schedule.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado'
      });
    }

    // Verificar se o agendamento já foi publicado
    if (schedule.status === 'published') {
      return res.status(400).json({
        success: false,
        message: 'Não é possível editar um agendamento já publicado'
      });
    }

    // Atualizar os campos permitidos
    const allowedUpdates = [
      'title', 'content', 'scheduledDate', 'platforms', 
      'media', 'tags', 'recurrence', 'status'
    ];
    
    allowedUpdates.forEach(field => {
      if (updateData[field] !== undefined) {
        schedule[field] = updateData[field];
      }
    });

    // Se a data de agendamento foi alterada, atualizar na fila
    if (updateData.scheduledDate && 
        new Date(updateData.scheduledDate).getTime() !== schedule.scheduledDate.getTime()) {
      
      // Remover jobs antigos para este agendamento
      const jobs = await publishQueue.getJobs(['delayed', 'waiting']);
      for (const job of jobs) {
        if (job.data.scheduleId && job.data.scheduleId.toString() === id) {
          await job.remove();
        }
      }
      
      // Adicionar novo job com a data atualizada
      await publishQueue.add(
        'schedule-post',
        { scheduleId: schedule._id },
        { 
          delay: new Date(updateData.scheduledDate) - new Date(),
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 60000 // 1 minuto
          }
        }
      );
    }

    await schedule.save();

    return res.status(200).json({
      success: true,
      message: 'Agendamento atualizado com sucesso',
      data: schedule
    });
  } catch (error) {
    console.error(`Erro ao atualizar agendamento ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao atualizar agendamento',
      error: error.message
    });
  }
};

/**
 * Excluir um agendamento
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 */
exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de agendamento inválido'
      });
    }

    // Buscar o agendamento
    const schedule = await Schedule.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado'
      });
    }

    // Verificar se o agendamento já foi publicado
    if (schedule.status === 'published') {
      return res.status(400).json({
        success: false,
        message: 'Não é possível excluir um agendamento já publicado'
      });
    }

    // Remover jobs da fila
    const jobs = await publishQueue.getJobs(['delayed', 'waiting']);
    for (const job of jobs) {
      if (job.data.scheduleId && job.data.scheduleId.toString() === id) {
        await job.remove();
      }
    }

    // Excluir o agendamento
    await Schedule.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: 'Agendamento excluído com sucesso'
    });
  } catch (error) {
    console.error(`Erro ao excluir agendamento ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao excluir agendamento',
      error: error.message
    });
  }
};

/**
 * Publicar um agendamento imediatamente
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 */
exports.publishNow = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de agendamento inválido'
      });
    }

    // Buscar o agendamento
    const schedule = await Schedule.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado'
      });
    }

    // Verificar se o agendamento já foi publicado
    if (schedule.status === 'published') {
      return res.status(400).json({
        success: false,
        message: 'Este agendamento já foi publicado'
      });
    }

    // Remover jobs antigos da fila
    const jobs = await publishQueue.getJobs(['delayed', 'waiting']);
    for (const job of jobs) {
      if (job.data.scheduleId && job.data.scheduleId.toString() === id) {
        await job.remove();
      }
    }

    // Adicionar à fila para publicação imediata
    await publishQueue.add(
      'schedule-post',
      { scheduleId: schedule._id },
      { 
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 60000 // 1 minuto
        }
      }
    );

    // Atualizar a data de agendamento para agora
    schedule.scheduledDate = new Date();
    await schedule.save();

    return res.status(200).json({
      success: true,
      message: 'Agendamento enviado para publicação imediata',
      data: schedule
    });
  } catch (error) {
    console.error(`Erro ao publicar agendamento ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao publicar agendamento',
      error: error.message
    });
  }
};

/**
 * Reagendar um post
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 */
exports.reschedulePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduledDate } = req.body;

    if (!scheduledDate) {
      return res.status(400).json({
        success: false,
        message: 'Nova data de agendamento é obrigatória'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de agendamento inválido'
      });
    }

    // Buscar o agendamento
    const schedule = await Schedule.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado'
      });
    }

    // Verificar se o agendamento já foi publicado
    if (schedule.status === 'published') {
      return res.status(400).json({
        success: false,
        message: 'Não é possível reagendar um post já publicado'
      });
    }

    // Atualizar a data de agendamento
    schedule.scheduledDate = new Date(scheduledDate);
    
    // Se o status for 'failed', voltar para 'scheduled'
    if (schedule.status === 'failed') {
      schedule.status = 'scheduled';
      schedule.metadata.errorMessage = null;
    }
    
    await schedule.save();

    // Remover jobs antigos da fila
    const jobs = await publishQueue.getJobs(['delayed', 'waiting']);
    for (const job of jobs) {
      if (job.data.scheduleId && job.data.scheduleId.toString() === id) {
        await job.remove();
      }
    }

    // Adicionar novo job com a data atualizada
    await publishQueue.add(
      'schedule-post',
      { scheduleId: schedule._id },
      { 
        delay: new Date(scheduledDate) - new Date(),
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 60000 // 1 minuto
        }
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Post reagendado com sucesso',
      data: schedule
    });
  } catch (error) {
    console.error(`Erro ao reagendar post ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao reagendar post',
      error: error.message
    });
  }
};

/**
 * Obter estatísticas de agendamento
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 */
exports.getScheduleStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Construir filtro de data
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    
    // Filtro base para o usuário atual
    const baseFilter = { 
      userId: req.user._id
    };
    
    // Adicionar filtro de data se especificado
    if (Object.keys(dateFilter).length > 0) {
      baseFilter.scheduledDate = dateFilter;
    }
    
    // Estatísticas por status
    const statusStats = await Schedule.aggregate([
      { $match: baseFilter },
      { $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Estatísticas por plataforma
    const platformStats = await Schedule.aggregate([
      { $match: baseFilter },
      { $unwind: '$platforms' },
      { $group: {
          _id: '$platforms',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Estatísticas por dia da semana
    const dayOfWeekStats = await Schedule.aggregate([
      { $match: baseFilter },
      { $project: {
          dayOfWeek: { $dayOfWeek: '$scheduledDate' }
        }
      },
      { $group: {
          _id: '$dayOfWeek',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Estatísticas por hora do dia
    const hourOfDayStats = await Schedule.aggregate([
      { $match: baseFilter },
      { $project: {
          hour: { $hour: '$scheduledDate' }
        }
      },
      { $group: {
          _id: '$hour',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    return res.status(200).json({
      success: true,
      data: {
        statusStats: statusStats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        platformStats: platformStats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        dayOfWeekStats: dayOfWeekStats.reduce((acc, curr) => {
          // Converter de 1-7 (domingo-sábado) para 0-6 (domingo-sábado)
          const day = curr._id - 1;
          acc[day] = curr.count;
          return acc;
        }, {}),
        hourOfDayStats: hourOfDayStats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas de agendamento:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao obter estatísticas de agendamento',
      error: error.message
    });
  }
};
