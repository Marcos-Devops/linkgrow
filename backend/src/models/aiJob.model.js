const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Esquema para armazenar jobs de processamento de IA
 */
const aiJobSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    files: [{
      type: String,
      required: true
    }],
    context: {
      title: String,
      platform: {
        type: String,
        enum: ['linkedin', 'twitter', 'facebook', 'instagram'],
        default: 'linkedin'
      },
      tags: [String],
      existingContent: String
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    suggestions: [String],
    error: String,
    completedAt: Date
  },
  {
    timestamps: true
  }
);

// Índices para melhorar a performance de consultas
aiJobSchema.index({ userId: 1, status: 1 });
aiJobSchema.index({ createdAt: 1 });

// Método para verificar se o job está completo
aiJobSchema.methods.isCompleted = function() {
  return this.status === 'completed';
};

// Método para verificar se o job falhou
aiJobSchema.methods.hasFailed = function() {
  return this.status === 'failed';
};

// Método para verificar se o job está em andamento
aiJobSchema.methods.isInProgress = function() {
  return this.status === 'pending' || this.status === 'processing';
};

// Método estático para encontrar jobs pendentes
aiJobSchema.statics.findPendingJobs = function() {
  return this.find({ status: { $in: ['pending', 'processing'] } })
    .sort({ createdAt: 1 });
};

// Método estático para encontrar jobs de um usuário
aiJobSchema.statics.findUserJobs = function(userId) {
  return this.find({ userId })
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model('AiJob', aiJobSchema);
