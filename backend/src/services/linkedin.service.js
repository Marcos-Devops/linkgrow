const axios = require('axios');

/**
 * Serviço para integração com a API do LinkedIn
 */
const linkedinService = {
  /**
   * Criar um post no LinkedIn
   * @param {string} accessToken - Token de acesso do usuário
   * @param {Object} postData - Dados do post
   * @returns {Promise<Object>} - Resultado da publicação
   */
  createPost: async (accessToken, postData) => {
    try {
      // Obter o ID do usuário no LinkedIn
      const userProfile = await linkedinService.getUserProfile(accessToken);
      const userId = userProfile.id;
      
      // Preparar o corpo da requisição
      const requestBody = {
        author: `urn:li:person:${userId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: postData.text
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': postData.visibility || 'PUBLIC'
        }
      };
      
      // Adicionar mídia se fornecida
      if (postData.imageUrl || postData.videoUrl || postData.documentUrl) {
        // Primeiro, fazer upload da mídia
        let mediaUrn;
        
        if (postData.imageUrl) {
          mediaUrn = await linkedinService.uploadImage(accessToken, postData.imageUrl);
          requestBody.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'IMAGE';
        } else if (postData.videoUrl) {
          mediaUrn = await linkedinService.uploadVideo(accessToken, postData.videoUrl);
          requestBody.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'VIDEO';
        } else if (postData.documentUrl) {
          mediaUrn = await linkedinService.uploadDocument(accessToken, postData.documentUrl);
          requestBody.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'DOCUMENT';
        }
        
        if (mediaUrn) {
          requestBody.specificContent['com.linkedin.ugc.ShareContent'].media = [
            {
              status: 'READY',
              description: {
                text: postData.mediaAlt || ''
              },
              media: mediaUrn,
              title: {
                text: postData.mediaTitle || ''
              }
            }
          ];
        }
      }
      
      // Fazer a requisição para a API do LinkedIn
      const response = await axios.post(
        'https://api.linkedin.com/v2/ugcPosts',
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0'
          }
        }
      );
      
      // Extrair o ID do post da resposta
      const postId = response.data.id;
      const postUrn = postId.split(':').pop();
      
      return {
        success: true,
        id: postId,
        postUrl: `https://www.linkedin.com/feed/update/${postUrn}/`
      };
    } catch (error) {
      console.error('Erro ao criar post no LinkedIn:', error.response?.data || error.message);
      throw new Error(`Falha ao publicar no LinkedIn: ${error.response?.data?.message || error.message}`);
    }
  },
  
  /**
   * Obter o perfil do usuário no LinkedIn
   * @param {string} accessToken - Token de acesso do usuário
   * @returns {Promise<Object>} - Perfil do usuário
   */
  getUserProfile: async (accessToken) => {
    try {
      const response = await axios.get(
        'https://api.linkedin.com/v2/me',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter perfil do LinkedIn:', error.response?.data || error.message);
      throw new Error(`Falha ao obter perfil do LinkedIn: ${error.response?.data?.message || error.message}`);
    }
  },
  
  /**
   * Fazer upload de uma imagem para o LinkedIn
   * @param {string} accessToken - Token de acesso do usuário
   * @param {string} imageUrl - URL da imagem
   * @returns {Promise<string>} - URN da mídia no LinkedIn
   */
  uploadImage: async (accessToken, imageUrl) => {
    try {
      // 1. Iniciar o upload
      const initResponse = await axios.post(
        'https://api.linkedin.com/v2/assets?action=registerUpload',
        {
          registerUploadRequest: {
            recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
            owner: 'urn:li:person:' + (await linkedinService.getUserProfile(accessToken)).id,
            serviceRelationships: [
              {
                relationshipType: 'OWNER',
                identifier: 'urn:li:userGeneratedContent'
              }
            ]
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0'
          }
        }
      );
      
      // 2. Obter a URL de upload e o asset URN
      const uploadUrl = initResponse.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
      const assetUrn = initResponse.data.value.asset;
      
      // 3. Baixar a imagem da URL fornecida
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(imageResponse.data, 'binary');
      
      // 4. Fazer upload da imagem
      await axios.put(
        uploadUrl,
        imageBuffer,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/octet-stream'
          }
        }
      );
      
      return assetUrn;
    } catch (error) {
      console.error('Erro ao fazer upload de imagem para o LinkedIn:', error.response?.data || error.message);
      throw new Error(`Falha ao fazer upload de imagem: ${error.response?.data?.message || error.message}`);
    }
  },
  
  /**
   * Fazer upload de um vídeo para o LinkedIn
   * @param {string} accessToken - Token de acesso do usuário
   * @param {string} videoUrl - URL do vídeo
   * @returns {Promise<string>} - URN da mídia no LinkedIn
   */
  uploadVideo: async (accessToken, videoUrl) => {
    // Implementação similar ao uploadImage, mas para vídeos
    // A API do LinkedIn tem um fluxo específico para upload de vídeos
    throw new Error('Upload de vídeo para o LinkedIn não implementado');
  },
  
  /**
   * Fazer upload de um documento para o LinkedIn
   * @param {string} accessToken - Token de acesso do usuário
   * @param {string} documentUrl - URL do documento
   * @returns {Promise<string>} - URN da mídia no LinkedIn
   */
  uploadDocument: async (accessToken, documentUrl) => {
    // Implementação similar ao uploadImage, mas para documentos
    throw new Error('Upload de documento para o LinkedIn não implementado');
  },
  
  /**
   * Obter métricas de um post no LinkedIn
   * @param {string} accessToken - Token de acesso do usuário
   * @param {string} postId - ID do post
   * @returns {Promise<Object>} - Métricas do post
   */
  getPostMetrics: async (accessToken, postId) => {
    try {
      // Obter métricas de engajamento (likes, comentários, compartilhamentos)
      const response = await axios.get(
        `https://api.linkedin.com/v2/socialActions/${postId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0'
          }
        }
      );
      
      // Extrair contagens
      const counts = response.data;
      
      return {
        likes: counts.likesSummary?.totalLikes || 0,
        comments: counts.commentsSummary?.totalComments || 0,
        shares: counts.sharesSummary?.totalShares || 0
      };
    } catch (error) {
      console.error('Erro ao obter métricas do post no LinkedIn:', error.response?.data || error.message);
      throw new Error(`Falha ao obter métricas: ${error.response?.data?.message || error.message}`);
    }
  }
};

module.exports = linkedinService;
