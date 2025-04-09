const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const passport = require('passport');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Importar configurações
const { serve: swaggerServe, setup: swaggerSetup } = require('./config/swagger');
require('./config/passport')(passport);

// Importar rotas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const linkedinRoutes = require('./routes/linkedin.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const postRoutes = require('./routes/post.routes');
const aiRoutes = require('./routes/ai.routes');

// Inicializar o aplicativo Express
const app = express();

// Configurar middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(passport.initialize());

// Criar diretório de uploads se não existir
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Servir arquivos estáticos
app.use('/uploads', express.static(uploadDir));

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/linkgrow', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
.then(() => {
  console.log('Conectado ao MongoDB');
})
.catch(err => {
  console.error('Erro ao conectar ao MongoDB:', err);
  process.exit(1);
});

// Configurar rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/linkedin', linkedinRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/ai', aiRoutes);

// Documentação Swagger
app.use('/api-docs', swaggerServe, swaggerSetup);

// Rota de verificação de saúde
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API está funcionando corretamente',
    timestamp: new Date()
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';
  
  res.status(statusCode).json({
    status: 'error',
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Rota para lidar com rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Rota não encontrada'
  });
});

// Exportar o aplicativo
module.exports = app;
