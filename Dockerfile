
# estágio de compilação
FROM node:lts-alpine as build-stage

# Cria um diretório para a aplicação
WORKDIR /app

# Copia os arquivos de definição de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Compila a aplicação
RUN npm run build
