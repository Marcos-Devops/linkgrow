const cron = require('node-cron');
const { Queue } = require('bull');
const Schedule = require('../models/schedule.model');
const linkedinService = require('./linkedin.service');

// Configuração da fila de publicação
const publishQueue = new Queue('post-publishing', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  }
});

/**
 * Inicializar o serviço de agendamento
 */
const initScheduler = () => {
  // Configurar o processador da fila de publicação
  publishQueue.process('schedule-post', async (job) => {
    try {
      const { scheduleId } = job.data;
      
      // Buscar o agendamento
      const schedule = await Schedule.findById(scheduleId);
      
      if (!schedule) {
        throw new Error(`Agendamento ${scheduleId} não encontrado`);
      }
      
      if (schedule.status !== 'scheduled') {
        return { success: false, message: `Agendamento ${scheduleId} não está no status 'scheduled'` };
      }
      
      // Verificar se está na hora de publicar
      if (new Date(schedule.scheduledDate) > new Date()) {
        // Ainda não está na hora, recolocar na fila
        const delay = new Date(schedule.scheduledDate) - new Date();
        await publishQueue.add(
          'schedule-post',
          { scheduleId: schedule._id },
          { 
            delay,
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 60000 // 1 minuto
            }
          }
        );
        return { success: true, message: 'Reagendado para o horário correto' };
      }
      
      // Publicar em cada plataforma
      const platformResults = {};
      let overallSuccess = true;
      
      for (const platform of schedule.platforms) {
        try {
          let result;
          
          switch (platform) {
            case 'linkedin':
              result = await publishToLinkedIn(schedule);
              break;
            case 'twitter':
              // Implementar integração com Twitter
              result = { success: false, message: 'Integração com Twitter não implementada' };
              break;
            case 'facebook':
              // Implementar integração com Facebook
              result = { success: false, message: 'Integração com Facebook não implementada' };
              break;
            case 'instagram':
              // Implementar integração com Instagram
              result = { success: false, message: 'Integração com Instagram não implementada' };
              break;
            default:
              result = { success: false, message: `Plataforma ${platform} não suportada` };
          }
          
          platformResults[platform] = result;
          
          if (!result.success) {
            overallSuccess = false;
          }
        } catch (error) {
          console.error(`Erro ao publicar no ${platform}:`, error);
          platformResults[platform] = { 
            success: false, 
            message: error.message || `Erro ao publicar no ${platform}` 
          };
          overallSuccess = false;
        }
      }
      
      // Atualizar o status do agendamento
      if (overallSuccess) {
        await schedule.markAsPublished({
          linkedinPostId: platformResults.linkedin?.postId,
          twitterPostId: platformResults.twitter?.postId,
          facebookPostId: platformResults.facebook?.postId,
          instagramPostId: platformResults.instagram?.postId,
          publishedUrl: platformResults.linkedin?.url || 
                       platformResults.twitter?.url || 
                       platformResults.facebook?.url || 
                       platformResults.instagram?.url
        });
        
        // Se for recorrente, criar próximo agendamento
        if (schedule.recurrence && schedule.recurrence.isRecurring) {
          await createNextRecurrence(schedule);
        }
        
        return { 
          success: true, 
          message: 'Post publicado com sucesso em todas as plataformas',
          results: platformResults
        };
      } else {
        // Marcar como falha
        const errorMessages = Object.entries(platformResults)
          .filter(([_, result]) => !result.success)
          .map(([platform, result]) => `${platform}: ${result.message}`)
          .join('; ');
          
        await schedule.markAsFailed(errorMessages);
        
        return { 
          success: false, 
          message: 'Falha ao publicar em uma ou mais plataformas',
          results: platformResults
        };
      }
    } catch (error) {
      console.error('Erro ao processar agendamento:', error);
      return { 
        success: false, 
        message: error.message || 'Erro ao processar agendamento' 
      };
    }
  });
  
  // Configurar tarefa cron para verificar agendamentos pendentes a cada minuto
  cron.schedule('* * * * *', async () => {
    try {
      console.log('Verificando agendamentos pendentes...');
      
      // Buscar agendamentos que deveriam ter sido publicados
      const pendingSchedules = await Schedule.find({
        status: 'scheduled',
        scheduledDate: { $lte: new Date() }
      });
      
      console.log(`Encontrados ${pendingSchedules.length} agendamentos pendentes`);
      
      // Adicionar à fila para processamento
      for (const schedule of pendingSchedules) {
        const existingJobs = await publishQueue.getJobs(['active', 'waiting', 'delayed']);
        const alreadyQueued = existingJobs.some(job => 
          job.data.scheduleId && job.data.scheduleId.toString() === schedule._id.toString()
        );
        
        if (!alreadyQueued) {
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
          console.log(`Agendamento ${schedule._id} adicionado à fila`);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar agendamentos pendentes:', error);
    }
  });
  
  console.log('Serviço de agendamento inicializado');
};

/**
 * Publicar no LinkedIn
 * @param {Object} schedule - Objeto de agendamento
 * @returns {Promise<Object>} - Resultado da publicação
 */
const publishToLinkedIn = async (schedule) => {
  try {
    // Buscar o token do LinkedIn do usuário
    const user = await require('mongoose').model('User').findById(schedule.userId);
    
    if (!user || !user.linkedinToken) {
      throw new Error('Usuário não possui token do LinkedIn');
    }
    
    // Preparar o conteúdo do post
    const postContent = {
      text: schedule.content,
      visibility: 'PUBLIC', // ou 'CONNECTIONS' ou 'LOGGED_IN'
    };
    
    // Adicionar mídia se houver
    if (schedule.media && schedule.media.length > 0) {
      const mediaItems = schedule.media.filter(m => m.url);
      
      if (mediaItems.length > 0) {
        // Adicionar primeira mídia (LinkedIn suporta apenas uma mídia por post)
        const media = mediaItems[0];
        
        if (media.type === 'image') {
          postContent.imageUrl = media.url;
        } else if (media.type === 'video') {
          postContent.videoUrl = media.url;
        } else if (media.type === 'document') {
          postContent.documentUrl = media.url;
        }
      }
    }
    
    // Publicar no LinkedIn
    const result = await linkedinService.createPost(user.linkedinToken, postContent);
    
    return {
      success: true,
      message: 'Post publicado com sucesso no LinkedIn',
      postId: result.id,
      url: result.postUrl
    };
  } catch (error) {
    console.error('Erro ao publicar no LinkedIn:', error);
    throw new Error(`Falha ao publicar no LinkedIn: ${error.message}`);
  }
};

/**
 * Criar próximo agendamento recorrente
 * @param {Object} schedule - Objeto de agendamento atual
 */
const createNextRecurrence = async (schedule) => {
  try {
    const { recurrence } = schedule;
    
    if (!recurrence || !recurrence.isRecurring) {
      return;
    }
    
    // Verificar se já passou da data final
    if (recurrence.endDate && new Date(recurrence.endDate) < new Date()) {
      return;
    }
    
    // Calcular a próxima data com base na frequência
    let nextDate = new Date(schedule.scheduledDate);
    
    switch (recurrence.frequency) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + (recurrence.interval || 1));
        break;
        
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + (recurrence.interval || 1) * 7);
        break;
        
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + (recurrence.interval || 1));
        break;
        
      case 'custom':
        // Para frequência personalizada, verificar dias da semana ou do mês
        if (recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
          // Encontrar o próximo dia da semana válido
          let found = false;
          let currentDay = nextDate.getDay();
          let daysToAdd = 1;
          
          while (!found && daysToAdd < 8) {
            const nextDay = (currentDay + daysToAdd) % 7;
            if (recurrence.daysOfWeek.includes(nextDay)) {
              found = true;
              nextDate.setDate(nextDate.getDate() + daysToAdd);
            } else {
              daysToAdd++;
            }
          }
          
          if (!found) {
            // Se não encontrou, usar o primeiro dia da próxima semana
            nextDate.setDate(nextDate.getDate() + 7);
            nextDate.setDay(recurrence.daysOfWeek[0]);
          }
        } else if (recurrence.daysOfMonth && recurrence.daysOfMonth.length > 0) {
          // Encontrar o próximo dia do mês válido
          const currentDay = nextDate.getDate();
          const currentMonth = nextDate.getMonth();
          const currentYear = nextDate.getFullYear();
          
          // Ordenar os dias do mês
          const sortedDays = [...recurrence.daysOfMonth].sort((a, b) => a - b);
          
          // Encontrar o próximo dia válido no mês atual
          const nextDayInCurrentMonth = sortedDays.find(day => day > currentDay);
          
          if (nextDayInCurrentMonth) {
            // Há um dia válido no mês atual
            nextDate.setDate(nextDayInCurrentMonth);
          } else {
            // Ir para o primeiro dia válido do próximo mês
            nextDate.setMonth(currentMonth + 1);
            nextDate.setDate(sortedDays[0]);
          }
        } else {
          // Se não há configuração específica, adicionar um dia
          nextDate.setDate(nextDate.getDate() + 1);
        }
        break;
        
      default:
        // Padrão: adicionar um dia
        nextDate.setDate(nextDate.getDate() + 1);
    }
    
    // Verificar se a próxima data está além da data final
    if (recurrence.endDate && nextDate > new Date(recurrence.endDate)) {
      return;
    }
    
    // Criar o próximo agendamento
    const newSchedule = new Schedule({
      title: schedule.title,
      content: schedule.content,
      scheduledDate: nextDate,
      platforms: schedule.platforms,
      media: schedule.media,
      userId: schedule.userId,
      postId: schedule.postId,
      carouselId: schedule.carouselId,
      tags: schedule.tags,
      recurrence: schedule.recurrence
    });
    
    await newSchedule.save();
    
    // Adicionar à fila de publicação
    await publishQueue.add(
      'schedule-post',
      { scheduleId: newSchedule._id },
      { 
        delay: nextDate - new Date(),
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 60000 // 1 minuto
        }
      }
    );
    
    console.log(`Próximo agendamento recorrente criado: ${newSchedule._id}`);
  } catch (error) {
    console.error('Erro ao criar próximo agendamento recorrente:', error);
  }
};

module.exports = {
  initScheduler,
  publishQueue
};
