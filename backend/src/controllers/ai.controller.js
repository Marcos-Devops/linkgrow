const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const Queue = require('bull');
const { NlpManager } = require('node-nlp');
const pdfParse = require('pdf-parse');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const { OpenAI } = require('openai');
const AiJob = require('../models/aiJob.model');

// Configurar o ffmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

// Configurar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sua_chave_api',
});

// Configurar a fila de processamento
const aiProcessingQueue = new Queue('ai-processing', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  }
});

// Inicializar o gerenciador de NLP
const nlpManager = new NlpManager({ languages: ['pt'] });

/**
 * Faz upload de arquivos para processamento de IA
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Nenhum arquivo enviado'
      });
    }

    // Cria o diretório de uploads se não existir
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Gera URLs para os arquivos enviados
    const fileUrls = req.files.map(file => {
      return {
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
        url: `/uploads/${file.filename}`
      };
    });

    res.status(200).json({
      status: 'success',
      message: 'Arquivos enviados com sucesso',
      urls: fileUrls.map(file => file.url)
    });
  } catch (error) {
    console.error('Erro ao fazer upload de arquivos:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao fazer upload de arquivos'
    });
  }
};

/**
 * Inicia o processamento assíncrono de arquivos para gerar sugestões de conteúdo
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.processContent = async (req, res) => {
  try {
    const { files, context } = req.body;
    
    if (!files || files.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Nenhum arquivo fornecido para processamento'
      });
    }

    // Criar um novo job no banco de dados
    const aiJob = new AiJob({
      userId: req.user._id,
      files,
      context,
      status: 'pending',
      progress: 0
    });

    await aiJob.save();

    // Adicionar o job à fila de processamento
    await aiProcessingQueue.add(
      'process-content',
      {
        jobId: aiJob._id,
        files,
        context,
        userId: req.user._id
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000
        }
      }
    );

    res.status(202).json({
      status: 'success',
      message: 'Processamento iniciado',
      jobId: aiJob._id
    });
  } catch (error) {
    console.error('Erro ao iniciar processamento de conteúdo:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao iniciar processamento de conteúdo'
    });
  }
};

/**
 * Gera sugestões para melhorar conteúdo existente
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.getSuggestions = async (req, res) => {
  try {
    const { content, type = 'content_improvement' } = req.body;
    
    if (!content) {
      return res.status(400).json({
        status: 'error',
        message: 'Nenhum conteúdo fornecido'
      });
    }

    let prompt;
    switch (type) {
      case 'grammar_check':
        prompt = `Corrija os erros gramaticais e de ortografia no seguinte texto, mantendo o estilo e tom originais: "${content}"`;
        break;
      case 'seo_optimization':
        prompt = `Otimize o seguinte texto para SEO, melhorando a legibilidade e incluindo palavras-chave relevantes, mantendo o significado original: "${content}"`;
        break;
      case 'content_improvement':
      default:
        prompt = `Melhore o seguinte texto para torná-lo mais envolvente e profissional para o LinkedIn, mantendo o significado original: "${content}"`;
        break;
    }

    // Usar OpenAI para gerar sugestões
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Você é um assistente especializado em melhorar conteúdo para redes sociais profissionais." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
    });

    const suggestion = completion.choices[0].message.content;

    res.status(200).json({
      status: 'success',
      suggestion
    });
  } catch (error) {
    console.error('Erro ao gerar sugestões:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao gerar sugestões'
    });
  }
};

/**
 * Verifica o status de um processamento de IA
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.getProcessingStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const aiJob = await AiJob.findById(jobId);
    
    if (!aiJob) {
      return res.status(404).json({
        status: 'error',
        message: 'Job não encontrado'
      });
    }

    // Verificar se o usuário é o dono do job
    if (aiJob.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Acesso negado'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        status: aiJob.status,
        progress: aiJob.progress,
        suggestions: aiJob.suggestions,
        createdAt: aiJob.createdAt,
        updatedAt: aiJob.updatedAt
      }
    });
  } catch (error) {
    console.error('Erro ao verificar status do processamento:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao verificar status do processamento'
    });
  }
};

// Configurar os processadores da fila
aiProcessingQueue.process('process-content', async (job) => {
  const { jobId, files, context, userId } = job.data;
  
  try {
    // Atualizar o status do job para 'processing'
    await AiJob.findByIdAndUpdate(jobId, {
      status: 'processing',
      progress: 10
    });

    // Extrair conteúdo dos arquivos
    const extractedContents = await Promise.all(
      files.map(async (fileUrl) => {
        const filePath = path.join(__dirname, '../..', fileUrl);
        
        if (!fs.existsSync(filePath)) {
          return { error: `Arquivo não encontrado: ${fileUrl}` };
        }

        const fileExtension = path.extname(filePath).toLowerCase();
        
        try {
          if (fileExtension === '.pdf') {
            return await extractTextFromPdf(filePath);
          } else if (['.jpg', '.jpeg', '.png', '.gif'].includes(fileExtension)) {
            // Para imagens, retornamos apenas o caminho, pois o processamento real
            // seria feito com OCR ou análise de imagem
            return { type: 'image', path: filePath };
          } else if (['.mp4', '.avi', '.mov', '.wmv'].includes(fileExtension)) {
            return await extractInfoFromVideo(filePath);
          } else if (['.mp3', '.wav', '.ogg'].includes(fileExtension)) {
            // Para áudios, retornamos apenas o caminho, pois o processamento real
            // seria feito com reconhecimento de fala
            return { type: 'audio', path: filePath };
          } else {
            return { error: `Tipo de arquivo não suportado: ${fileExtension}` };
          }
        } catch (error) {
          console.error(`Erro ao processar arquivo ${filePath}:`, error);
          return { error: `Erro ao processar arquivo: ${error.message}` };
        }
      })
    );

    // Atualizar o progresso
    await AiJob.findByIdAndUpdate(jobId, {
      progress: 50
    });

    // Filtrar conteúdos extraídos com sucesso
    const validContents = extractedContents.filter(content => !content.error);
    
    if (validContents.length === 0) {
      throw new Error('Não foi possível extrair conteúdo válido de nenhum arquivo');
    }

    // Gerar sugestões com base no conteúdo extraído e no contexto
    const suggestions = await generateSuggestions(validContents, context);

    // Atualizar o job com as sugestões geradas
    await AiJob.findByIdAndUpdate(jobId, {
      status: 'completed',
      progress: 100,
      suggestions
    });

    return { success: true, jobId };
  } catch (error) {
    console.error(`Erro no processamento do job ${jobId}:`, error);
    
    // Atualizar o status do job para 'failed'
    await AiJob.findByIdAndUpdate(jobId, {
      status: 'failed',
      error: error.message
    });
    
    throw error;
  }
});

// Funções auxiliares para processamento de arquivos

/**
 * Extrai texto de um arquivo PDF
 * @param {string} filePath - Caminho do arquivo PDF
 * @returns {Promise<Object>} - Objeto com o texto extraído
 */
