import express from 'express';
import { CardController } from '../controllers/card.controller';
import { UploadController } from '../controllers/upload.controller';
import { UserController } from '../controllers/user.controller';
import { uploadMultiple, uploadSingle } from '../middleware/upload.middleware';

const indexRouter = express.Router();

// Rotas para cards
indexRouter.get('/cards', CardController.get);
indexRouter.post('/cards', uploadMultiple, CardController.create);
indexRouter.delete('/cards/:id', CardController.delete);

indexRouter.post('/user/login', UserController.login);

// Rotas para upload de mídias
indexRouter.post('/upload', uploadSingle, UploadController.uploadMedia);
indexRouter.post('/upload/multiple', uploadMultiple, UploadController.uploadMultipleMedias);

// Rota para visualização de mídias
indexRouter.get('/media', UploadController.getMedia);

export { indexRouter };
