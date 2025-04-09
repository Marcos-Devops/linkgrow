const app = require('./app');
const http = require('http');

// Obter a porta do ambiente ou usar a porta padrão
const port = process.env.PORT || 5000;
app.set('port', port);

// Criar o servidor HTTP
const server = http.createServer(app);

// Iniciar o servidor
server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`Documentação da API disponível em http://localhost:${port}/api-docs`);
});

// Tratamento de erros não capturados
process.on('uncaughtException', (err) => {
  console.error('Erro não capturado:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Promessa rejeitada não tratada:', err);
  process.exit(1);
});

// Tratamento de encerramento gracioso
process.on('SIGTERM', () => {
  console.log('Recebido SIGTERM. Encerrando o servidor...');
  server.close(() => {
    console.log('Servidor encerrado');
    process.exit(0);
  });
});

module.exports = server;