async function extractTextFromPdf(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    
    return {
      type: 'pdf',
      text: data.text,
      info: {
        pageCount: data.numpages,
        author: data.info?.Author || 'Desconhecido',
        title: data.info?.Title || 'Sem título'
      }
    };
  } catch (error) {
    console.error('Erro ao extrair texto do PDF:', error);
    throw new Error(`Erro ao processar PDF: ${error.message}`);
  }
}

/**
 * Extrai informações de um arquivo de vídeo
 * @param {string} filePath - Caminho do arquivo de vídeo
 * @returns {Promise<Object>} - Objeto com informações do vídeo
 */
async function extractInfoFromVideo(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        return reject(new Error(`Erro ao processar vídeo: ${err.message}`));
      }
      
      const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
      const audioStream = metadata.streams.find(stream => stream.codec_type === 'audio');
      
      resolve({
        type: 'video',
        path: filePath,
        info: {
          duration: metadata.format.duration,
          size: metadata.format.size,
          bitrate: metadata.format.bit_rate,
          resolution: videoStream ? `${videoStream.width}x${videoStream.height}` : 'Desconhecido',
          hasAudio: !!audioStream
        }
      });
    });
  });
}

/**
 * Gera sugestões de conteúdo com base nos arquivos processados e no contexto
 * @param {Array} contents - Array de conteúdos extraídos dos arquivos
 * @param {Object} context - Contexto para geração de sugestões
 * @returns {Promise<Array>} - Array de sugestões geradas
 */
