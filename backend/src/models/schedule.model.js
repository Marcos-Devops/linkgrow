const mongoose = require('mongoose');

/**
 * Schema para agendamento de posts
 */
const scheduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'published', 'failed', 'draft'],
      default: 'scheduled',
    },
    platforms: [{
      type: String,
      enum: ['linkedin', 'twitter', 'facebook', 'instagram'],
      required: true,
    }],
    media: [{
      type: {
        type: String,
        enum: ['image', 'video', 'document'],
      },
      url: String,
      alt: String,
    }],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    carouselId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Carousel',
    },
    metadata: {
      linkedinPostId: String,
      twitterPostId: String,
      facebookPostId: String,
      instagramPostId: String,
      publishedUrl: String,
      errorMessage: String,
    },
    tags: [String],
    recurrence: {
      isRecurring: {
        type: Boolean,
        default: false,
      },
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'custom'],
      },
      interval: Number, // A cada X dias/semanas/meses
      endDate: Date,
      daysOfWeek: [Number], // 0-6 (domingo-sábado)
      daysOfMonth: [Number], // 1-31
    },
  },
  {
    timestamps: true,
  }
);

// Índices para melhorar a performance das consultas
scheduleSchema.index({ userId: 1, scheduledDate: 1 });
scheduleSchema.index({ status: 1 });
scheduleSchema.index({ 'platforms': 1 });

/**
 * Método para verificar se um agendamento está pronto para ser publicado
 */
scheduleSchema.methods.isReadyToPublish = function() {
  const now = new Date();
  return this.status === 'scheduled' && this.scheduledDate <= now;
};

/**
 * Método para marcar um agendamento como publicado
 */
scheduleSchema.methods.markAsPublished = function(platformData) {
  this.status = 'published';
  
  if (platformData) {
    if (platformData.linkedinPostId) {
      this.metadata.linkedinPostId = platformData.linkedinPostId;
    }
    if (platformData.twitterPostId) {
      this.metadata.twitterPostId = platformData.twitterPostId;
    }
    if (platformData.facebookPostId) {
      this.metadata.facebookPostId = platformData.facebookPostId;
    }
    if (platformData.instagramPostId) {
      this.metadata.instagramPostId = platformData.instagramPostId;
    }
    if (platformData.publishedUrl) {
      this.metadata.publishedUrl = platformData.publishedUrl;
    }
  }
  
  return this.save();
};

/**
 * Método para marcar um agendamento como falho
 */
scheduleSchema.methods.markAsFailed = function(errorMessage) {
  this.status = 'failed';
  this.metadata.errorMessage = errorMessage;
  return this.save();
};

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
