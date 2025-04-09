const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Esquema para armazenar posts criados no editor multimídia
 */
const postSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    platform: {
      type: String,
      enum: ['linkedin', 'twitter', 'facebook', 'instagram'],
      default: 'linkedin'
    },
    scheduledDate: {
      type: Date
    },
    publishedDate: {
      type: Date
    },
    tags: [{
      type: String,
      trim: true
    }],
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'published', 'failed'],
      default: 'draft'
    },
    media: [{
      type: {
        type: String,
        enum: ['image', 'video', 'pdf', 'audio'],
        required: true
      },
      url: {
        type: String,
        required: true
      },
      originalName: String,
      mimeType: String,
      size: Number,
      width: Number,
      height: Number,
      duration: Number
    }],
    metrics: {
      views: {
        type: Number,
        default: 0
      },
      likes: {
        type: Number,
        default: 0
      },
      comments: {
        type: Number,
        default: 0
      },
      shares: {
        type: Number,
        default: 0
      },
      clicks: {
        type: Number,
        default: 0
      },
      lastUpdated: Date
    },
    linkedinPostId: String,
    twitterPostId: String,
    facebookPostId: String,
    instagramPostId: String,
    error: String
  },
  {
    timestamps: true
  }
);

// Índices para melhorar a performance de consultas
postSchema.index({ userId: 1, status: 1 });
postSchema.index({ scheduledDate: 1, status: 1 });
postSchema.index({ createdAt: 1 });
postSchema.index({ platform: 1, publishedDate: 1 });
postSchema.index({ tags: 1 });

// Método para verificar se o post está publicado
postSchema.methods.isPublished = function() {
  return this.status === 'published';
};

// Método para verificar se o post está agendado
postSchema.methods.isScheduled = function() {
  return this.status === 'scheduled';
};

// Método para verificar se o post está pronto para publicação
postSchema.methods.isReadyToPublish = function() {
  if (this.status !== 'scheduled') return false;
  
  const now = new Date();
  return this.scheduledDate && this.scheduledDate <= now;
};

// Método estático para encontrar posts agendados prontos para publicação
postSchema.statics.findReadyToPublish = function() {
  const now = new Date();
  return this.find({
    status: 'scheduled',
    scheduledDate: { $lte: now }
  }).sort({ scheduledDate: 1 });
};

// Método estático para encontrar posts de um usuário
postSchema.statics.findUserPosts = function(userId, status = null, platform = null) {
  const query = { userId };
  
  if (status) {
    query.status = status;
  }
  
  if (platform) {
    query.platform = platform;
  }
  
  return this.find(query).sort({ createdAt: -1 });
};

// Método estático para buscar posts por tags
postSchema.statics.findByTags = function(tags) {
  return this.find({
    tags: { $in: tags }
  }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Post', postSchema);
