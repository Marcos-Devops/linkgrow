import axios from 'axios';
import { CarouselData, Carousel } from '../types/carousel';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Serviço para gerenciar carrosséis
 */
const carouselService = {
  /**
   * Obter todos os carrosséis do usuário
   */
  getCarousels: async (): Promise<Carousel[]> => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/carousels`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Erro ao obter carrosséis:', error);
      throw error;
    }
  },
  
  /**
   * Obter um carrossel específico pelo ID
   * @param id ID do carrossel
   */
  getCarouselById: async (id: string): Promise<Carousel> => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/carousels/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data.data;
    } catch (error) {
      console.error(`Erro ao obter carrossel ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Salvar um novo carrossel
   * @param carouselData Dados do carrossel
   */
  saveCarousel: async (carouselData: CarouselData): Promise<Carousel> => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(`${API_URL}/carousels`, carouselData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Erro ao salvar carrossel:', error);
      throw error;
    }
  },
  
  /**
   * Atualizar um carrossel existente
   * @param id ID do carrossel
   * @param carouselData Dados atualizados do carrossel
   */
  updateCarousel: async (id: string, carouselData: CarouselData): Promise<Carousel> => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.put(`${API_URL}/carousels/${id}`, carouselData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data.data;
    } catch (error) {
      console.error(`Erro ao atualizar carrossel ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Excluir um carrossel
   * @param id ID do carrossel
   */
  deleteCarousel: async (id: string): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`${API_URL}/carousels/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error(`Erro ao excluir carrossel ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Duplicar um carrossel existente
   * @param id ID do carrossel a ser duplicado
   */
  duplicateCarousel: async (id: string): Promise<Carousel> => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(`${API_URL}/carousels/${id}/duplicate`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data.data;
    } catch (error) {
      console.error(`Erro ao duplicar carrossel ${id}:`, error);
      throw error;
    }
  }
};

export const {
  getCarousels,
  getCarouselById,
  saveCarousel,
  updateCarousel,
  deleteCarousel,
  duplicateCarousel
} = carouselService;

export default carouselService;
