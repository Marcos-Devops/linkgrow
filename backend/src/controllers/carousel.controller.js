const Carousel = require('../models/carousel.model');

/**
 * Controlador para gerenciar carrosséis
 */
const carouselController = {
  /**
   * Criar um novo carrossel
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   */
  createCarousel: async (req, res) => {
    try {
      const { name, description, slides, settings, platform } = req.body;
      
      // Validar se os slides foram fornecidos
      if (!slides || !Array.isArray(slides) || slides.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Pelo menos um slide deve ser fornecido'
        });
      }
      
      // Criar o carrossel
      const carousel = new Carousel({
        name,
        description,
        slides,
        settings,
        platform,
        userId: req.user._id
      });
      
      // Salvar o carrossel
      await carousel.save();
      
      return res.status(201).json({
        status: 'success',
        message: 'Carrossel criado com sucesso',
        data: carousel
      });
    } catch (error) {
      console.error('Erro ao criar carrossel:', error);
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Erro ao criar carrossel'
      });
    }
  },
  
  /**
   * Obter todos os carrosséis do usuário
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   */
  getCarousels: async (req, res) => {
    try {
      const carousels = await Carousel.find({ userId: req.user._id })
        .sort({ createdAt: -1 });
      
      return res.status(200).json({
        status: 'success',
        message: 'Carrosséis obtidos com sucesso',
        data: carousels
      });
    } catch (error) {
      console.error('Erro ao obter carrosséis:', error);
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Erro ao obter carrosséis'
      });
    }
  },
  
  /**
   * Obter um carrossel específico
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   */
  getCarouselById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const carousel = await Carousel.findOne({
        _id: id,
        userId: req.user._id
      });
      
      if (!carousel) {
        return res.status(404).json({
          status: 'error',
          message: 'Carrossel não encontrado'
        });
      }
      
      return res.status(200).json({
        status: 'success',
        message: 'Carrossel obtido com sucesso',
        data: carousel
      });
    } catch (error) {
      console.error('Erro ao obter carrossel:', error);
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Erro ao obter carrossel'
      });
    }
  },
  
  /**
   * Atualizar um carrossel
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   */
  updateCarousel: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, slides, settings, platform } = req.body;
      
      // Validar se os slides foram fornecidos
      if (slides && (!Array.isArray(slides) || slides.length === 0)) {
        return res.status(400).json({
          status: 'error',
          message: 'Pelo menos um slide deve ser fornecido'
        });
      }
      
      // Verificar se o carrossel existe
      const carousel = await Carousel.findOne({
        _id: id,
        userId: req.user._id
      });
      
      if (!carousel) {
        return res.status(404).json({
          status: 'error',
          message: 'Carrossel não encontrado'
        });
      }
      
      // Atualizar o carrossel
      const updatedCarousel = await Carousel.findByIdAndUpdate(
        id,
        {
          name,
          description,
          slides,
          settings,
          platform,
          updatedAt: Date.now()
        },
        { new: true }
      );
      
      return res.status(200).json({
        status: 'success',
        message: 'Carrossel atualizado com sucesso',
        data: updatedCarousel
      });
    } catch (error) {
      console.error('Erro ao atualizar carrossel:', error);
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Erro ao atualizar carrossel'
      });
    }
  },
  
  /**
   * Excluir um carrossel
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   */
  deleteCarousel: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Verificar se o carrossel existe
      const carousel = await Carousel.findOne({
        _id: id,
        userId: req.user._id
      });
      
      if (!carousel) {
        return res.status(404).json({
          status: 'error',
          message: 'Carrossel não encontrado'
        });
      }
      
      // Excluir o carrossel
      await Carousel.findByIdAndDelete(id);
      
      return res.status(200).json({
        status: 'success',
        message: 'Carrossel excluído com sucesso'
      });
    } catch (error) {
      console.error('Erro ao excluir carrossel:', error);
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Erro ao excluir carrossel'
      });
    }
  },
  
  /**
   * Duplicar um carrossel existente
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   */
  duplicateCarousel: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Verificar se o carrossel existe
      const carousel = await Carousel.findOne({
        _id: id,
        userId: req.user._id
      });
      
      if (!carousel) {
        return res.status(404).json({
          status: 'error',
          message: 'Carrossel não encontrado'
        });
      }
      
      // Criar um novo carrossel baseado no existente
      const newCarousel = new Carousel({
        name: `${carousel.name} (cópia)`,
        description: carousel.description,
        slides: carousel.slides,
        settings: carousel.settings,
        platform: carousel.platform,
        userId: req.user._id
      });
      
      // Salvar o novo carrossel
      await newCarousel.save();
      
      return res.status(201).json({
        status: 'success',
        message: 'Carrossel duplicado com sucesso',
        data: newCarousel
      });
    } catch (error) {
      console.error('Erro ao duplicar carrossel:', error);
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Erro ao duplicar carrossel'
      });
    }
  }
};

module.exports = carouselController;
