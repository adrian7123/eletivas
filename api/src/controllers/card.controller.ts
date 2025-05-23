import { Request, Response } from 'express';
import Card from '../models/card';
import { WebSocketService } from '../services/websocket.service';

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
      const { content, author, medias } = req.body;

      // Validação dos campos obrigatórios
      if (!author) {
        return res.status(400).json({ message: 'Autor são obrigatórios' });
      }

      // Cria e salva o novo card
      const newCard = new Card({
        content,
        author,
        medias,
      });

      await newCard.save();

      // Notificar todos os clientes conectados sobre o novo card
      const wsService = WebSocketService.getInstance();
      wsService.notifyCardCreated(newCard);

      return res.status(201).json(newCard);
    } catch (error) {
      console.error('Erro ao criar card:', error);
      return res.status(500).json({ message: 'Erro ao criar cartão' });
    }
  }
  static async delete(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { auth } = req.query;

      if (auth !== process.env.AUTH_HASH_SECRET) {
        return res.status(401).json({ message: 'Acesso não autorizado' });
      }

      // Verifica se o card existe
      const card = await Card.findById(id);
      if (!card) {
        return res.status(404).json({ message: 'Cartão não encontrado' });
      }

      // Deleta o card
      await Card.findByIdAndDelete(id);

      // Notificar todos os clientes conectados sobre a exclusão do card
      const wsService = WebSocketService.getInstance();
      wsService.notifyCardDeleted(id);

      return res.status(200).json({ message: 'Cartão deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar card:', error);
      return res.status(500).json({ message: 'Erro ao deletar cartão' });
    }
  }
}