async function generateSuggestions(contents, context) {
  try {
    // Preparar o prompt para a IA
    let prompt = 'Com base nos seguintes conteúdos e contexto, gere 3 sugestões de posts para LinkedIn:\n\n';
    
    // Adicionar informações de contexto
    if (context) {
      prompt += 'CONTEXTO:\n';
      if (context.title) prompt += `Título: ${context.title}\n`;
      if (context.platform) prompt += `Plataforma: ${context.platform}\n`;
      if (context.tags && context.tags.length > 0) prompt += `Tags: ${context.tags.join(', ')}\n`;
      if (context.existingContent) prompt += `Conteúdo existente: ${context.existingContent}\n`;
      prompt += '\n';
    }
    
    // Adicionar conteúdos extraídos
    prompt += 'CONTEÚDOS EXTRAÍDOS:\n';
    contents.forEach((content, index) => {
      prompt += `Conteúdo ${index + 1} (${content.type}):\n`;
      
      if (content.type === 'pdf' && content.text) {
        // Limitar o tamanho do texto para não exceder os limites do modelo
        prompt += `${content.text.substring(0, 1000)}${content.text.length > 1000 ? '...' : ''}\n`;
      } else if (content.type === 'video' && content.info) {
        prompt += `Vídeo com duração de ${Math.floor(content.info.duration / 60)}m${Math.floor(content.info.duration % 60)}s, resolução ${content.info.resolution}\n`;
      } else if (content.type === 'image') {
        prompt += 'Imagem (conteúdo visual não extraído)\n';
      } else if (content.type === 'audio') {
        prompt += 'Áudio (conteúdo não transcrito)\n';
      }
      
      prompt += '\n';
    });
    
    // Adicionar instruções específicas
    prompt += 'INSTRUÇÕES:\n';
    prompt += '1. Gere 3 sugestões de posts para LinkedIn com base nos conteúdos acima.\n';
    prompt += '2. Cada post deve ter um título atraente e conteúdo envolvente.\n';
    prompt += '3. Inclua hashtags relevantes no final de cada post.\n';
    prompt += '4. Formate o conteúdo em HTML para incluir parágrafos, negrito e itálico quando apropriado.\n';
    prompt += '5. Cada sugestão deve ter entre 200 e 300 palavras.\n';

    // Usar OpenAI para gerar sugestões
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Você é um especialista em marketing de conteúdo para LinkedIn, focado em criar posts profissionais e envolventes." },
        { role: "user", content: prompt }
      ],
      max_tokens: 2000,
    });

    const response = completion.choices[0].message.content;
    
    // Processar a resposta para extrair as sugestões
    // Assumindo que a IA retorna as sugestões numeradas
    const suggestions = [];
    let currentSuggestion = '';
    let collecting = false;
    
    response.split('\n').forEach(line => {
      if (line.match(/^Sugestão \d+:/) || line.match(/^Post \d+:/)) {
        if (collecting && currentSuggestion.trim()) {
          suggestions.push(currentSuggestion.trim());
        }
        collecting = true;
        currentSuggestion = line + '\n';
      } else if (collecting) {
        currentSuggestion += line + '\n';
      }
    });
    
    // Adicionar a última sugestão
    if (collecting && currentSuggestion.trim()) {
      suggestions.push(currentSuggestion.trim());
    }
    
    // Se não conseguimos extrair sugestões do formato esperado, retornar a resposta completa
    if (suggestions.length === 0) {
      suggestions.push(response);
    }
    
    return suggestions;
  } catch (error) {
    console.error('Erro ao gerar sugestões:', error);
    throw new Error(`Erro ao gerar sugestões: ${error.message}`);
  }
}

// Lidar com erros na fila
aiProcessingQueue.on('error', (error) => {
  console.error('Erro na fila de processamento:', error);
});

aiProcessingQueue.on('failed', (job, error) => {
  console.error(`Job ${job.id} falhou:`, error);
});
