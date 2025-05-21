FROM node:slim AS builder

WORKDIR /api

# Copia os arquivos de configuração
COPY package*.json ./
COPY tsconfig.json ./

# Instala as dependências
RUN npm install

# Copia o código fonte
COPY . .

# Compila o TypeScript
RUN npm run build

# Imagem de produção
FROM node:slim

WORKDIR /api

# Copia apenas o necessário para produção
COPY --from=builder /api/package*.json ./
COPY --from=builder /api/dist ./dist

# Instala apenas as dependências de produção
RUN npm ci --only=production

# Expõe a porta usada pela aplicação
EXPOSE 3005

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"]
