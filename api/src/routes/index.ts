import express from 'express';
import { CardController } from '../controllers/card.controller';
import { UploadController } from '../controllers/upload.controller';
import { uploadMultiple, uploadSingle } from '../middleware/upload.middleware';

const indexRouter = express.Router();

// Rotas para cards
indexRouter.get('/cards', CardController.get);
indexRouter.post('/cards', uploadMultiple, CardController.create);

// Rotas para upload de mídias
indexRouter.post('/upload', uploadSingle, UploadController.uploadMedia);
indexRouter.post('/upload/multiple', uploadMultiple, UploadController.uploadMultipleMedias);

// Rota para visualização de mídias
indexRouter.get('/media/:mediaKey', UploadController.getMedia);

export { indexRouter };
