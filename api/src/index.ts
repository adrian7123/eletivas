import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import path from 'path';
import { connectDB } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { indexRouter } from './routes';
import { WebSocketService } from './services/websocket.service';

// Carregar variáveis de ambiente
dotenv.config();

// Inicialização da aplicação Express
const app = express();
const PORT = process.env.PORT || 3005;

// Criar servidor HTTP
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', indexRouter);

app.use(express.static(path.join(__dirname, '../../')));

app.use(notFoundHandler);

app.use(errorHandler);

connectDB().then(() => {
  // Iniciar servidor HTTP
  server.listen(PORT, () => {
    console.log(`Servidor HTTP rodando em http://localhost:${PORT}`);

    // Inicializar serviço WebSocket
    WebSocketService.getInstance(server);
    console.log(`Servidor WebSocket iniciado na porta ${PORT}`);
  });
});
