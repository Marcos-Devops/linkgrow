require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const routes = require('./routes');
const { connectDB } = require('./utils/database');

// Inicializa o app Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(passport.initialize());

// Configuração do Passport
require('./middleware/passport');

// Rotas
app.use('/api', routes);

// Rota de saúde
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API está funcionando corretamente!' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Erro interno do servidor'
  });
});

// Inicia o servidor
const startServer = async () => {
  try {
    // Conecta ao banco de dados (descomente quando configurar o MongoDB)
    // await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
};

startServer();
