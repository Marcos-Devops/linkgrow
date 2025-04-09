# Imagem base
FROM node:18-alpine

# Diretório de trabalho
WORKDIR /app

# Copiar arquivos do projeto
COPY . /app

# Instalar dependências
RUN npm install

# Porta padrão
EXPOSE 3000

# Iniciar aplicação
CMD ["npm", "start"]
