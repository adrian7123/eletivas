import { Request, Response } from 'express';
import Card from '../models/card';

export class CardController {
  static async get(req: Request, res: Response): Promise<any> {
    try {
      const cards = await Card.find().sort({ createdAt: -1 });
      return res.json(cards);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar cartões' });
    }
  }
  static async create(req: Request, res: Response): Promise<any> {
    try {
      const { content, author } = req.body;

      // Validação dos campos obrigatórios
      if (!content || !author) {
        return res.status(400).json({ message: 'Conteúdo e autor são obrigatórios' });
      }

      const medias = [];

      if (req.files && Array.isArray(req.files)) {
        for (const file of req.files as Express.Multer.File[]) {
          const mediaType = file.mimetype.split('/')[0];

          // Verifica se o tipo de mídia é suportado
          if (!['image', 'audio', 'video'].includes(mediaType)) {
            continue;
          }

          medias.push({
            url: file.path, // URL já deve ter sido gerada pelo middleware de upload
            type: mediaType,
            mimeType: file.mimetype,
          });
        }
      }

      // Cria e salva o novo card
      const newCard = new Card({
        content,
        author,
        medias: medias,
      });

      await newCard.save();
      return res.status(201).json(newCard);
    } catch (error) {
      console.error('Erro ao criar card:', error);
      return res.status(500).json({ message: 'Erro ao criar cartão' });
    }
  }
}
