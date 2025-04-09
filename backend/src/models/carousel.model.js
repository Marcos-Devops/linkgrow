const mongoose = require('mongoose');

/**
 * Modelo para slide de carrossel
 */
const slideSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  template: {
    type: String,
    required: true,
    enum: ['text-only', 'image-text', 'full-image', 'quote', 'stats', 'custom']
  },
  content: {
    title: String,
    subtitle: String,
    body: String,
    imageUrl: String,
    backgroundColor: String,
    textColor: String,
    buttonText: String,
    buttonUrl: String,
    customCss: String
  }
}, { _id: false });

/**
 * Modelo para carrossel
 */
const carouselSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome do carrossel é obrigatório'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  slides: [slideSchema],
  settings: {
    autoPlay: {
      type: Boolean,
      default: false
    },
    interval: {
      type: Number,
      default: 5000
    },
    loop: {
      type: Boolean,
      default: true
    },
    showIndicators: {
      type: Boolean,
      default: true
    },
    showArrows: {
      type: Boolean,
      default: true
    },
    responsive: {
      type: Boolean,
      default: true
    }
  },
  platform: {
    type: String,
    enum: ['linkedin', 'instagram', 'facebook', 'twitter', 'all'],
    default: 'all'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware para atualizar o campo updatedAt antes de salvar
carouselSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Carousel = mongoose.model('Carousel', carouselSchema);

module.exports = Carousel;
