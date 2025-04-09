const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuração básica do Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'LinkGrow API',
      version: '1.0.0',
      description: 'API para o LinkGrow - Plataforma de gerenciamento de conteúdo para redes sociais',
      contact: {
        name: 'Falden Software',
        url: 'https://falden.io',
        email: 'contato@falden.io'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor de desenvolvimento'
      },
      {
        url: 'https://api.linkgrow.falden.io',
        description: 'Servidor de produção'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Post: {
          type: 'object',
          required: ['title', 'content', 'userId'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único do post'
            },
            userId: {
              type: 'string',
              description: 'ID do usuário que criou o post'
            },
            title: {
              type: 'string',
              description: 'Título do post'
            },
            content: {
              type: 'string',
              description: 'Conteúdo do post em formato HTML'
            },
            platform: {
              type: 'string',
              enum: ['linkedin', 'twitter', 'facebook', 'instagram'],
              description: 'Plataforma de destino do post'
            },
            scheduledDate: {
              type: 'string',
              format: 'date-time',
              description: 'Data e hora agendadas para publicação'
            },
            publishedDate: {
              type: 'string',
              format: 'date-time',
              description: 'Data e hora de publicação efetiva'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Tags associadas ao post'
            },
            status: {
              type: 'string',
              enum: ['draft', 'scheduled', 'published', 'failed'],
              description: 'Status atual do post'
            },
            media: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    enum: ['image', 'video', 'pdf', 'audio'],
                    description: 'Tipo de mídia'
                  },
                  url: {
                    type: 'string',
                    description: 'URL da mídia'
                  },
                  originalName: {
                    type: 'string',
                    description: 'Nome original do arquivo'
                  }
                }
              },
              description: 'Mídias associadas ao post'
            },
            metrics: {
              type: 'object',
              properties: {
                views: {
                  type: 'number',
                  description: 'Número de visualizações'
                },
                likes: {
                  type: 'number',
                  description: 'Número de curtidas'
                },
                comments: {
                  type: 'number',
                  description: 'Número de comentários'
                },
                shares: {
                  type: 'number',
                  description: 'Número de compartilhamentos'
                }
              },
              description: 'Métricas de engajamento do post'
            }
          }
        },
        AiJob: {
          type: 'object',
          required: ['userId', 'files'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único do job'
            },
            userId: {
              type: 'string',
              description: 'ID do usuário que criou o job'
            },
            files: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'URLs dos arquivos para processamento'
            },
            context: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  description: 'Título do conteúdo'
                },
                platform: {
                  type: 'string',
                  enum: ['linkedin', 'twitter', 'facebook', 'instagram'],
                  description: 'Plataforma de destino'
                },
                tags: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  description: 'Tags relacionadas ao conteúdo'
                },
                existingContent: {
                  type: 'string',
                  description: 'Conteúdo existente para referência'
                }
              },
              description: 'Contexto para geração de sugestões'
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'completed', 'failed'],
              description: 'Status atual do job'
            },
            progress: {
              type: 'number',
              description: 'Progresso do processamento (0-100)'
            },
            suggestions: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Sugestões geradas pela IA'
            },
            error: {
              type: 'string',
              description: 'Mensagem de erro, se houver'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error'
            },
            message: {
              type: 'string',
              example: 'Descrição do erro'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success'
            },
            message: {
              type: 'string',
              example: 'Operação realizada com sucesso'
            },
            data: {
              type: 'object',
              description: 'Dados retornados pela operação'
            }
          }
        }
      }
    }
  },
  apis: [
    './src/routes/*.js',
    './src/models/*.js'
  ]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerDocs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'LinkGrow API Documentation',
    customfavIcon: '/favicon.ico'
  })
};
