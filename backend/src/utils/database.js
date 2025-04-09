const mongoose = require('mongoose');

/**
 * Conecta ao banco de dados MongoDB
 * @returns {Promise<void>}
 */
exports.connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/linkgrow', {
      // As opções useNewUrlParser, useUnifiedTopology, useFindAndModify e useCreateIndex
      // não são mais necessárias nas versões mais recentes do Mongoose
    });
    
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erro ao conectar ao MongoDB: ${error.message}`);
    process.exit(1);
  }
};
