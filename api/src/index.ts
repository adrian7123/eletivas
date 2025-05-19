import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { indexRouter } from './routes';

// Carregar variáveis de ambiente
dotenv.config();

// Inicialização da aplicação Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);

app.use(notFoundHandler);

app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
});
